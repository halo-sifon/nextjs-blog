# 修改记录

## 2024-03-21
1. 创建管理后台页面
   - 新增 `app/admin/layout.tsx`：创建独立的管理页面布局，不包含常规页面的header
   - 新增 `app/admin/page.tsx`：创建管理后台主页面，包含基础的管理功能卡片布局
   - 新增 `app/admin/metadata.ts`：添加页面元数据配置
   - 使用已有的 sonner toast 组件替换重复实现
   - 重新设计管理页面布局：
     - 添加左侧固定导航栏，包含主要功能入口
     - 优化主内容区域的布局和样式
     - 添加退出登录按钮
   - 待办：
     - [ ] 添加管理页面的访问权限控制
     - [ ] 实现具体的管理功能（文章管理、数据统计、系统设置等）
     - [ ] 添加用户认证和登录功能 

2. 实现用户认证相关接口
   - 新增 `app/api/user/logout/route.ts`：实现退出登录接口，清除用户token
   - 功能：
     - 通过设置 cookie 的 Max-Age 为 0 来清除用户的 token
     - 返回成功响应消息 

- 使用 Mongoose 重构博客 API
  - 创建 Post 模型，包含以下字段：
    - title: 标题
    - content: 内容
    - category: 分类
    - summary: 摘要
    - tags: 标签
    - publishDate: 发布时间
    - updateDate: 更新时间
    - status: 状态（草稿/已发布）
    - viewCount: 浏览次数
    - author: 作者
    - slug: URL 友好的标识符
  - 实现完整的 CRUD API：
    - GET /api/posts: 获取文章列表，支持分页、搜索、分类筛选
    - POST /api/posts: 创建新文章
    - PUT /api/posts: 更新文章
    - DELETE /api/posts: 删除文章
    - GET /api/posts/[id]: 获取单篇文章详情
  - 添加性能优化：
    - 文章列表不返回完整内容
    - 添加数据库索引
    - 支持文本搜索 

- 为博客 API 添加认证保护
  - 新增 `middleware/auth.ts`：实现 token 验证中间件
  - 新增 `libs/jwt.ts`：实现 JWT 工具函数
  - 更新文章相关接口的权限控制：
    - GET /api/posts：
      - 未登录用户只能看到已发布的文章
      - 查看草稿需要登录
    - POST /api/posts：需要管理员权限
    - PUT /api/posts：需要管理员权限
    - DELETE /api/posts：需要管理员权限
    - GET /api/posts/[id]：
      - 已发布文章所有人可见
      - 草稿需要登录才能查看
  - 安全性改进：
    - 使用 JWT 进行用户认证
    - token 有效期设置为 7 天
    - 创建文章时自动记录作者信息 

- 添加博客管理功能
  - 新增 `app/(admin)/admin/posts/page.tsx`：文章列表页面
    - 展示所有文章（包括草稿）
    - 支持查看、编辑、删除操作
    - 新建文章按钮
    - 使用 shadcn/ui 的 Table 组件展示列表
  - 新增 `app/(admin)/admin/posts/[id]/edit/page.tsx`：文章编辑页面
    - 支持新建和编辑文章
    - 表单字段：标题、Slug、分类、摘要、内容、状态、标签
    - 使用 shadcn/ui 的表单组件
    - 实时预览和保存功能
  - 功能特点：
    - 响应式设计
    - 友好的用户界面
    - 完整的错误处理
    - 即时的用户反馈 

- 添加 Markdown 支持
  - 安装依赖：
    - markdown-it：Markdown 解析器
    - highlight.js：代码语法高亮
    - @tailwindcss/typography：Markdown 样式
  - 更新编辑器功能：
    - 添加编辑/预览切换标签页
    - 实时预览 Markdown 渲染结果
    - 支持代码语法高亮
    - 优化编辑器字体和样式
  - 修复路由问题：
    - 新增 `/admin/posts/new` 路由
    - 复用编辑页面组件
  - 改进用户体验：
    - 添加 Markdown 格式提示
    - 使用等宽字体优化编辑体验
    - 美化预览样式 

## 2024-03-22
- 修复文章链接 404 问题
  - 修改 `app/(blog)/posts/page.tsx`：
    - 使用 `encodeURIComponent` 对文章分类和标题进行 URL 编码
  - 修改 `app/(blog)/posts/[...slug]/page.tsx`：
    - 使用 `decodeURIComponent` 对 URL 中的 slug 进行解码
  - 改进：
    - 确保特殊字符能够正确显示在 URL 中
    - 确保能在数据库中正确查询到文章 

- 优化文章列表标题显示
  - 修改 `app/(blog)/posts/page.tsx`：
    - 使用 `line-clamp-2` 限制标题最多显示两行
    - 超出部分显示省略号
  - 改进：
    - 提升列表页面的整体视觉体验
    - 保持标题展示的一致性 

- 修复分类更新后文章分类不同步的问题
  - 修改 `app/api/categories/[id]/route.ts`：
    - 在更新分类时，同步更新使用该分类的所有文章
    - 添加删除分类前的安全检查，防止删除还在使用的分类
  - 改进：
    - 保持数据一致性
    - 提升用户体验
    - 防止误操作导致的数据问题 

## 2024-03-19
- 修复: 将 API 路由中的 `~` 路径别名改为 `@` 路径别名，以解决 Vercel 部署时的路径解析问题
  - 修改文件：
    - `app/api/user/login/route.ts`
    - `app/api/user/register/route.ts` 