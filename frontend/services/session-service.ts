/**
 * 会话管理服务
 * 管理用户会话状态、活动追踪、会话恢复
 */

import { authUser, AuthTokens } from './auth-service';

export interface SessionActivity {
  id: string;
  userId: number;
  type: 'page_view' | 'post_view' | 'search' | 'comment' | 'like' | 'download';
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface UserSession {
  sessionId: string;
  userId: number;
  startTime: number;
  lastActivity: number;
  activities: SessionActivity[];
  metadata: {
    userAgent: string;
    platform: string;
    language: string;
    timezone: string;
  };
}

export interface SessionStats {
  totalSessions: number;
  currentSessionDuration: number;
  totalPageViews: number;
  totalReadingTime: number;
  lastVisit: number;
}

class SessionService {
  private static instance: SessionService;
  private readonly SESSION_KEY = 'user_session';
  private readonly STATS_KEY = 'session_stats';
  private readonly ACTIVITY_KEY = 'session_activities';
  private readonly ACTIVITY_LIMIT = 100;

  private currentSession: UserSession | null = null;
  private activityQueue: SessionActivity[] = [];
  private saveTimer: NodeJS.Timeout | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.loadSession();
      this.setupActivityTracking();
    }
  }

  static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  /**
   * 创建新会话
   */
  createSession(userId: number): UserSession {
    const session: UserSession = {
      sessionId: this.generateSessionId(),
      userId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      activities: [],
      metadata: this.getSessionMetadata(),
    };

    this.currentSession = session;
    this.saveSession();
    this.trackActivity('page_view', { path: window.location.pathname });

    return session;
  }

  /**
   * 获取当前会话
   */
  getCurrentSession(): UserSession | null {
    return this.currentSession;
  }

  /**
   * 更新会话活动
   */
  updateActivity(): void {
    if (!this.currentSession) {
      return;
    }

    this.currentSession.lastActivity = Date.now();
    this.scheduleSave();
  }

  /**
   * 追踪用户活动
   */
  trackActivity(
    type: SessionActivity['type'],
    metadata?: Record<string, any>
  ): void {
    if (!this.currentSession) {
      return;
    }

    const activity: SessionActivity = {
      id: this.generateActivityId(),
      userId: this.currentSession.userId,
      type,
      metadata,
      timestamp: Date.now(),
    };

    this.activityQueue.push(activity);
    this.currentSession.activities.push(activity);

    // 限制活动记录数量
    if (this.currentSession.activities.length > this.ACTIVITY_LIMIT) {
      this.currentSession.activities = this.currentSession.activities.slice(-this.ACTIVITY_LIMIT);
    }

    this.scheduleSave();
  }

  /**
   * 结束会话
   */
  endSession(): void {
    if (!this.currentSession) {
      return;
    }

    // 更新统计数据
    const stats = this.getStats();
    stats.totalSessions++;
    stats.currentSessionDuration = Date.now() - this.currentSession.startTime;
    stats.lastVisit = this.currentSession.startTime;

    // 计算页面浏览量
    stats.totalPageViews = this.currentSession.activities.filter(
      a => a.type === 'page_view'
    ).length;

    // 计算阅读时间（文章浏览时间超过30秒）
    stats.totalReadingTime = this.calculateReadingTime();

    this.saveStats(stats);
    this.clearSession();
  }

  /**
   * 获取会话统计
   */
  getStats(): SessionStats {
    if (typeof window === 'undefined') {
      return this.getDefaultStats();
    }

    const statsData = localStorage.getItem(this.STATS_KEY);
    return statsData ? JSON.parse(statsData) : this.getDefaultStats();
  }

  /**
   * 恢复上一个会话
   */
  restoreSession(userId: number): boolean {
    const sessionData = localStorage.getItem(this.SESSION_KEY);

    if (!sessionData) {
      return false;
    }

    try {
      const session: UserSession = JSON.parse(sessionData);

      // 检查会话是否有效（同一用户且在24小时内）
      const sessionAge = Date.now() - session.lastActivity;
      const isSameUser = session.userId === userId;
      const isRecent = sessionAge < 24 * 60 * 60 * 1000;

      if (isSameUser && isRecent) {
        this.currentSession = session;
        this.trackActivity('page_view', {
          path: window.location.pathname,
          restored: true,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to restore session:', error);
      return false;
    }
  }

  /**
   * 获取最近活动
   */
  getRecentActivities(limit: number = 10): SessionActivity[] {
    if (!this.currentSession) {
      return [];
    }

    return this.currentSession.activities
      .slice(-limit)
      .reverse();
  }

  /**
   * 清除会话数据
   */
  clearSession(): void {
    this.currentSession = null;
    this.activityQueue = [];

    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.ACTIVITY_KEY);
    }
  }

  /**
   * 导出会话数据
   */
  exportSessionData(): string {
    if (!this.currentSession) {
      return '';
    }

    return JSON.stringify({
      session: this.currentSession,
      stats: this.getStats(),
    }, null, 2);
  }

  /**
   * 生成会话 ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成活动 ID
   */
  private generateActivityId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取会话元数据
   */
  private getSessionMetadata(): UserSession['metadata'] {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  /**
   * 加载会话
   */
  private loadSession(): void {
    const sessionData = localStorage.getItem(this.SESSION_KEY);

    if (sessionData) {
      try {
        this.currentSession = JSON.parse(sessionData);
      } catch (error) {
        console.error('Failed to load session:', error);
      }
    }

    // 加载活动队列
    const activityData = localStorage.getItem(this.ACTIVITY_KEY);
    if (activityData) {
      try {
        this.activityQueue = JSON.parse(activityData);
      } catch (error) {
        console.error('Failed to load activities:', error);
      }
    }
  }

  /**
   * 保存会话
   */
  private saveSession(): void {
    if (!this.currentSession || typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(this.currentSession));
    localStorage.setItem(this.ACTIVITY_KEY, JSON.stringify(this.activityQueue));
  }

  /**
   * 调度保存操作
   */
  private scheduleSave(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }

    // 延迟1秒保存，避免频繁写入
    this.saveTimer = setTimeout(() => {
      this.saveSession();
      this.saveTimer = null;
    }, 1000);
  }

  /**
   * 保存统计
   */
  private saveStats(stats: SessionStats): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }

  /**
   * 获取默认统计
   */
  private getDefaultStats(): SessionStats {
    return {
      totalSessions: 0,
      currentSessionDuration: 0,
      totalPageViews: 0,
      totalReadingTime: 0,
      lastVisit: 0,
    };
  }

  /**
   * 计算阅读时间
   */
  private calculateReadingTime(): number {
    const postViews = this.currentSession!.activities.filter(
      a => a.type === 'post_view'
    );

    let readingTime = 0;

    postViews.forEach(view => {
      const duration = view.metadata?.duration || 0;
      if (duration > 30) {
        readingTime += duration;
      }
    });

    return readingTime;
  }

  /**
   * 设置活动追踪
   */
  private setupActivityTracking(): void {
    // 追踪页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.updateActivity();
      }
    });

    // 追踪页面卸载
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    // 定期更新活动时间
    setInterval(() => {
      this.updateActivity();
    }, 60 * 1000); // 每分钟更新一次
  }
}

// 导出单例实例
export const sessionService = SessionService.getInstance();

// 导出便捷 Hook 生成器
export function createSessionHook() {
  return {
    createSession: (userId: number) => sessionService.createSession(userId),
    getCurrentSession: () => sessionService.getCurrentSession(),
    trackActivity: (type: SessionActivity['type'], metadata?: Record<string, any>) =>
      sessionService.trackActivity(type, metadata),
    endSession: () => sessionService.endSession(),
    getStats: () => sessionService.getStats(),
    restoreSession: (userId: number) => sessionService.restoreSession(userId),
    getRecentActivities: (limit?: number) => sessionService.getRecentActivities(limit),
    clearSession: () => sessionService.clearSession(),
    exportSessionData: () => sessionService.exportSessionData(),
  };
}
