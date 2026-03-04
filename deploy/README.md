# CyberPress 部署工具

## 快速部署（一键部署）

```bash
# 完整部署流程
bash deploy/package.sh  # 打包
bash deploy/upload.sh   # 上传
bash deploy/deploy.sh   # 部署
```

## 分步操作

### 1. 打包项目

```bash
bash deploy/package.sh
```

这会创建一个时间戳命名的压缩包，例如：`cyberpress_20260305_050000.tar.gz`

### 2. 上传到服务器

```bash
bash deploy/upload.sh
```

上传到服务器 `~/deploy/` 目录

### 3. 部署

```bash
bash deploy/deploy.sh
```

自动完成：
- 解压文件
- 配置环境变量
- 启动 Docker 服务

## 访问地址

部署完成后：

- **前端**: http://43.139.128.127:3000
- **后端 API**: http://43.139.128.127:8000
- **API 文档**: http://43.139.128.127:8000/docs

## 端口说明

- 3000: Next.js 前端
- 8000: FastAPI 后端
- 5432: PostgreSQL
- 6379: Redis

## 手动操作

### 登录服务器

```bash
ssh ubuntu@43.139.128.127
```

### 查看服务状态

```bash
cd /var/www/cyberpress
docker-compose ps
docker-compose logs -f
```

### 重启服务

```bash
cd /var/www/cyberpress
docker-compose restart
```

### 停止服务

```bash
cd /var/www/cyberpress
docker-compose down
```

## 文件结构

```
deploy/
├── package.sh    # 打包脚本
├── upload.sh     # 上传脚本
├── deploy.sh     # 部署脚本
└── README.md     # 本文档
```

## 注意事项

1. **首次部署**需要安装 Docker 和 Docker Compose
2. **防火墙**需要开放 3000 和 8000 端口
3. **生产环境**请修改默认密码和密钥
4. **定期备份**数据库和上传的文件

## 故障排查

### 查看日志

```bash
docker-compose logs -f
```

### 检查端口

```bash
netstat -tlnp | grep -E '3000|8000'
```

### 检查 Docker

```bash
docker ps
docker-compose ps
```
