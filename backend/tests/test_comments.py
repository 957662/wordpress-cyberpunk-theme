"""
评论系统测试
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from main import app
from app.database import get_db
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment


@pytest.fixture
def client(db_session: Session):
    """创建测试客户端"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session: Session):
    """创建测试用户"""
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password="hashed_password"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_post(db_session: Session, test_user: User):
    """创建测试文章"""
    post = Post(
        title="测试文章",
        slug="test-post",
        content="这是一篇测试文章",
        author_id=test_user.id
    )
    db_session.add(post)
    db_session.commit()
    db_session.refresh(post)
    return post


class TestCommentCRUD:
    """评论CRUD操作测试"""

    def test_create_comment(self, client: TestClient, test_post: Post, test_user: User):
        """测试创建评论"""
        response = client.post(
            f"/api/v1/posts/{test_post.id}/comments",
            json={
                "content": "这是一条测试评论",
                "parent_id": None
            },
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["content"] == "这是一条测试评论"
        assert data["post_id"] == test_post.id
        assert "id" in data

    def test_create_reply(self, client: TestClient, test_post: Post, test_user: User, db_session: Session):
        """测试创建回复"""
        # 先创建父评论
        parent_comment = Comment(
            content="父评论",
            post_id=test_post.id,
            author_id=test_user.id
        )
        db_session.add(parent_comment)
        db_session.commit()

        # 创建回复
        response = client.post(
            f"/api/v1/posts/{test_post.id}/comments",
            json={
                "content": "这是一条回复",
                "parent_id": parent_comment.id
            },
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["content"] == "这是一条回复"
        assert data["parent_id"] == parent_comment.id

    def test_get_post_comments(self, client: TestClient, test_post: Post):
        """测试获取文章评论列表"""
        response = client.get(f"/api/v1/posts/{test_post.id}/comments")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_get_comment_replies(self, client: TestClient, test_post: Post, test_user: User, db_session: Session):
        """测试获取评论回复"""
        # 创建父评论和回复
        parent_comment = Comment(
            content="父评论",
            post_id=test_post.id,
            author_id=test_user.id
        )
        db_session.add(parent_comment)
        db_session.commit()

        reply = Comment(
            content="回复",
            post_id=test_post.id,
            author_id=test_user.id,
            parent_id=parent_comment.id
        )
        db_session.add(reply)
        db_session.commit()

        response = client.get(f"/api/v1/comments/{parent_comment.id}/replies")

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1

    def test_update_comment(self, client: TestClient, test_post: Post, test_user: User, db_session: Session):
        """测试更新评论"""
        comment = Comment(
            content="原始评论",
            post_id=test_post.id,
            author_id=test_user.id
        )
        db_session.add(comment)
        db_session.commit()

        response = client.put(
            f"/api/v1/comments/{comment.id}",
            json={"content": "更新后的评论"},
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["content"] == "更新后的评论"

    def test_delete_comment(self, client: TestClient, test_post: Post, test_user: User, db_session: Session):
        """测试删除评论"""
        comment = Comment(
            content="要删除的评论",
            post_id=test_post.id,
            author_id=test_user.id
        )
        db_session.add(comment)
        db_session.commit()

        response = client.delete(
            f"/api/v1/comments/{comment.id}",
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 200

        # 验证评论已被删除
        deleted_comment = db_session.query(Comment).filter(Comment.id == comment.id).first()
        assert deleted_comment is None or deleted_comment.is_deleted is True


class TestCommentValidation:
    """评论验证测试"""

    def test_empty_comment(self, client: TestClient, test_post: Post, test_user: User):
        """测试空评论内容"""
        response = client.post(
            f"/api/v1/posts/{test_post.id}/comments",
            json={"content": "", "parent_id": None},
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 422

    def test_very_long_comment(self, client: TestClient, test_post: Post, test_user: User):
        """测试超长评论内容"""
        long_content = "a" * 10000  # 超过最大长度

        response = client.post(
            f"/api/v1/posts/{test_post.id}/comments",
            json={"content": long_content, "parent_id": None},
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 422

    def test_invalid_parent_id(self, client: TestClient, test_post: Post, test_user: User):
        """测试无效的父评论ID"""
        response = client.post(
            f"/api/v1/posts/{test_post.id}/comments",
            json={"content": "测试", "parent_id": 99999},
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 404


class TestCommentPermissions:
    """评论权限测试"""

    def test_update_other_comment(self, client: TestClient, test_post: Post, test_user: User, db_session: Session):
        """测试更新他人评论（应失败）"""
        other_user = User(
            username="other",
            email="other@example.com",
            hashed_password="hashed"
        )
        db_session.add(other_user)
        db_session.commit()

        comment = Comment(
            content="他人评论",
            post_id=test_post.id,
            author_id=other_user.id
        )
        db_session.add(comment)
        db_session.commit()

        response = client.put(
            f"/api/v1/comments/{comment.id}",
            json={"content": "尝试修改"},
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 403

    def test_delete_other_comment(self, client: TestClient, test_post: Post, test_user: User, db_session: Session):
        """测试删除他人评论（应失败）"""
        other_user = User(
            username="other",
            email="other@example.com",
            hashed_password="hashed"
        )
        db_session.add(other_user)
        db_session.commit()

        comment = Comment(
            content="他人评论",
            post_id=test_post.id,
            author_id=other_user.id
        )
        db_session.add(comment)
        db_session.commit()

        response = client.delete(
            f"/api/v1/comments/{comment.id}",
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 403


class TestCommentModeration:
    """评论审核测试"""

    def test_admin_approve_comment(self, client: TestClient, test_post: Post, test_user: User, db_session: Session):
        """测试管理员审核通过评论"""
        # 创建管理员用户
        admin = User(
            username="admin",
            email="admin@example.com",
            hashed_password="hashed",
            is_admin=True
        )
        db_session.add(admin)
        db_session.commit()

        comment = Comment(
            content="待审核评论",
            post_id=test_post.id,
            author_id=test_user.id,
            is_approved=False
        )
        db_session.add(comment)
        db_session.commit()

        response = client.post(
            f"/api/v1/admin/comments/{comment.id}/approve",
            headers={"Authorization": f"Bearer {admin.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["is_approved"] is True

    def test_admin_reject_comment(self, client: TestClient, test_post: Post, test_user: User, db_session: Session):
        """测试管理员拒绝评论"""
        admin = User(
            username="admin",
            email="admin@example.com",
            hashed_password="hashed",
            is_admin=True
        )
        db_session.add(admin)
        db_session.commit()

        comment = Comment(
            content="待审核评论",
            post_id=test_post.id,
            author_id=test_user.id,
            is_approved=False
        )
        db_session.add(comment)
        db_session.commit()

        response = client.post(
            f"/api/v1/admin/comments/{comment.id}/reject",
            headers={"Authorization": f"Bearer {admin.id}"}
        )

        assert response.status_code == 200


class TestCommentStatistics:
    """评论统计测试"""

    def test_get_comment_count(self, client: TestClient, test_post: Post):
        """测试获取文章评论数"""
        response = client.get(f"/api/v1/posts/{test_post.id}/comments/count")

        assert response.status_code == 200
        data = response.json()
        assert "count" in data

    def test_get_user_comments(self, client: TestClient, test_user: User):
        """测试获取用户评论列表"""
        response = client.get(
            f"/api/v1/users/{test_user.id}/comments",
            headers={"Authorization": f"Bearer {test_user.id}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
