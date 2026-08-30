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

## D-009 — Character selection determines dialogue mode

**Status:** Accepted
**Decision:** 用户可以选择 1～n 个角色。选择 1 个角色时进入 one-on-one；选择多个角色时进入 Council 讨论。系统可以推荐角色，但必须由用户 / Aeris 确认后才进入对应角色模式，不得静默选择或切换角色。

## D-010 — Operational character profiles

**Status:** Accepted by Aeris
**Decision:** 六个角色文件增加“思维方式”“特长”“角色功能”，用于在 one-on-one 与 Council 中保持各自明确的能力和特点。扩充必须服从既有原始定位、职责、核心句与边界，不把 interpretation 写成 identity 或 memory。角色页删除“象征”概念与象征物列表；Aeris 保留“白衣、无武器、无固定表情”的形象设定。

The Iron Regent 明确具有 strong will，不受人性弱点支配，足够理性、坚定；其权力边界不变：负责执行已经作出的承诺，但不制定 ultimate goals。

## D-011 — Temple throne order

**Status:** Accepted by Aeris
**Decision:** 神殿桌面布局以 Aeris 为中央主座；The Iron Regent 位于中央左侧第一座，Avalokita 位于中央右侧第一座，Metis 位于左侧第二座，Socrates 位于右侧第二座，The Little Prince 位于 Aeris 下方，Council 位于最下方。中央纵轴各层不得相互覆盖。

## D-012 — Minimal repository entrance

**Status:** Accepted by Aeris
**Decision:** GitHub repository 首页 README 只展示链接至 GitHub Pages 的神殿封面与极简入口，不在 README 展示原始目标、角色表、Stage 0 流程或内部文档索引。

## 尚未决定

- Stage 1 的具体 static-site framework。
- 角色的最终 2D 形象。
- 未来 API、backend 与 memory storage 的具体技术方案。
