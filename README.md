# Mayegg's Blog

这是 Mayegg 个人博客的 React 重构版本。项目使用 Vite、React、TypeScript 与 Markdown 构建；文章源文件、前端代码、构建脚本和音乐数据都保存在仓库中，适合多台电脑协作和扩展。

## 功能

- 首页、分类、标签、归档、关于页、文章详情页与“我的音乐”页
- 响应式布局、明暗主题、移动端文章目录与可折叠侧栏
- Markdown Front Matter、标题目录、表格、图片、引用、链接和代码块
- Highlight.js 代码高亮、KaTeX 数学公式、Mermaid 图表
- Hash 路由与文章标题锚点跳转
- 音乐分类、练习进度、感想关联与站内播放器

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

运行 `npm run content` 会扫描 `posts/` 并更新 `public/content/posts.json`。该生成文件也会提交到仓库，保证静态内容可直接预览。

## 我的音乐与网易云 API

音乐实体、分类、练习状态和感想存放在 `public/content/music.json` 中。感想通过 `songId` 引用歌曲实体，因此修改歌曲信息后无需重复维护感想内容。

页面中的“网易云音乐搜索”参考 [网易云音乐 NodeJS API Enhanced 文档](https://neteasecloudmusicapienhanced.js.org/#/)。实现使用两个匿名接口：

- `GET /search?keywords=...&type=1`：按歌名、歌手或专辑搜索，展示歌曲、艺术家、专辑和封面。
- `GET /song/url/v1?id=...&level=standard`：为选中的歌曲请求可用的标准音质试听地址；前端将其交给原生 `<audio>` 播放。

接口可能因版权、地区、登录状态或服务可用性返回空链接，页面会显示提示而不会绕过平台限制。默认使用公开增强服务进行匿名搜索演示；生产环境建议自行部署 API 服务，并在 `.env.local` 中配置：

```bash
VITE_NETEASE_API_BASE_URL=https://music-api.example.com
```

可复制 `.env.example` 作为配置参考。不要将包含 Cookie、账号或密钥的 `.env.local` 提交到仓库。

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

`npm run build` 会先运行内容生成脚本，再把最终静态站点输出到 `dist/`。

## GitHub Pages 发布

仓库中的 `.github/workflows/deploy-pages.yml` 会在 `main` 分支有新提交时自动构建并部署网站。

首次启用时，请在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。之后每次推送到 `main` 都会自动发布；`dist/` 是构建产物，不需要提交。

## 项目结构

```text
posts/                    Markdown 文章源文件
scripts/build-content.mjs Markdown 转 HTML 与目录数据的脚本
public/                   静态资源、文章与音乐数据
src/                      React 页面、组件、工具与样式
.github/workflows/        GitHub Pages 自动部署工作流
dist/                     生产构建产物（不提交）
```
