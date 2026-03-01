# Audio Transcript Player

[English](README.en.md)

Demo：https://emuqi.github.io/Audio-Transcript-Player/

Audio Transcript Player 是一个基于 [webvtt-player](https://github.com/umd-mith/webvtt-player) 的网页音频播放工具。支持本地上传音频和字幕文件（SRT、VTT），实现音频播放与字幕同步，并可通过点击字幕跳转到对应位置。适用于英语播客听力和学习。

![example](example/example.png)

## 本地开发

**环境要求**

- Node.js >= 18
- npm

**步骤**

```bash
# 克隆仓库
git clone https://github.com/emuqi/Audio-Transcript-Player.git
cd Audio-Transcript-Player

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

开发服务器默认运行在 `http://localhost:5173`。

## 部署

**构建静态文件**

```bash
npm run build
```

构建产物会输出到 `dist/` 目录，将其部署到任意静态托管服务即可。

**部署到 GitHub Pages**

1. 构建项目：`npm run build`
2. 将 `dist/` 目录的内容推送到仓库的 `gh-pages` 分支，或在仓库设置中将 Pages 源设为 `dist/` 目录。

也可使用 [gh-pages](https://github.com/tschaub/gh-pages) 工具一键部署：

```bash
npm install -D gh-pages
npx gh-pages -d dist
```

**部署到其他平台**

| 平台 | 方式 |
|------|------|
| Vercel | 导入仓库，构建命令 `npm run build`，输出目录 `dist` |
| Netlify | 导入仓库，构建命令 `npm run build`，发布目录 `dist` |
| Cloudflare Pages | 导入仓库，构建命令 `npm run build`，输出目录 `dist` |
| 自托管服务器 | 将 `dist/` 内容放到 Nginx / Apache 等 Web 服务器的根目录 |
