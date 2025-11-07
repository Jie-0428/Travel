const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// 创建上传目录
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

// 配置Multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uniqueId}${fileExtension}`);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('只允许上传图片和视频文件！'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB限制
  },
  fileFilter: fileFilter
});

// 数据存储（实际项目中应该使用数据库）
let experiences = [];

// 路由
app.get('/', (req, res) => {
  res.send('Travel Photo Sharing Backend is running!');
});

// 上传照片/视频
app.post('/api/upload', upload.single('media'), (req, res) => {
  try {
    const { title, location, description, category } = req.body;
    const mediaUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    
    const newExperience = {
      id: uuidv4(),
      title,
      location,
      description,
      category,
      mediaUrl,
      mediaType: req.file.mimetype.startsWith('image/') ? 'photo' : 'video',
      filename: req.file.filename,
      createdAt: new Date().toISOString()
    };
    
    experiences.push(newExperience);
    
    res.status(201).json({
      success: true,
      message: '上传成功！',
      data: newExperience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || '上传失败！'
    });
  }
});

// 获取所有体验
app.get('/api/experiences', (req, res) => {
  res.status(200).json({
    success: true,
    data: experiences
  });
});

// 获取单个体验
app.get('/api/experiences/:id', (req, res) => {
  const experience = experiences.find(exp => exp.id === req.params.id);
  
  if (!experience) {
    return res.status(404).json({
      success: false,
      message: '体验不存在'
    });
  }
  
  res.status(200).json({
    success: true,
    data: experience
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});