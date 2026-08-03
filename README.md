# Mayegg's Blog

这是 Mayegg 个人博客的 React 重构版本。项目使用 Vite、React、TypeScript 与 Markdown 构建；文章、音乐源、前端代码和构建脚本均保存在仓库中，适合多台电脑协作。

## 功能

- 首页、分类、标签、归档、关于、文章详情与“我的音乐”页面
- 响应式布局、明暗主题、移动端文章目录与可折叠侧栏
- Markdown Front Matter、目录、表格、图片、代码高亮、KaTeX 与 Mermaid
- Hash 路由与文章标题锚点跳转
- 音乐分类、练习状态、感想、专辑封面、发行日期与网易云跳转

## 撰写文章

在 `posts/` 下创建 Markdown 文件：

```md
---
title: 我的新文章
date: 2026-08-04
categories:
  - 编程学习
tags:
  - React
---

## 一级内容

从这里开始书写正文。
```

运行 `npm run content` 会扫描文章并更新 `public/content/posts.json`。

## 我的音乐：Markdown 源与网易云补全

音乐源文件是 [posts/music.md](posts/music.md)。它是一个特殊 Markdown：Front Matter 必须声明 `type: music-library`，因此不会被发布为普通博客文章。二级标题表示音乐分类；每一首歌至少填写 `song` 与 `artist`，其余字段可选：

```md
## J-Pop

- song: アイドル
  artist: YOASOBI
  album:                 # 可选：协助搜索匹配
  practice: 熟练掌握     # 可选，默认“准备练习”
  added: 2026-08-02      # 可选
  note: 副歌的咬字和气口已经很顺。
  thought: 这首歌听起来像灯一下子亮起来。
  mood: 反复循环
```

`npm run music` 会调用 [网易云音乐 NodeJS API Enhanced 文档](https://neteasecloudmusicapienhanced.js.org/#/) 中的接口，并生成 `public/content/music.json`：

1. 调用 `GET /search?keywords=...&type=1&limit=1`，以“歌名 + 作者 + 可选专辑”为关键词，并直接选用第一首搜索结果。
2. 从搜索结果写入歌曲 ID、歌名、作者、专辑和发行时间；若搜索结果没有封面，调用 `GET /song/detail?ids=...` 补齐封面链接。
3. 根据歌曲 ID 生成 `https://music.163.com/#/song?id=...`。前端展示封面、专辑与发行日期；点击歌曲直接在新页面打开网易云音乐。

这套方案的 API 请求只发生在构建阶段，已生成的 JSON 会提交到仓库，因此访客浏览页面不依赖第三方 API。搜索结果可能会因同名歌曲或服务数据变化而改变；需要更严格匹配时，建议补充 `album`。请尊重网易云音乐的版权和地区限制。

默认使用公开增强服务完成匿名元数据查询；生产环境建议部署自己的 API 服务，并在 `.env.local` 配置：

```bash
NETEASE_API_BASE_URL=https://music-api.example.com
```

可参考 `.env.example`。不要提交包含 Cookie、账号或密钥的 `.env.local`。

## 本地开发

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 8080
```

浏览器打开 `http://127.0.0.1:8080`。

## 检查与构建

```bash
npm run lint
npm run build
```

`npm run build` 会依次生成文章 JSON、音乐 JSON，并把最终静态站点输出到 `dist/`。

## GitHub Pages 发布

仓库中的 `.github/workflows/deploy-pages.yml` 会在 `main` 分支有新提交时自动构建并部署网站。首次启用时，请在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。

## 项目结构

```text
posts/                    Markdown 文章与 music.md 音乐源
scripts/build-content.mjs 文章 Markdown 转 HTML 与目录数据
scripts/build-music.mjs   网易云搜索、详情补全与音乐 JSON 生成
public/                   静态资源、文章与音乐 JSON
src/                      React 页面、组件、工具与样式
.github/workflows/        GitHub Pages 自动部署工作流
dist/                     生产构建产物（不提交）
```
