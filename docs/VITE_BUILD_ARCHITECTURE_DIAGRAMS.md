# 🏗️ Vite 构建系统 - 架构设计图

> **任务**: 引入 Vite 构建工具并配置前端工程化
> **架构师**: Claude Sonnet 4.6
> **创建日期**: 2026-03-01
> **项目**: WordPress Cyberpunk Theme

---

## 📑 目录

1. [总体架构对比](#总体架构对比)
2. [构建流程图](#构建流程图)
3. [数据流向图](#数据流向图)
4. [目录结构图](#目录结构图)
5. [部署架构图](#部署架构图)
6. [开发环境架构](#开发环境架构)
7. [生产环境架构](#生产环境架构)
8. [性能监控架构](#性能监控架构)

---

## 总体架构对比

### 当前架构 vs 目标架构

```mermaid
graph TB
    subgraph CURRENT["当前架构（传统方式）"]
        C1[源文件 assets/css/*.css]
        C2[源文件 assets/js/*.js]
        C3[❌ 无构建工具]
        C4[❌ 直接使用源文件]
        C5[❌ 手动刷新浏览器]
        C6[❌ 无代码优化]
    end

    subgraph TARGET["目标架构（Vite 方式）"]
        T1[源文件 src/css/*.css]
        T2[源文件 src/js/*.js]
        T3[✅ Vite 构建工具]
        T4[✅ 开发: HMR 热更新]
        T5[✅ 生产: 优化构建]
        T6[✅ 代码压缩优化]
    end

    C1 -.->|迁移| T1
    C2 -.->|迁移| T2

    T3 --> T4
    T3 --> T5
    T5 --> T6

    style CURRENT fill:#ffcccc
    style TARGET fill:#ccffcc
    style C3 fill:#ff6666
    style C4 fill:#ff6666
    style C5 fill:#ff6666
    style C6 fill:#ff6666
    style T3 fill:#66ff66
    style T4 fill:#66ff66
    style T5 fill:#66ff66
    style T6 fill:#66ff66
```

---

## 构建流程图

### 完整构建生命周期

```mermaid
graph LR
    Start([开始]) --> Env{环境判断}

    Env -->|开发环境| DevMode
    Env -->|生产环境| ProdMode

    subgraph DevMode["开发模式"]
        A1[读取源文件 src/]
        A2[Vite Dev Server]
        A3[启动 HMR]
        A4[浏览器实时预览]
        A5{文件修改?}
        A5 -->|是| A6[热更新]
        A5 -->|否| A4
        A6 --> A4
    end

    subgraph ProdMode["生产模式"]
        B1[读取源文件 src/]
        B2[Vite Builder]
        B3[Rollup 打包]
        B4[Tree Shaking]
        B5[代码压缩 Terser]
        B6[CSS 优化 cssnano]
        B7[生成 Hash]
        B8[输出 assets/]
        B9[生成 manifest.json]
    end

    A4 --> DevEnd([开发完成])
    B9 --> ProdEnd([构建完成])

    style DevMode fill:#e6f7ff
    style ProdMode fill:#fff7e6
    style A3 fill:#52c41a
    style B4 fill:#fa8c16
    style B5 fill:#fa8c16
    style B6 fill:#fa8c16
```

---

## 数据流向图

### 开发环境数据流

```mermaid
sequenceDiagram
    participant Dev as 👨‍💻 开发者
    participant Editor as 📝 编辑器
    participant Vite as ⚡ Vite Dev Server
    participant Browser as 🌐 浏览器
    participant WP as 🐘 WordPress

    Dev->>Editor: 修改 CSS/JS 文件
    Editor->>Vite: 文件变更事件
    Vite->>Vite: 重新编译模块
    Vite->>Browser: WebSocket 推送更新
    Browser->>Browser: 热替换模块
    Browser->>WP: 请求 API 数据
    WP->>Browser: 返回 JSON 数据
    Browser->>Dev: 实时预览 ✅

    Note over Vite,Browser: HMR (Hot Module Replacement)
    Note over Browser,WP: 通过代理访问 /wp-json
```

### 生产环境数据流

```mermaid
sequenceDiagram
    participant CI as 🔧 CI/CD
    participant Vite as ⚡ Vite Builder
    participant Assets as 📦 assets/
    participant Git as 📚 Git 仓库
    participant Server as 🖥️ 生产服务器
    participant User as 👤 用户

    CI->>Vite: 触发 npm run build
    Vite->>Vite: Rollup 打包
    Vite->>Vite: Tree Shaking
    Vite->>Vite: 代码压缩
    Vite->>Assets: 输出优化后的文件
    Vite->>Assets: 生成 manifest.json
    Assets->>Git: 提交构建产物
    Git->>Server: 部署到生产
    Server->>User: 返回 HTML
    User->>Server: 请求 CSS/JS
    Server->>User: 返回压缩后的文件
    User->>User: 渲染页面 ✅

    Note over Vite,Assets: 构建时间 < 30s
    Note over Server,User: 体积减少 > 30%
```

---

## 目录结构图

### 完整项目结构

```mermaid
graph TB
    Root[wordpress-cyber-theme/]

    Root --> Src[src/]
    Root --> Assets[assets/]
    Root --> Public[public/]
    Root --> Config[配置文件]
    Root --> WP[WordPress 模板]

    Src --> SrcCss[src/css/]
    Src --> SrcJs[src/js/]
    Src --> SrcModules[src/js/modules/]
    Src --> SrcAssets[src/assets/]

    SrcCss --> CssAdmin[admin.css]
    SrcCss --> CssMain[main-styles.css]
    SrcCss --> CssWidget[widget-styles.css]
    SrcCss --> CssComponents[components/]

    SrcJs --> JsMain[main.js]
    SrcJs --> JsWidgets[widgets.js]
    SrcJs --> JsAjax[ajax.js]
    SrcModules --> ModuleMobile[mobile-menu.js]
    SrcModules --> ModuleLazy[lazy-load.js]
    SrcModules --> ModuleUtils[utils.js]

    SrcAssets --> SrcImages[images/]
    SrcAssets --> SrcFonts[fonts/]

    Assets --> AssetsCss[css/]
    Assets --> AssetsJs[js/]
    Assets --> AssetsManifest[manifest.json]

    Config --> PkgJson[package.json]
    Config --> ViteConfig[vite.config.js]
    Config --> PostcssConfig[postcss.config.js]
    Config --> Eslint[.eslintrc.js]
    Config --> Prettier[.prettierrc.js]
    Config --> GitIgnore[.gitignore]

    WP --> Header[header.php]
    WP --> Footer[footer.php]
    WP --> Functions[functions.php]

    style Src fill:#e6f7ff
    style Assets fill:#fff7e6
    style Config fill:#f6ffed
    style WP fill:#fff0f6
```

---

## 部署架构图

### WordPress 集成架构

```mermaid
graph TB
    subgraph Development["开发环境 localhost:3000"]
        Dev1[Vite Dev Server]
        Dev2[HMR WebSocket]
        Dev3[源文件 src/]
    end

    subgraph Build["构建流程"]
        Build1[vite build]
        Build2[Rollup 打包]
        Build3[代码压缩]
        Build4[生成 Hash]
    end

    subgraph Production["生产环境"]
        Prod1[WordPress 主题目录]
        Prod2[assets/]
        Prod3[functions.php]
    end

    subgraph Browser["浏览器"]
        Browser1[HTML 模板]
        Browser2[CSS 样式]
        Browser3[JavaScript]
    end

    Dev3 --> Dev1
    Dev1 --> Dev2

    Dev3 --> Build1
    Build1 --> Build2
    Build2 --> Build3
    Build3 --> Build4
    Build4 --> Prod2

    Prod1 --> Prod3
    Prod3 --> Browser1
    Prod2 --> Browser2
    Prod2 --> Browser3

    style Development fill:#e6f7ff
    style Build fill:#fff7e6
    style Production fill:#f6ffed
    style Browser fill:#fff0f6
```

---

## 开发环境架构

### Vite Dev Server 架构

```mermaid
graph TB
    subgraph Network["网络层"]
        Client[浏览器客户端]
        WS[WebSocket 连接]
    end

    subgraph ViteServer["Vite Dev Server"]
        Server[HTTP Server<br/>端口: 3000]
        HMR[HMR Engine]
        PluginSystem[插件系统]
        Transform[转换器]
        OptimizeDeps[依赖预构建]
    end

    subgraph FileSystem["文件系统"]
        Src[src/]
        NodeModules[node_modules/]
        Public[public/]
    end

    subgraph Proxy["代理层"]
        WPProxy[WordPress 代理<br/>/wp-json]
        AdminProxy[Admin 代理<br/>/wp-admin]
    end

    subgraph WordPress["WordPress 后端"]
        WPServer[localhost:8000]
        RESTAPI[REST API]
        AdminAdmin[管理后台]
    end

    Client <--> WS
    WS <--> HMR
    Client <--> Server
    Server <--> Transform
    Transform <--> PluginSystem
    Transform <--> Src
    Transform <--> OptimizeDeps
    OptimizeDeps <--> NodeModules
    Server <--> Public
    Server <--> WPProxy
    Server <--> AdminProxy
    WPProxy <--> WPServer
    AdminProxy <--> WPServer
    WPServer --> RESTAPI
    WPServer --> AdminAdmin

    style ViteServer fill:#52c41a
    style FileSystem fill:#1890ff
    style Proxy fill:#fa8c16
    style WordPress fill:#a0d911
```

---

## 生产环境架构

### 优化构建架构

```mermaid
graph TB
    subgraph Input["输入"]
        I1[src/css/*.css]
        I2[src/js/*.js]
        I3[src/assets/*]
    end

    subgraph ViteBuild["Vite 构建系统"]
        B1[入口解析]
        B2[模块依赖分析]
        B3[代码转换]
        B4[CSS 处理]
        B5[JS 转换]
    end

    subgraph Rollup["Rollup 打包"]
        R1[模块合并]
        R2[Tree Shaking]
        R3[代码分割]
    end

    subgraph Optimize["代码优化"]
        O1[Terser 压缩]
        O2[cssnano 优化]
        O3[Hash 生成]
        O4[Sourcemap]
    end

    subgraph Output["输出"]
        Out1[assets/css/*.css]
        Out2[assets/js/*.js]
        Out3[assets/manifest.json]
    end

    I1 --> B1
    I2 --> B1
    I3 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B3 --> B5
    B4 --> R1
    B5 --> R1
    R1 --> R2
    R2 --> R3
    R3 --> O1
    R3 --> O2
    R3 --> O3
    R3 --> O4
    O1 --> Out1
    O1 --> Out2
    O2 --> Out1
    O3 --> Out1
    O3 --> Out2
    O4 --> Out3

    style ViteBuild fill:#1890ff
    style Rollup fill:#52c41a
    style Optimize fill:#fa8c16
    style Output fill:#a0d911
```

---

## 性能监控架构

### 性能指标追踪

```mermaid
graph LR
    subgraph Metrics["性能指标"]
        M1[FCP<br/>First Contentful Paint]
        M2[LCP<br/>Largest Contentful Paint]
        M3[CLS<br/>Cumulative Layout Shift]
        M4[TTI<br/>Time to Interactive]
    end

    subgraph Tools["监控工具"]
        T1[Lighthouse]
        T2[WebPageTest]
        T3[Chrome DevTools]
    end

    subgraph Targets["目标值"]
        G1[FCP < 1.8s]
        G2[LCP < 2.5s]
        G3[CLS < 0.1]
        G4[TTI < 3.8s]
    end

    subgraph Optimization["优化措施"]
        O1[代码分割]
        O2[Tree Shaking]
        O3[资源压缩]
        O4[懒加载]
    end

    M1 --> T1
    M2 --> T1
    M3 --> T1
    M4 --> T1
    M1 --> T2
    M2 --> T2
    M3 --> T2
    M4 --> T2

    T1 --> G1
    T1 --> G2
    T1 --> G3
    T1 --> G4

    G1 --> O1
    G2 --> O2
    G3 --> O3
    G4 --> O4

    style Metrics fill:#ff7875
    style Tools fill:#69c0ff
    style Targets fill:#95de64
    style Optimization fill:#ffd666
```

---

## 技术栈对比

### 构建工具特性对比

```mermaid
graph TB
    subgraph Features["核心特性"]
        F1[开发服务器启动速度]
        F2[热更新 HMR 速度]
        F3[生产构建速度]
        F4[配置复杂度]
        F5[生态系统成熟度]
        F6[学习曲线]
    end

    subgraph Vite["Vite"]
        V1[⚡ < 1s]
        V2[⚡ < 200ms]
        V3[⚡ 快 10x]
        V4[⭐ 简单]
        V5[⭐⭐⭐ 成长中]
        V6[⭐ 平缓]
    end

    subgraph Webpack["Webpack"]
        W1[🐌 10-30s]
        W2[🐌 1-3s]
        W3[🐌 基准]
        W4[⭐⭐⭐ 复杂]
        W5[⭐⭐⭐⭐⭐ 成熟]
        W6[⭐⭐⭐ 陡峭]
    end

    F1 --> V1
    F1 --> W1
    F2 --> V2
    F2 --> W2
    F3 --> V3
    F3 --> W3
    F4 --> V4
    F4 --> W4
    F5 --> V5
    F5 --> W5
    F6 --> V6
    F6 --> W6

    style Vite fill:#52c41a
    style Webpack fill:#fa8c16
```

---

## 文件依赖关系图

### 模块依赖关系

```mermaid
graph TB
    subgraph Entry["入口文件"]
        E1[main.js]
        E2[widgets.js]
        E3[ajax.js]
    end

    subgraph Modules["业务模块"]
        M1[mobile-menu.js]
        M2[lazy-load.js]
        M3[back-to-top.js]
        M4[search.js]
    end

    subgraph Utils["工具模块"]
        U1[utils.js]
        U2[dom.js]
        U3[event.js]
    end

    subgraph Vendors["第三方库"]
        V1[jQuery]
        V2[其他插件]
    end

    E1 --> M1
    E1 --> M2
    E1 --> M3
    E2 --> M4
    E3 --> U1

    M1 --> U1
    M2 --> U1
    M3 --> U2
    M4 --> U3

    U1 --> V1
    U2 --> V1
    U3 --> V1
    E1 --> V2

    style Entry fill:#ff7875
    style Modules fill:#69c0ff
    style Utils fill:#95de64
    style Vendors fill:#ffd666
```

---

## 部署流程图

### CI/CD 自动化部署

```mermaid
graph LR
    subgraph Git["Git 仓库"]
        G1[Push 代码]
        G2[Pull Request]
    end

    subgraph CI["CI/CD 平台"]
        C1[GitHub Actions<br/>GitLab CI<br/>Jenkins]
    end

    subgraph Build["构建流程"]
        B1[安装依赖 npm ci]
        B2[运行测试 npm test]
        B3[代码检查 npm run lint]
        B4[生产构建 npm run build]
        B5[构建产物 assets/]
    end

    subgraph Deploy["部署"]
        D1[SSH 连接服务器]
        D2[备份旧版本]
        D3[上传新文件]
        D4[清除缓存]
        D5[重启服务]
    end

    subgraph Notify["通知"]
        N1[Slack 通知]
        N2[Email 通知]
    end

    G1 --> C1
    G2 --> C1
    C1 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> B5
    B5 --> D1
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D4 --> D5
    D5 --> N1
    D5 --> N2

    style CI fill:#1890ff
    style Build fill:#52c41a
    style Deploy fill:#fa8c16
    style Notify fill:#a0d911
```

---

## 开发工作流图

### 日常开发流程

```mermaid
graph TB
    Start([开始开发]) --> Branch[创建功能分支]
    Branch --> Install[npm install]
    Install --> Dev[npm run dev]
    Dev --> Code[编写代码]
    Code --> Save{保存文件}
    Save --> HMR[触发热更新]
    HMR --> Preview[浏览器预览]
    Preview --> Test{功能测试}
    Test -->|通过| Commit[Git 提交]
    Test -->|失败| Code
    Commit --> Lint[npm run lint]
    Lint --> Build[npm run build]
    Build --> End([完成])

    style Dev fill:#52c41a
    style HMR fill:#1890ff
    style Test fill:#fa8c16
    style Build fill:#a0d911
```

---

## 📊 性能对比图

### 构建时间对比

```
┌─────────────────────────────────────────────────────────┐
│                    开发服务器启动时间                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Webpack:  ████████████████████████████ 15-30s         │
│                                                         │
│  Vite:     ██ 0.5-1s                                    │
│                                                         │
│  提升:     ⚡ 15-30x 更快                                │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    热更新 (HMR) 响应时间                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Webpack:  ███████████ 1-3s                             │
│                                                         │
│  Vite:     █ 50-200ms                                   │
│                                                         │
│  提升:     ⚡ 5-10x 更快                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    生产构建时间                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Webpack:  ███████████████ 30-60s                       │
│                                                         │
│  Vite:     █████ 10-20s                                 │
│                                                         │
│  提升:     ⚡ 2-3x 更快                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 关键指标监控

### 构建产物对比

```yaml
优化前 (无构建工具):
  main.js:     633 行, ~18KB
  widgets.js:  412 行, ~12KB
  ajax.js:     817 行, ~24KB
  总计:        1,862 行, ~54KB

优化后 (Vite 生产构建):
  main.js:     ~400 行, ~11KB (-39%)
  widgets.js:  ~250 行, ~7KB  (-42%)
  ajax.js:     ~500 行, ~14KB (-39%)
  总计:        ~1,150 行, ~32KB (-41%)

CSS 优化:
  main-styles.css:    995 行, ~28KB
  widget-styles.css:  527 行, ~15KB
  admin.css:          339 行, ~10KB
  总计:               1,861 行, ~53KB

优化后:
  main-styles.css:    ~650 行, ~18KB (-36%)
  widget-styles.css:  ~350 行, ~10KB (-33%)
  admin.css:          ~220 行, ~6KB  (-35%)
  总计:               ~1,220 行, ~34KB (-35%)
```

---

## 📞 总结

本架构设计文档提供了完整的 Vite 构建系统可视化设计，包括：

- ✅ **总体架构对比**: 清晰展示当前 vs 目标架构
- ✅ **构建流程图**: 完整的开发/生产构建流程
- ✅ **数据流向图**: 从源代码到用户浏览器的完整路径
- ✅ **目录结构图**: 规范的项目文件组织
- ✅ **部署架构图**: WordPress 集成方式
- ✅ **性能监控**: 指标追踪和优化措施

**下一步**: 开始实施 `VITE_BUILD_TASK_BREAKDOWN.md` 中的任务清单。

---

**架构师**: Claude Sonnet 4.6
**文档版本**: 1.0.0
**最后更新**: 2026-03-01
