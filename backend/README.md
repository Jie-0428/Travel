# 旅行照片分享网站后端

这是一个基于Node.js和Express的简单后端服务，用于实现照片上传功能。

## 技术栈

- Node.js
- Express
- Multer（文件上传）
- Cors（跨域支持）
- UUID（生成唯一ID）

## 设置说明

1. 安装依赖

```bash
npm install
```

2. 启动服务

```bash
# 生产模式
npm start

# 开发模式（使用nodemon，支持热重载）
npm run dev
```

3. 服务将在 http://localhost:3000 启动

## API端点

### 上传照片/视频
- **URL**: `/api/upload`
- **方法**: `POST`
- **表单数据**:
  - `title`: 标题
  - `location`: 地点
  - `description`: 描述
  - `category`: 类别
  - `media`: 媒体文件（图片或视频）

### 获取所有体验
- **URL**: `/api/experiences`
- **方法**: `GET`

### 获取单个体验
- **URL**: `/api/experiences/:id`
- **方法**: `GET`

## 注意事项

- 上传的文件大小限制为10MB
- 支持的文件类型：JPEG, JPG, PNG, GIF, MP4
- 上传的文件存储在 `uploads` 目录中
- 当前数据存储在内存中，服务器重启后数据会丢失（实际项目中应使用数据库）