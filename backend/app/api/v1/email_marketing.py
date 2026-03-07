"""
Email Marketing API Routes
"""
from datetime import datetime, timedelta
from typing import List
import json
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.email_marketing import EmailCampaign, EmailMessage, EmailTemplate, EmailSubscriber, CampaignStatus
from app.schemas.email_marketing import (
    EmailCampaignCreate,
    EmailCampaignUpdate,
    EmailCampaignResponse,
    EmailCampaignList,
    EmailCampaignStats,
    EmailMessageResponse,
    EmailTemplateCreate,
    EmailTemplateUpdate,
    EmailTemplateResponse,
    EmailTemplateList,
    EmailSubscriberCreate,
    EmailSubscriberUpdate,
    EmailSubscriberResponse,
    EmailSubscriberList,
    UnsubscribeRequest,
)

router = APIRouter(prefix="/email-marketing", tags=["Email Marketing"])


# ============ 邮件活动 ============

@router.post("/campaigns", response_model=EmailCampaignResponse, status_code=status.HTTP_201_CREATED)
def create_campaign(
    data: EmailCampaignCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    创建邮件营销活动

    - **name**: 活动名称
    - **subject**: 邮件主题
    - **content_html**: HTML 内容
    - **recipient_list**: 收件人用户ID列表
    - **scheduled_at**: 排期发送时间（可选）
    """
    # 验证收件人
    recipient_list = json.dumps(data.recipient_list)
    recipient_count = len(data.recipient_list)

    # 创建活动
    campaign = EmailCampaign(
        user_id=current_user.id,
        name=data.name,
        subject=data.subject,
        preheader=data.preheader,
        content_html=data.content_html,
        content_text=data.content_text,
        template_id=data.template_id,
        recipient_list=recipient_list,
        segment_id=data.segment_id,
        recipient_count=recipient_count,
        track_opens=data.track_opens,
        track_clicks=data.track_clicks,
        scheduled_at=data.scheduled_at,
        status=CampaignStatus.DRAFT if not data.scheduled_at else CampaignStatus.SCHEDULED,
    )

    db.add(campaign)
    db.commit()
    db.refresh(campaign)

    # 如果已排期，添加后台任务
    if data.scheduled_at:
        background_tasks.add_task(send_scheduled_campaign, campaign.id, db)

    return EmailCampaignResponse.from_orm(campaign)


async def send_scheduled_campaign(campaign_id: int, db: Session):
    """发送排期的邮件活动（后台任务）"""
    campaign = db.query(EmailCampaign).filter(EmailCampaign.id == campaign_id).first()
    if not campaign or campaign.status != CampaignStatus.SCHEDULED:
        return

    try:
        campaign.status = CampaignStatus.SENDING
        db.commit()

        # 这里实现实际的邮件发送逻辑
        # 1. 为每个收件人创建邮件消息
        # 2. 发送邮件
        # 3. 更新统计

        # 模拟发送
        recipients = json.loads(campaign.recipient_list)
        for user_id in recipients:
            message = EmailMessage(
                campaign_id=campaign_id,
                user_id=user_id,
                to_email=f"user{user_id}@example.com",  # 实际应从用户表获取
                subject=campaign.subject,
            )
            db.add(message)

        campaign.status = CampaignStatus.SENT
        campaign.sent_at = datetime.utcnow()
        campaign.sent_count = len(recipients)
        campaign.delivered_count = len(recipients)  # 假设全部送达
        db.commit()

    except Exception as e:
        campaign.status = CampaignStatus.FAILED
        db.commit()


@router.get("/campaigns", response_model=EmailCampaignList)
def list_campaigns(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None, description="状态过滤"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取邮件活动列表

    支持按状态过滤和分页
    """
    query = db.query(EmailCampaign).filter(EmailCampaign.user_id == current_user.id)

    if status:
        query = query.filter(EmailCampaign.status == status)

    total = query.count()

    campaigns = (
        query.order_by(desc(EmailCampaign.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

    return EmailCampaignList(
        total=total,
        items=[EmailCampaignResponse.from_orm(c) for c in campaigns],
        page=skip // limit + 1,
        page_size=limit,
    )


@router.get("/campaigns/stats", response_model=EmailCampaignStats)
def get_campaign_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取邮件活动统计

    返回邮件活动的整体统计数据
    """
    campaigns = db.query(EmailCampaign).filter(EmailCampaign.user_id == current_user.id).all()

    total_sent = sum(c.sent_count for c in campaigns)
    total_opened = sum(c.opened_count for c in campaigns)
    total_clicked = sum(c.clicked_count for c in campaigns)
    total_delivered = sum(c.delivered_count for c in campaigns)

    avg_open_rate = sum(c.open_rate for c in campaigns) / len(campaigns) if campaigns else 0
    avg_click_rate = sum(c.click_rate for c in campaigns) / len(campaigns) if campaigns else 0

    return EmailCampaignStats(
        total_campaigns=len(campaigns),
        active_campaigns=len([c for c in campaigns if c.status in [CampaignStatus.SENDING, CampaignStatus.SCHEDULED]]),
        total_sent=total_sent,
        total_opened=total_opened,
        total_clicked=total_clicked,
        avg_open_rate=round(avg_open_rate, 2),
        avg_click_rate=round(avg_click_rate, 2),
    )


@router.get("/campaigns/{campaign_id}", response_model=EmailCampaignResponse)
def get_campaign(
    campaign_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取邮件活动详情"""
    campaign = (
        db.query(EmailCampaign)
        .filter(EmailCampaign.id == campaign_id, EmailCampaign.user_id == current_user.id)
        .first()
    )

    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )

    return EmailCampaignResponse.from_orm(campaign)


@router.put("/campaigns/{campaign_id}", response_model=EmailCampaignResponse)
def update_campaign(
    campaign_id: int,
    data: EmailCampaignUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """更新邮件活动"""
    campaign = (
        db.query(EmailCampaign)
        .filter(EmailCampaign.id == campaign_id, EmailCampaign.user_id == current_user.id)
        .first()
    )

    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )

    # 更新字段
    if data.name is not None:
        campaign.name = data.name
    if data.subject is not None:
        campaign.subject = data.subject
    if data.preheader is not None:
        campaign.preheader = data.preheader
    if data.content_html is not None:
        campaign.content_html = data.content_html
    if data.content_text is not None:
        campaign.content_text = data.content_text
    if data.template_id is not None:
        campaign.template_id = data.template_id
    if data.recipient_list is not None:
        campaign.recipient_list = json.dumps(data.recipient_list)
        campaign.recipient_count = len(data.recipient_list)
    if data.segment_id is not None:
        campaign.segment_id = data.segment_id
    if data.track_opens is not None:
        campaign.track_opens = data.track_opens
    if data.track_clicks is not None:
        campaign.track_clicks = data.track_clicks
    if data.scheduled_at is not None:
        campaign.scheduled_at = data.scheduled_at
    if data.status is not None:
        campaign.status = data.status

    db.commit()
    db.refresh(campaign)

    return EmailCampaignResponse.from_orm(campaign)


@router.delete("/campaigns/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campaign(
    campaign_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """删除邮件活动"""
    campaign = (
        db.query(EmailCampaign)
        .filter(EmailCampaign.id == campaign_id, EmailCampaign.user_id == current_user.id)
        .first()
    )

    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )

    db.delete(campaign)
    db.commit()

    return None


@router.get("/campaigns/{campaign_id}/messages", response_model=List[EmailMessageResponse])
def get_campaign_messages(
    campaign_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取活动的邮件消息列表"""
    # 验证所有权
    campaign = (
        db.query(EmailCampaign)
        .filter(EmailCampaign.id == campaign_id, EmailCampaign.user_id == current_user.id)
        .first()
    )

    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )

    messages = (
        db.query(EmailMessage)
        .filter(EmailMessage.campaign_id == campaign_id)
        .order_by(desc(EmailMessage.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [EmailMessageResponse.from_orm(m) for m in messages]


# ============ 邮件模板 ============

@router.post("/templates", response_model=EmailTemplateResponse, status_code=status.HTTP_201_CREATED)
def create_template(
    data: EmailTemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """创建邮件模板"""
    template = EmailTemplate(
        user_id=current_user.id,
        name=data.name,
        description=data.description,
        subject=data.subject,
        html_content=data.html_content,
        text_content=data.text_content,
        category=data.category,
        thumbnail=data.thumbnail,
        variables=data.variables,
    )

    db.add(template)
    db.commit()
    db.refresh(template)

    return EmailTemplateResponse.from_orm(template)


@router.get("/templates", response_model=EmailTemplateList)
def list_templates(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = Query(None, description="分类过滤"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取邮件模板列表"""
    query = db.query(EmailTemplate).filter(
        EmailTemplate.user_id == current_user.id,
        EmailTemplate.is_active == True
    )

    if category:
        query = query.filter(EmailTemplate.category == category)

    total = query.count()

    templates = (
        query.order_by(desc(EmailTemplate.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

    return EmailTemplateList(
        total=total,
        items=[EmailTemplateResponse.from_orm(t) for t in templates],
        page=skip // limit + 1,
        page_size=limit,
    )


@router.get("/templates/{template_id}", response_model=EmailTemplateResponse)
def get_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取邮件模板详情"""
    template = (
        db.query(EmailTemplate)
        .filter(EmailTemplate.id == template_id, EmailTemplate.user_id == current_user.id)
        .first()
    )

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )

    return EmailTemplateResponse.from_orm(template)


@router.put("/templates/{template_id}", response_model=EmailTemplateResponse)
def update_template(
    template_id: int,
    data: EmailTemplateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """更新邮件模板"""
    template = (
        db.query(EmailTemplate)
        .filter(EmailTemplate.id == template_id, EmailTemplate.user_id == current_user.id)
        .first()
    )

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )

    # 更新字段
    if data.name is not None:
        template.name = data.name
    if data.description is not None:
        template.description = data.description
    if data.subject is not None:
        template.subject = data.subject
    if data.html_content is not None:
        template.html_content = data.html_content
    if data.text_content is not None:
        template.text_content = data.text_content
    if data.category is not None:
        template.category = data.category
    if data.thumbnail is not None:
        template.thumbnail = data.thumbnail
    if data.variables is not None:
        template.variables = data.variables
    if data.is_active is not None:
        template.is_active = data.is_active

    db.commit()
    db.refresh(template)

    return EmailTemplateResponse.from_orm(template)


@router.delete("/templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """删除邮件模板"""
    template = (
        db.query(EmailTemplate)
        .filter(EmailTemplate.id == template_id, EmailTemplate.user_id == current_user.id)
        .first()
    )

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )

    db.delete(template)
    db.commit()

    return None


# ============ 邮件订阅者 ============

@router.post("/subscribers", response_model=EmailSubscriberResponse, status_code=status.HTTP_201_CREATED)
def create_subscriber(
    data: EmailSubscriberCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """创建邮件订阅者"""
    # 检查邮箱是否已存在
    existing = db.query(EmailSubscriber).filter(EmailSubscriber.email == data.email).first()
    if existing:
        # 如果已存在但未激活，则重新激活
        if not existing.is_active:
            existing.resubscribe()
            existing.name = data.name
            if data.preferences:
                existing.preferences = data.preferences
            db.commit()
            db.refresh(existing)
            return EmailSubscriberResponse.from_orm(existing)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already subscribed"
            )

    subscriber = EmailSubscriber(
        email=data.email,
        name=data.name,
        preferences=data.preferences,
    )

    db.add(subscriber)
    db.commit()
    db.refresh(subscriber)

    return EmailSubscriberResponse.from_orm(subscriber)


@router.get("/subscribers", response_model=EmailSubscriberList)
def list_subscribers(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[bool] = Query(None, description="状态过滤"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取邮件订阅者列表"""
    query = db.query(EmailSubscriber)

    if status is not None:
        query = query.filter(EmailSubscriber.is_active == status)

    total = query.count()

    subscribers = (
        query.order_by(desc(EmailSubscriber.subscribed_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

    return EmailSubscriberList(
        total=total,
        items=[EmailSubscriberResponse.from_orm(s) for s in subscribers],
        page=skip // limit + 1,
        page_size=limit,
    )


@router.post("/unsubscribe", status_code=status.HTTP_200_OK)
def unsubscribe(
    data: UnsubscribeRequest,
    db: Session = Depends(get_db),
):
    """取消订阅"""
    subscriber = db.query(EmailSubscriber).filter(EmailSubscriber.email == data.email).first()

    if subscriber:
        subscriber.unsubscribe(data.reason)
        db.commit()

    return {"message": "Successfully unsubscribed"}


@router.delete("/subscribers/{subscriber_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subscriber(
    subscriber_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """删除邮件订阅者"""
    subscriber = db.query(EmailSubscriber).filter(EmailSubscriber.id == subscriber_id).first()

    if not subscriber:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscriber not found"
        )

    db.delete(subscriber)
    db.commit()

    return None
