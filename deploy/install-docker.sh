#!/bin/bash
# 安装 Docker (使用清华镜像源)

# 配置清华 Docker 镜像源
cat > /etc/yum.repos.d/docker-ce.repo << 'EOF'
[docker-ce-stable]
name=Docker CE Stable - $basearch
baseurl=https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/centos/9/$basearch/stable
enabled=1
gpgcheck=0
EOF

# 清理并重建缓存
dnf clean all
dnf makecache

# 安装 Docker
dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker
systemctl start docker
systemctl enable docker

# 配置 Docker 镜像加速
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
EOF

systemctl restart docker

# 验证安装
docker --version
docker compose version

echo ""
echo "✓ Docker 安装完成！"
