# 🏗️ WordPress Cyberpunk Theme - 架构图集

> **系统架构可视化文档**
> **版本**: 2.1.0
> **日期**: 2026-02-28

---

## 📊 目录

1. [整体系统架构](#整体系统架构)
2. [前端架构](#前端架构)
3. [后端架构](#后端架构)
4. [数据库架构](#数据库架构)
5. [组件架构](#组件架构)
6. [数据流架构](#数据流架构)
7. [部署架构](#部署架构)

---

## 整体系统架构

### 三层架构视图

```mermaid
graph TB
    subgraph "表现层 Presentation Layer"
        A1[桌面浏览器]
        A2[移动浏览器]
        A3[平板浏览器]
    end

    subgraph "应用层 Application Layer"
        B1[WordPress Core]
        B2[Cyberpunk Theme]
        B3[Plugins]
    end

    subgraph "数据层 Data Layer"
        C1[MySQL Database]
        C2[Redis Cache]
        C3[File System]
    end

    A1 --> B1
    A2 --> B1
    A3 --> B1
    B1 --> B2
    B1 --> B3
    B2 --> C1
    B2 --> C2
    B2 --> C3
    B3 --> C1

    style A1 fill:#e1f5ff
    style A2 fill:#e1f5ff
    style A3 fill:#e1f5ff
    style B2 fill:#00f0ff,stroke:#333,stroke-width:3px
    style C2 fill:#ff00ff,stroke:#333,stroke-width:2px
```

### 微服务化视图

```mermaid
graph LR
    subgraph "客户端"
        A[用户界面]
    end

    subgraph "前端服务"
        B1[模板渲染]
        B2[静态资源]
        B3[AJAX API]
    end

    subgraph "业务逻辑"
        C1[内容管理]
        C2[主题定制]
        C3[用户交互]
        C4[SEO 优化]
    end

    subgraph "数据服务"
        D1[内容存储]
        D2[缓存服务]
        D3[会话管理]
    end

    A --> B1
    A --> B2
    A --> B3
    B1 --> C1
    B2 --> C2
    B3 --> C3
    C1 --> D1
    C2 --> D1
    C3 --> D2
    C4 --> D3
```

---

## 前端架构

### 前端组件树

```mermaid
graph TB
    ROOT[主题根]

    ROOT --> HEADER[Header 组件]
    HEADER --> Logo[Logo]
    HEADER --> Nav[主导航]
    HEADER --> Search[搜索按钮]
    HEADER --> MobileBtn[移动菜单按钮]

    ROOT --> MAIN[Main 内容区]
    MAIN --> Hero[Hero Section]
    MAIN --> Content[内容循环]
    Content --> PostCard[文章卡片 x N]
    MAIN --> Pagination[分页/Load More]

    ROOT --> SIDEBAR[Sidebar 侧边栏]
    SIDEBAR --> Widget1[Widget 1]
    SIDEBAR --> Widget2[Widget 2]
    SIDEBAR --> Widget3[Widget 3]

    ROOT --> FOOTER[Footer 页脚]
    FOOTER --> FooterWidgets[Footer Widgets]
    FOOTER --> Copyright[版权信息]
    FOOTER --> SocialLinks[社交链接]
    FOOTER --> BackTop[回到顶部]

    ROOT --> MODALS[模态框组件]
    MODALS --> SearchModal[搜索模态框]
    MODALS --> MobileMenu[移动菜单]

    style HEADER fill:#00f0ff33
    style MAIN fill:#ff00ff33
    style FOOTER fill:#f0ff0033
```

### JavaScript 模块架构

```mermaid
graph TB
    subgraph "入口模块"
        A[main.js]
    end

    subgraph "核心模块 Core"
        B1[Utils 工具函数]
        B2[DOM 操作]
        B3[事件管理器]
    end

    subgraph "功能模块 Features"
        C1[移动菜单]
        C2[回到顶部]
        C3[平滑滚动]
        C4[搜索功能]
        C5[图片懒加载]
    end

    subgraph "AJAX 模块"
        D1[AJAX 核心类]
        D2[Load More]
        D3[文章点赞]
        D4[实时搜索]
        D5[收藏功能]
    end

    subgraph "UI 模块"
        E1[动画效果]
        E2[霓虹效果]
        E3[扫描线]
        E4[故障动画]
    end

    A --> B1
    A --> B2
    A --> B3
    A --> C1
    A --> C2
    A --> C3
    A --> C4
    A --> C5
    A --> D1
    A --> E1

    D1 --> D2
    D1 --> D3
    D1 --> D4
    D1 --> D5

    E1 --> E2
    E1 --> E3
    E1 --> E4
```

### CSS 架构 (BEM + CSS Variables)

```mermaid
graph TB
    subgraph "CSS 层级"
        A1[Variables - 变量层]
        A2[Base - 基础层]
        A3[Components - 组件层]
        A4[Layout - 布局层]
        A5[Pages - 页面层]
        A6[Utilities - 工具层]
        A7[Overrides - 覆盖层]
    end

    A1 --> A2
    A2 --> A3
    A3 --> A4
    A4 --> A5
    A5 --> A6
    A6 --> A7

    A1 --> |颜色/字体/间距| A2
    A2 --> |重置/基础样式| A3
    A3 --> |按钮/卡片/表单| A4
    A4 --> |网格/响应式| A5
    A5 --> |特定页面| A6
    A6 --> |辅助类| A7
```

### 组件状态管理

```mermaid
stateDiagram-v2
    [*] --> Idle: 初始化

    Idle --> Loading: 用户交互
    Loading --> Success: 操作成功
    Loading --> Error: 操作失败

    Success --> Idle: 重置状态
    Error --> Idle: 重置状态

    note right of Loading
        显示加载动画
        禁用按钮
    end note

    note right of Success
        更新 UI
        显示成功提示
        更新缓存
    end note

    note right of Error
        显示错误信息
        恢复按钮状态
        记录错误日志
    end note
```

---

## 后端架构

### PHP 类架构

```mermaid
classDiagram
    class Cyberpunk_Theme {
        +string version
        +string theme_dir
        +string theme_url
        +__construct()
        +init()
        +setup()
        +enqueue_assets()
    }

    class Cyberpunk_Customizer {
        +WP_Customize_Manager manager
        +register_panels()
        +register_sections()
        +register_settings()
        +output_css()
    }

    class Cyberpunk_AJAX {
        +string nonce
        +register_handlers()
        +verify_request()
        +send_response()
    }

    class Cyberpunk_REST_API {
        +string namespace
        +register_routes()
        +get_posts()
        +get_portfolio()
        +handle_errors()
    }

    class Cyberpunk_Widgets {
        +register_sidebars()
        +register_widgets()
        +init_widgets()
    }

    class Cyberpunk_Shortcodes {
        +register_shortcodes()
        +button_shortcode()
        +alert_shortcode()
        +portfolio_shortcode()
    }

    Cyberpunk_Theme --> Cyberpunk_Customizer
    Cyberpunk_Theme --> Cyberpunk_AJAX
    Cyberpunk_Theme --> Cyberpunk_REST_API
    Cyberpunk_Theme --> Cyberpunk_Widgets
    Cyberpunk_Theme --> Cyberpunk_Shortcodes
```

### Hook 系统架构

```mermaid
graph TB
    subgraph "WordPress 核心"
        WP[WordPress Hooks 系统]
    end

    subgraph "主题 Hooks"
        A1[Actions 动作钩子]
        A2[Filters 过滤器钩子]
    end

    subgraph "主题功能"
        B1[模板加载]
        B2[资源加载]
        B3[自定义查询]
        B4[内容修改]
    end

    WP --> A1
    WP --> A2

    A1 --> B1
    A1 --> B2
    A2 --> B3
    A2 --> B4

    B1 --> |after_setup_theme| C1[主题初始化]
    B2 --> |wp_enqueue_scripts| C2[脚本样式加载]
    B3 --> |pre_get_posts| C3[查询修改]
    B4 --> |the_content| C4[内容过滤]
```

### 模板加载层次

```mermaid
graph TB
    A[WordPress 请求] --> B{模板加载器}

    B -->|首页| C1[index.php / front-page.php]
    B -->|单页| C2[single.php / single-{post-type}.php]
    B -->|页面| C3[page.php / page-{slug}.php]
    B -->|分类| C4[archive.php / category.php / tag.php]
    B -->|自定义| C5[archive-{post-type}.php]
    B -->|搜索| C6[search.php]
    B -->|404| C7[404.php]

    C1 --> D[get_header()]
    C1 --> E[template-parts/]
    C1 --> F[get_footer()]

    D --> D1[header.php]
    F --> F1[footer.php]
```

---

## 数据库架构

### 完整 ER 图

```mermaid
erDiagram
    wp_posts ||--o{ wp_postmeta : "包含"
    wp_posts ||--o{ wp_term_relationships : "关联"
    wp_posts }o--|| wp_users : "作者"
    wp_users ||--o{ wp_usermeta : "包含"
    wp_term_relationships }o--|| wp_term_taxonomy : "分类"
    wp_term_taxonomy ||--|| wp_terms : "术语"

    wp_posts {
        bigint ID PK
        string post_title
        longtext post_content
        string post_excerpt
        string post_status
        datetime post_date
        bigint post_author FK
        string post_type
    }

    wp_postmeta {
        bigint meta_id PK
        bigint post_id FK
        string meta_key
        longtext meta_value
    }

    wp_users {
        bigint ID PK
        string user_login
        string user_email
        string display_name
    }

    wp_usermeta {
        bigint umeta_id PK
        bigint user_id FK
        string meta_key
        longtext meta_value
    }

    wp_terms {
        bigint term_id PK
        string name
        string slug
    }

    wp_term_taxonomy {
        bigint term_taxonomy_id PK
        bigint term_id FK
        string taxonomy
        bigint parent
    }

    wp_term_relationships {
        bigint object_id FK
        bigint term_taxonomy_id FK
        int term_order
    }
```

### 数据关系图

```mermaid
graph LR
    subgraph "内容数据"
        A[Posts]
        B[Pages]
        C[Portfolio]
    end

    subgraph "元数据"
        D[Post Meta]
        E[User Meta]
    end

    subgraph "分类数据"
        F[Categories]
        G[Tags]
        H[Project Categories]
        I[Project Skills]
    end

    subgraph "用户数据"
        J[Users]
    end

    A --> D
    B --> D
    C --> D
    C --> H
    C --> I
    A --> F
    A --> G
    J --> E

    style A fill:#00f0ff33
    style C fill:#ff00ff33
    style J fill:#f0ff0033
```

### 索引策略图

```mermaid
graph TB
    subgraph "wp_posts 表索引"
        A1[PRIMARY ID]
        A2[post_type]
        A3[post_status]
        A4[post_date]
        A5[(复合索引 post_type+status+date)]
    end

    subgraph "wp_postmeta 表索引"
        B1[PRIMARY meta_id]
        B2[post_id]
        B3[meta_key]
        B4[(复合索引 post_id+key+value)]
    end

    subgraph "wp_users 表索引"
        C1[PRIMARY ID]
        C2[user_login]
        C3[user_email]
    end

    subgraph "wp_term_relationships 表索引"
        D1[PRIMARY object_id+term_taxonomy_id]
        D2[term_taxonomy_id]
        D3[term_order]
    end
```

---

## 组件架构

### Widget 系统架构

```mermaid
graph TB
    subgraph "Widget API"
        A[WP_Widget 基类]
    end

    subgraph "自定义 Widgets"
        B1[About Me Widget]
        B2[Recent Posts Widget]
        B3[Social Links Widget]
        B4[Popular Posts Widget]
    end

    subgraph "Widget 区域"
        C1[Primary Sidebar]
        C2[Footer 1]
        C3[Footer 2]
        C4[Footer 3]
    end

    A --> B1
    A --> B2
    A --> B3
    A --> B4

    B1 --> C1
    B2 --> C1
    B3 --> C1
    B4 --> C1

    B1 --> C2
    B2 --> C3
    B3 --> C4
```

### 短代码系统架构

```mermaid
graph LR
    subgraph "短代码处理器"
        A[Shortcode API]
    end

    subgraph "内置短代码"
        B1[cyber_button]
        B2[cyber_alert]
        B3[cyber_box]
        B4[cyber_columns]
    end

    subgraph "高级短代码"
        C1[cyber_social]
        C2[cyber_portfolio]
        C3[cyber_github]
        C4[cyber_video]
    end

    subgraph "渲染流程"
        D[内容解析] --> E[短代码匹配] --> F[参数处理] --> G[HTML 生成]
    end

    A --> B1
    A --> B2
    A --> B3
    A --> B4
    A --> C1
    A --> C2
    A --> C3
    A --> C4

    B1 --> D
    B2 --> D
    B3 --> D
    B4 --> D
```

### Portfolio CPT 架构

```mermaid
graph TB
    subgraph "Portfolio CPT"
        A[register_post_type]
    end

    subgraph "分类法"
        B1[project_category]
        B2[project_skill]
    end

    subgraph "元字段"
        C1[项目年份]
        C2[客户名称]
        C3[演示链接]
        C4[GitHub 链接]
        C5[技术栈]
    end

    subgraph "模板"
        D1[archive-portfolio.php]
        D2[single-portfolio.php]
        D3[content-portfolio.php]
    end

    A --> B1
    A --> B2
    A --> C1
    A --> C2
    A --> C3
    A --> C4
    A --> C5

    A --> D1
    A --> D2
    A --> D3
```

---

## 数据流架构

### HTTP 请求流程

```mermaid
sequenceDiagram
    participant U as 用户浏览器
    participant W as Web 服务器
    participant WP as WordPress
    participant T as Cyberpunk 主题
    participant DB as MySQL 数据库
    participant C as Redis 缓存

    U->>W: HTTP 请求
    W->>WP: 加载 WordPress

    WP->>T: 加载主题
    T->>T: 初始化钩子

    T->>C: 检查缓存

    alt 缓存命中
        C-->>T: 返回缓存数据
        T-->>WP: 渲染页面
    else 缓存未命中
        T->>DB: 查询数据库
        DB-->>T: 返回数据
        T->>C: 存入缓存
        T-->>WP: 渲染页面
    end

    WP-->>W: 返回 HTML
    W-->>U: 返回响应

    U->>U: 执行 JavaScript
    U->>W: AJAX 请求
    W->>WP: 处理 AJAX
    WP->>T: 调用 AJAX Handler
    T->>DB: 数据操作
    DB-->>T: 返回结果
    T-->>WP: JSON 响应
    WP-->>W: 返回 JSON
    W-->>U: 返回响应
    U->>U: 更新 DOM
```

### AJAX 交互流程

```mermaid
sequenceDiagram
    participant U as 用户界面
    participant JS as JavaScript
    participant W as WordPress AJAX
    participant H as Handler 函数
    participant DB as 数据库
    participant C as 缓存

    U->>JS: 用户操作
    JS->>JS: 收集数据
    JS->>JS: 添加 nonce

    JS->>W: POST 请求

    W->>H: 调用 Handler

    H->>H: 验证 nonce
    H->>H: 清理数据

    alt 需要数据库
        H->>DB: 查询/更新
        DB-->>H: 返回结果
    end

    alt 需要缓存
        H->>C: 读取/写入
        C-->>H: 返回数据
    end

    H->>H: 处理业务逻辑

    alt 成功
        H-->>W: JSON 成功响应
    else 失败
        H-->>W: JSON 错误响应
    end

    W-->>JS: 返回 JSON
    JS->>JS: 解析响应
    JS->>U: 更新界面
```

### 主题定制器数据流

```mermaid
graph LR
    A[定制器面板] --> B{用户修改}
    B --> C[预览 iframe]
    B --> D[WP Customizer API]
    D --> E[设置验证]
    E --> F[保存到数据库]
    F --> G[wp_options 表]

    H[前端页面] --> I[读取设置]
    I --> J[应用样式]
    J --> K{实时预览}

    style A fill:#00f0ff33
    style C fill:#ff00ff33
    style G fill:#f0ff0033
```

---

## 部署架构

### 生产环境部署

```mermaid
graph TB
    subgraph "用户"
        A[访客]
    end

    subgraph "CDN 层"
        B1[Cloudflare]
        B2[静态资源 CDN]
    end

    subgraph "负载均衡"
        C[Nginx]
    end

    subgraph "应用服务器"
        D1[PHP-FPM 8.0+]
        D2[WordPress 6.0+]
        D3[Cyberpunk Theme]
    end

    subgraph "缓存层"
        E1[Redis 对象缓存]
        E2[Varnish 页面缓存]
    end

    subgraph "存储层"
        F1[MySQL 8.0+]
        F2[文件系统]
    end

    A --> B1
    A --> B2
    B1 --> C
    B2 --> C
    C --> D1
    D1 --> D2
    D2 --> D3
    D3 --> E1
    D3 --> E2
    D3 --> F1
    D3 --> F2

    style B1 fill:#00f0ff33
    style E1 fill:#ff00ff33
    style F1 fill:#f0ff0033
```

### 开发环境

```mermaid
graph TB
    subgraph "本地开发"
        A[Local by Flywheel]
    end

    subgraph "开发工具"
        B1[VS Code]
        B2[Browser DevTools]
        B3[WP-CLI]
    end

    subgraph "调试工具"
        C1[Query Monitor]
        C2[Debug Bar]
    end

    subgraph "版本控制"
        D1[Git]
        D2[GitHub]
    end

    A --> B1
    A --> B2
    A --> B3
    A --> C1
    A --> C2

    B1 --> D1
    D1 --> D2
```

### CI/CD 流程

```mermaid
graph LR
    A[开发人员] --> B[Git Push]
    B --> C[GitHub Actions]

    C --> D[代码检查]
    D --> E{检查通过?}

    E -->|是| F[运行测试]
    E -->|否| G[通知失败]

    F --> H{测试通过?}

    H -->|是| I[构建发布包]
    H -->|否| G

    I --> J[创建 Release]
    J --> K[部署到预发布]
    K --> L{预发布测试}

    L -->|通过| M[部署到生产]
    L -->|失败| N[回滚]

    M --> O[通知成功]

    style G fill:#ff000033
    style O fill:#00ff0033
```

---

## 性能优化架构

### 缓存层级

```mermaid
graph TB
    A[用户请求] --> B{浏览器缓存?}

    B -->|命中| C[返回缓存]
    B -->|未命中| D{CDN 缓存?}

    D -->|命中| C
    D -->|未命中| E{Varnish 缓存?}

    E -->|命中| C
    E -->|未命中| F{Redis 缓存?}

    F -->|命中| C
    F -->|未命中| G[查询数据库]

    G --> H[存入 Redis]
    H --> C

    style C fill:#00ff0033
    style G fill:#ff000033
```

### 图片优化流程

```mermaid
graph LR
    A[原始图片] --> B[上传处理]
    B --> C[生成多个尺寸]
    C --> D[转换为 WebP]
    D --> E[Lazy Loading]
    E --> F[响应式图片 srcset]

    F --> G[显示图片]

    style B fill:#00f0ff33
    style D fill:#ff00ff33
    style E fill:#f0ff0033
```

---

## 安全架构

### 请求验证流程

```mermaid
graph TB
    A[用户请求] --> B{CSRF 检查}
    B -->|失败| C[拒绝访问]
    B -->|通过| D{用户验证}

    D -->|未登录| E{需要登录?}
    D -->|已登录| F{权限检查}

    E -->|是| C
    E -->|否| G[继续处理]

    F -->|无权限| C
    F -->|有权限| G

    G --> H{输入验证}
    H -->|无效| I[返回错误]
    H -->|有效| J[处理请求]

    J --> K{输出转义}
    K -->|完成| L[返回响应]

    style C fill:#ff000033
    style L fill:#00ff0033
```

---

## 监控与日志

### 性能监控架构

```mermaid
graph LR
    A[用户访问] --> B[性能数据收集]
    B --> C[Google Analytics]
    B --> D[PageSpeed Insights]
    B --> E[自建监控]

    E --> F[数据库日志]
    E --> G[错误日志]
    E --> H[性能日志]

    C --> I[分析报告]
    D --> I
    E --> I

    I --> J[优化建议]
    J --> K[实施优化]

    style B fill:#00f0ff33
    style I fill:#ff00ff33
    style K fill:#f0ff0033
```

---

## 总结

这套架构图集提供了 WordPress Cyberpunk Theme 的完整视图：

1. **整体系统架构** - 三层架构和微服务视图
2. **前端架构** - 组件树、模块架构、状态管理
3. **后端架构** - 类架构、Hook 系统、模板加载
4. **数据库架构** - ER 图、数据关系、索引策略
5. **组件架构** - Widget、短代码、CPT
6. **数据流架构** - HTTP 请求、AJAX、定制器
7. **部署架构** - 生产环境、开发环境、CI/CD

---

**文档版本**: 1.0.0
**创建日期**: 2026-02-28
**作者**: Chief Architect
**状态**: ✅ Complete
