"""
数据库初始化脚本
用于创建数据库、运行迁移、填充示例数据
"""

import asyncio
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.base import Base
from app.models import (
    user,
    follow,
    notification,
    comment,
    post,
    social
)


def create_database():
    """创建数据库（如果不存在）"""
    print("🔧 检查数据库连接...")

    # 连接到 PostgreSQL 默认数据库
    engine = create_engine(
        f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}/postgres",
        echo=False
    )

    # 检查数据库是否存在
    with engine.connect() as conn:
        conn.execute(text("COMMIT"))
        result = conn.execute(
            text(f"SELECT 1 FROM pg_database WHERE datname='{settings.DB_NAME}'")
        )
        database_exists = result.fetchone() is not None

        if not database_exists:
            print(f"📊 创建数据库: {settings.DB_NAME}")
            conn.execute(text(f"CREATE DATABASE {settings.DB_NAME}"))
            conn.execute(text("COMMIT"))
            print(f"✅ 数据库 {settings.DB_NAME} 创建成功")
        else:
            print(f"✅ 数据库 {settings.DB_NAME} 已存在")

    engine.dispose()


def run_migrations():
    """运行数据库迁移"""
    print("\n🔄 运行数据库迁移...")

    import subprocess

    try:
        # 运行 alembic 升级
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            capture_output=True,
            text=True,
            check=True
        )
        print("✅ 数据库迁移完成")
        if result.stdout:
            print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"❌ 数据库迁移失败: {e.stderr}")
        raise


def create_tables():
    """创建所有表"""
    print("\n📋 创建数据库表...")

    engine = create_engine(settings.DATABASE_URL, echo=False)

    # 创建所有表
    Base.metadata.create_all(bind=engine)

    print("✅ 数据库表创建成功")

    engine.dispose()


def drop_tables():
    """删除所有表（谨慎使用）"""
    print("\n⚠️  警告: 即将删除所有数据库表!")

    confirm = input("确定要删除所有表吗? (yes/no): ")
    if confirm.lower() != 'yes':
        print("❌ 操作已取消")
        return

    print("🗑️  删除数据库表...")

    engine = create_engine(settings.DATABASE_URL, echo=False)

    # 删除所有表
    Base.metadata.drop_all(bind=engine)

    print("✅ 数据库表删除成功")

    engine.dispose()


def seed_data():
    """填充示例数据"""
    print("\n🌱 填充示例数据...")

    from app.core.database import SessionLocal
    from app.models.user import User
    from app.core.security import get_password_hash

    db = SessionLocal()

    try:
        # 检查是否已有用户
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"⚠️  数据库中已有 {existing_users} 个用户，跳过数据填充")
            return

        # 创建管理员用户
        admin = User(
            username="admin",
            email="admin@cyberpress.dev",
            displayName="管理员",
            hashedPassword=get_password_hash("admin123"),
            isActive=True,
            isAdmin=True,
            bio="系统管理员",
            location="CyberSpace"
        )
        db.add(admin)

        # 创建测试用户
        test_user = User(
            username="testuser",
            email="test@example.com",
            displayName="测试用户",
            hashedPassword=get_password_hash("test123"),
            isActive=True,
            bio="这是一个测试用户",
            location="测试城市"
        )
        db.add(test_user)

        # 创建更多测试用户
        for i in range(1, 6):
            user = User(
                username=f"user{i}",
                email=f"user{i}@example.com",
                displayName=f"用户{i}",
                hashedPassword=get_password_hash("password123"),
                isActive=True,
                bio=f"这是用户{i}的个人简介",
            )
            db.add(user)

        db.commit()

        print("✅ 示例数据填充成功")
        print(f"   - 创建了 {db.query(User).count()} 个用户")
        print(f"   - 管理员账号: admin / admin123")
        print(f"   - 测试账号: testuser / test123")

    except Exception as e:
        print(f"❌ 填充数据失败: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


def reset_database():
    """重置数据库（删除所有表并重新创建）"""
    print("\n🔄 重置数据库...")

    drop_tables()
    create_tables()
    seed_data()

    print("\n✅ 数据库重置完成")


def show_status():
    """显示数据库状态"""
    print("\n📊 数据库状态...")

    from app.core.database import SessionLocal
    from app.models.user import User
    from app.models.post import Post
    from app.models.comment import Comment
    from app.models.follow import Follow
    from app.models.notification import Notification

    db = SessionLocal()

    try:
        user_count = db.query(User).count()
        post_count = db.query(Post).count() if hasattr(Post, '__tablename__') else 0
        comment_count = db.query(Comment).count() if hasattr(Comment, '__tablename__') else 0
        follow_count = db.query(Follow).count() if hasattr(Follow, '__tablename__') else 0
        notification_count = db.query(Notification).count() if hasattr(Notification, '__tablename__') else 0

        print(f"   用户数: {user_count}")
        print(f"   文章数: {post_count}")
        print(f"   评论数: {comment_count}")
        print(f"   关注关系: {follow_count}")
        print(f"   通知数: {notification_count}")

    finally:
        db.close()


def main():
    """主函数"""
    print("=" * 60)
    print("🚀 CyberPress 数据库初始化工具")
    print("=" * 60)

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "create":
            create_database()
        elif command == "migrate":
            run_migrations()
        elif command == "tables":
            create_tables()
        elif command == "drop":
            drop_tables()
        elif command == "seed":
            seed_data()
        elif command == "reset":
            reset_database()
        elif command == "status":
            show_status()
        elif command == "init":
            # 完整初始化流程
            create_database()
            run_migrations()
            seed_data()
            show_status()
        else:
            print(f"\n❌ 未知命令: {command}")
            print_usage()
    else:
        print_usage()


def print_usage():
    """打印使用说明"""
    print("\n📖 使用方法:")
    print("  python scripts/init_database.py <command>")
    print("\n可用命令:")
    print("  init    - 完整初始化（创建数据库、运行迁移、填充数据）")
    print("  create  - 创建数据库")
    print("  migrate - 运行数据库迁移")
    print("  tables  - 创建数据库表")
    print("  drop    - 删除所有数据库表（谨慎使用）")
    print("  seed    - 填充示例数据")
    print("  reset   - 重置数据库（删除并重新创建）")
    print("  status  - 显示数据库状态")
    print("\n示例:")
    print("  python scripts/init_database.py init")
    print("  python scripts/init_database.py reset")
    print("  python scripts/init_database.py status")


if __name__ == "__main__":
    try:
        main()
        print("\n✅ 操作完成!")
    except Exception as e:
        print(f"\n❌ 错误: {str(e)}")
        sys.exit(1)
