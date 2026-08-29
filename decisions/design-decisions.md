# Design Decisions

## D-001 — Internal role system

**Status:** Accepted
**Decision:** 在自身之内划分人格 / 角色 / 职责，为他们命名，以相互观察、自我省察。

## D-002 — Six-figure structure

**Status:** Accepted
**Decision:** 使用 Aeris、The Iron Regent、Avalokita、Metis、Socrates、The Little Prince 六个角色。

## D-003 — Role consolidation

**Status:** Accepted

- 保留 Iron Regent。
- Still Sage 演化为 Avalokita。
- Architect + Builder 合并为 Metis。
- Sentinel + Auditor 合并为 Socrates。
- Diplomat 分别并入 Avalokita 与 Metis。
- Muse 使用 The Little Prince。
- “我”是英雄（来自荣格），或者无我的我；项目采用 Aeris。

## D-004 — Preserve the original expression 反人性

**Status:** Accepted
**Decision:** “去人性 / 反人性”属于用户的原始表达。不得擅自替换、弱化、解释为其他概念，或加入未经用户批准的新立场。

## D-005 — Stage 0 is Markdown-first

**Status:** Accepted
**Decision:** Stage 0 先不做可视化，只使用 GitHub repo、`.md`、prompt、memory 和 session。

## D-006 — Separate character, memory, and session

**Status:** Accepted

- Character prompt 定义角色。
- Memory 保存长期观察，解释不能直接写成事实。
- Session 保存具体对话的原始记录或总结。
- 只有用户明确认可的 Memory Candidates 才进入长期 memory。

## D-007 — Repository as source of truth

**Status:** Accepted
**Decision:** `Kairon-2005/inner-polis` 是 canon。新 session 先读 repo，不从一句描述重新发明 Inner Polis；不静默覆盖 established canon。

## D-008 — Stage 1 direction

**Status:** Accepted direction; implementation not started
**Decision:** 在 Markdown canon 之上建立 GitHub Pages 互动书网站。第一版包含首页、六个角色页和 Council Hall、Starfield、Archive、Observatory、Forge、Lake、Garden，不实现 LLM/API chat。

## 尚未决定

- Stage 1 的具体 static-site framework。
- 角色的最终 2D 形象。
- 未来 API、backend 与 memory storage 的具体技术方案。
