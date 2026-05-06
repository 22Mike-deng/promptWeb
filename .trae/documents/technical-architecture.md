# 技术架构文档：静态个人博客网站

## 1. 技术栈选型

| 类别 | 技术 | 说明 |
|------|------|------|
| 标记语言 | HTML5 | 语义化结构 |
| 样式 | CSS3 + CSS Variables | 自定义属性、响应式、动画 |
| 脚本 | 原生 JavaScript (ES6+) | 无框架依赖 |
| 数据格式 | JSON | 文章索引和内容存储 |

## 2. 项目目录结构

```
/workspace/
├── index.html              # 主入口页面
├── css/
│   └── style.css           # 全局样式
├── js/
│   └── app.js              # 主逻辑
├── data/
│   ├── index.json          # 文章索引（列表摘要）
│   └── articles/           # 单篇文章完整内容
│       ├── article-1.json
│       └── article-2.json
└── images/                 # 封面图、图标等资源
    └── placeholder.jpg
```

## 3. 数据流架构

```
用户请求 → 加载 index.html
        → 加载 app.js
        → fetch('data/index.json') 获取文章列表
        → 渲染文章卡片列表
        → 提取所有标签 → 渲染标签云
        → 用户点击文章 → fetch('data/articles/{id}.json')
        → 渲染文章详情（innerHTML）
```

## 4. 模块设计

### 4.1 app.js 模块职责

| 模块 | 功能 |
|------|------|
| DataFetcher | 加载JSON数据，缓存结果 |
| ArticleRenderer | 渲染文章列表卡片 |
| DetailView | 渲染文章详情内嵌页面 |
| TagFilter | 标签过滤逻辑 |
| Router | 简单的状态管理（可选hash路由） |

### 4.2 状态管理

使用简单的JavaScript对象管理应用状态：

```javascript
const state = {
  articles: [],        // 文章索引列表
  currentArticle: null,// 当前选中文章
  activeTag: null,     // 当前过滤标签
  cache: {}            // 文章内容缓存
};
```

## 5. 关键实现方案

### 5.1 文章详情渲染

使用 `element.innerHTML` 将JSON中的HTML内容注入到DOM中。为防止XSS攻击，数据源为本地文件，不涉及用户输入，安全性可控。

### 5.2 标签过滤

- 遍历所有文章提取唯一标签集合
- 点击标签时过滤文章列表，重新渲染
- 支持取消过滤（点击已选中标签）

### 5.3 响应式布局

- 使用 CSS Grid/Flexbox 布局
- Media Queries 断点：768px（平板）、480px（手机）
- 容器最大宽度：1200px（桌面）

## 6. 样式设计方向

### 6.1 视觉风格

- **主题**：极简编辑风格，带有纸质阅读质感
- **配色**：暖色调背景（纸张感），深色文字，强调色用于标签和链接
- **字体**：衬线体标题 + 无衬线体正文
- **动效**：页面加载渐入、卡片悬停效果、详情页滑入动画

## 7. 部署方案

- GitHub Pages
- Netlify
- Vercel
- 任何支持静态文件的Web服务器

## 8. 扩展性考虑

- 未来可添加搜索功能（客户端全文搜索）
- 支持Markdown转HTML（引入marked.js）
- 支持暗色模式切换
- 分页/无限滚动优化大数据量
