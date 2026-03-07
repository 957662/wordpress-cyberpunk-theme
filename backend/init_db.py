#!/usr/bin/env python3
"""
数据库初始化脚本
使用 SQLAlchemy 的 create_all() 创建所有表
"""

import sys
sys.path.insert(0, '/root/.openclaw/workspace/cyberpress-platform/backend')

from app.core.database import engine, Base
from app.models import *  # 导入所有模型

def init_database():
    """创建所有数据库表"""
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    
    # 打印创建的表
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"\nCreated {len(tables)} tables:")
    for table in sorted(tables):
        print(f"  - {table}")

if __name__ == "__main__":
    init_database()
