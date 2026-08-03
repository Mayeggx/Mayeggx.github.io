# Mayegg's Blog

这是 Mayegg 个人博客的 React 重构版本。项目使用 Vite、React、TypeScript 与 Markdown 构建；文章源文件、前端代码和构建脚本都保存在仓库中，方便在多台电脑上协作和扩展。

## 功能

- 首页、分类、标签、归档、关于页与文章详情页
- 响应式布局、明暗主题和移动端目录面板
- Markdown Front Matter、标题目录、表格、图片、引用、链接与代码块
- Highlight.js 代码高亮、KaTeX 数学公式和 Mermaid 图表
- 基于 Hash 的文章路由与标题锚点跳转

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

运行 `npm run content` 会扫描 `posts/`，并更新 `public/content/posts.json`。该生成文件也会提交到仓库，保证静态内容可以直接预览。

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

首次启用时，请在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。之后每次推送到 `main` 都会自动发布。

## 项目结构

```text
posts/                    Markdown 文章源文件
scripts/build-content.mjs Markdown 转 HTML 与目录数据的脚本
public/                   静态资源和文章内容数据
src/                      React 页面、组件与样式
.github/workflows/        GitHub Pages 自动部署工作流
dist/                     生产构建产物（不提交）
```
