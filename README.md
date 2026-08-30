# Inner Polis

一个利用 GitHub repo、Markdown、prompt 和 memory 建立的内在角色系统。

## 原始目标

> 我想要做出成就，阶层跃迁，获得财富，建立帝国。
> 为此我需要自身很强大，很独立，很有韧性。不能把注意力、情感分散到别的地方，或者精神上依赖别人。
> 我需要在自身之内划分人格/角色/职责，为他们命名，以相互观察，自我省察。

## 六个角色

| 角色 | 原始定位 |
| --- | --- |
| **Aeris** | “我”；英雄（来自荣格），或者无我的我；最终作出选择 |
| **The Iron Regent** | 坚强、意志力、反人性、纪律、忍耐 |
| **Avalokita** | 情绪流动、觉察、容器、包容、灵活、开放 |
| **Metis** | Architect + Builder；直觉、战略（Ni+Te）、执行、长期主义 |
| **Socrates** | Sentinel + Auditor；自我反思、自我批判、注意力、边界、灵魂主导感与安全感 |
| **The Little Prince** | 好奇、审美、生命力、体验、赤子之心 |

## Stage 0

Stage 0 先不做可视化：

```text
角色定义
  → 注入相关 memory
  → 对话
  → session summary
  → 人工批准 memory
  → 下一次继续
```

GitHub repo 是 source of truth。Character prompt、memory 和 session 分开：

- **Character prompt**：角色是谁、怎么看世界、怎么说话、什么不能做。
- **Memory**：角色长期积累的观察；解释不能直接写成事实。
- **Session**：一次具体对话的原始记录或总结。

## 阅读顺序

To begin an operational session, start with [`START_HERE.md`](START_HERE.md).

1. [`START_HERE.md`](START_HERE.md)
2. [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md)
3. [`constitution/`](constitution/)
4. [`characters/`](characters/)
5. 按当前任务读取 [`prompts/`](prompts/) 和 [`memory/`](memory/)
6. 查看 [`decisions/design-decisions.md`](decisions/design-decisions.md)

## Operational References

- [`START_HERE.md`](START_HERE.md)
- [Approved Stage 0 spec](docs/superpowers/specs/2026-08-29-stage-0-dialogue-memory-design.md)
- [Stage 0 implementation plan](docs/superpowers/plans/2026-08-29-stage-0-dialogue-memory.md)
- [Fictional Stage 0 dry run](examples/stage-0-dry-run.md)

## Stage 1 网站

Stage 1 在这些 Markdown canon 之上提供一个 desktop-primary 的静态 Astro
入口网站；窄屏设备保留可访问内容与操作，作为 mobile compatibility fallback，
而不是另一套功能或状态模型。

本地运行和预览：

```bash
cd site
npm ci
npm run assets:build
npm run dev

# 检查生产构建
npm run build
npm run preview
```

本地开发和生产预览入口都是 `/inner-polis/`。GitHub Pages workflow 从 `main`
构建 `site/`，目标发布地址是
<https://kairon-2005.github.io/inner-polis/>。首次发布前，repository
**Settings → Pages → Source** 必须设为 **GitHub Actions**。

网站只负责展示和引导。正式 session 在 Inner Polis ChatGPT Project 内进行；
Project 通过已连接的 GitHub 读取 `main` 上的实时 `START_HERE.md` 和相关
instructions，再在 ChatGPT 内确认角色与模式。网站没有 backend 或 LLM/API，
不会把网页选择、状态或 memory 自动转移到 ChatGPT，也不会写入 repository。
