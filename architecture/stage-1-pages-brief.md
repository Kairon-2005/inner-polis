# Stage 1 — GitHub Pages Website

## 目标

把 Markdown-based Inner Polis 做成一个美观、沉思式、互动书风格的网站，并继续把 repo 中的 Markdown 文件作为 canonical content/source of truth。

## 当前 Stage 1 交付

- 单一 `/inner-polis/` 中央神殿入口；六个 throne 打开 in-page detail layer，
  Council threshold 打开 handoff explanation，不建立独立角色 route。
- desktop-primary 的完整神殿空间构图；窄屏使用垂直 ceremonial procession 和
  full-height reading surface，作为 mobile compatibility fallback。
- 静态 Astro build；浏览器运行时不读取 GitHub，不使用 backend、LLM/API、
  authentication、server-side state 或 browser storage。
- 对话 handoff 不传递网页选择、状态或 memory。正式 session 在 Inner Polis
  ChatGPT Project 内进行；Project 通过已连接的 GitHub 读取 `main` 上的实时
  `START_HERE.md` 与相关 instructions，并在 ChatGPT 内完成角色和模式确认。

## 运行与发布

在 repository root 运行：

```bash
cd site
npm ci
npm run assets:build
npm run dev

# production build and preview
npm run build
npm run preview
```

本地开发与 production preview 使用 `/inner-polis/`。GitHub Actions 从 `main`
构建 `site/` 并部署到 <https://kairon-2005.github.io/inner-polis/>。首次发布前，
repository **Settings → Pages → Source** 必须设为 **GitHub Actions**。

## 视觉方向

- philosophical codex；
- interactive book；
- mythological inner world；
- restrained 2D game interface；
- night sky / marble / water / iron / parchment；
- 避免 generic SaaS dashboard aesthetics。
