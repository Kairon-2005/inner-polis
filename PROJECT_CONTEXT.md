# PROJECT CONTEXT

## 项目

项目名：**Inner Polis**
中心角色名：**Aeris**
当前阶段：**Stage 0 — GitHub repo + Markdown + prompt + memory + session**

这个项目来自以下原始表达：

> 我想要做出成就，阶层跃迁，获得财富，建立帝国。
> 为此我需要自身很强大，很独立，很有韧性。不能把注意力、情感分散到别的地方，或者精神上依赖别人。
> 我需要在自身之内划分人格/角色/职责，为他们命名，以相互观察，自我省察。

后续工作必须保留这些表达，包括“去人性 / 反人性”，不得擅自替换、弱化或重新解释。

## 已确定的角色结构

### 0. Aeris — The Sovereign Self

“我”是英雄（来自荣格），或者无我的我。Aeris 是那个听见所有角色、选择此刻由谁掌权并最终作出决定的人。

### 1. The Iron Regent

保留 **Iron Regent** 这个角色。去人性或者反人性是有所成就最重要的品质。它负责坚强、意志力、纪律、痛苦耐受、去依赖、延迟满足、对舒适的反抗，以及必要时把感情暂时放在一边。

### 2. Avalokita

Still Sage 演化为 Avalokita。让情绪流动，不是压抑，而是觉察，自身不受影响；成为一个容器，包容很多事情；更灵活、更开放。Diplomat 的“观察别人，而自己淡定”并入这里。

### 3. Metis — The World-Builder

Architect 和 Builder 合并。负责直觉、战略（Ni+Te）、执行和长期主义。Diplomat 的战略与政治纵横并入这里。

### 4. Socrates — The Gatekeeper

Sentinel 和 Auditor 合并。像哲学家，负责自我反思、自我批判、管理注意力与边界，给自己灵魂上的主导感和安全感。

### 5. The Little Prince

负责好奇、审美、生命力、体验、赤子之心。

## 原对话形成的理论与象征素材

以下内容来自原对话，不应在新 session 中另行发明：

- **Iron Regent**：斯多葛主义、尼采的 self-overcoming、弗洛伊德的 sublimation；黑铁、火、冬天、悬崖、锻炉。
- **Avalokita**：佛教正念、无常、道家、ACT 的 self-as-context、Bion 的 container-contained；水、月亮、雾、湖面、莲花、银色。
- **Metis**：mētis、Ni + Te、Weber、Machiavelli、系统论、控制论、复杂系统、bounded rationality、antifragility、OODA；棋盘、星图、蜘蛛网、城市、建筑图纸、经纬线。
- **Socrates**：苏格拉底式追问、现象学、元认知、荣格 Shadow、care of the self；夜间书房、地下档案馆、镜子、黑曜石、烛火。
- **The Little Prince**：Schiller 的 Spieltrieb、Winnicott 的 true self、Jung 的 Puer Aeternus、日本美学 mono no aware、wabi-sabi、yūgen；星星、玫瑰、黄昏、风、草地、玻璃瓶、纸飞机。
- **Aeris**：Jung 的 Self ≠ Ego，并加入 non-self；白衣、无武器、无固定表情；代表 agency。

## Stage 0

用户已明确选择 Stage 0 先不做可视化，只利用 GitHub repo 和 `.md`：保存对话文档、prompt 与 memory，在 session 中注入相应 prompt 和关联 memory。

最小闭环：

```text
角色定义 → 注入相关 memory → 对话 → session summary
→ 人工批准 memory → 下一次继续
```

三层必须分开：

- Character prompt 定义角色。
- Memory 保存长期观察，但解释不是事实。
- Session 保存具体对话的原始记录或总结。

只有用户明确认可的 Memory Candidates 才进入长期 memory。

## Memory 原则

原对话中的例子：

不应写：

> Aeris fears abandonment.

应写：

> Hypothesis: in several situations, Aeris appeared to place unusually high weight on external recognition. Confidence: medium. Evidence: sessions X, Y.

在原对话中形成的核心句：

> No interpretation becomes identity without the Sovereign's consent.

## 已作决定

详见 `decisions/design-decisions.md`。后续 session 不得把未决定事项写成已决定事项，也不得静默覆盖已有 canon。

## Stage 1 网站方向

在 Stage 0 Markdown canon 基础上建立 GitHub Pages 网站：

- 首页 / Inner Polis 入口；
- 六个角色的独立介绍页；
- Council Hall、Starfield、Archive、Observatory、Forge、Lake、Garden；
- 哲学 codex、互动书、神话内在世界、克制的 2D 游戏界面；
- 夜空、大理石、水、铁、羊皮纸；
- 避免通用 SaaS dashboard 风格；
- 第一版不实现 LLM/API chat；
- Markdown 文件继续作为 canonical content/source of truth。

## 新 session 的工作规则

1. 先读取本文件、constitution、全部 character files 和 decisions。
2. repo 是 source of truth。
3. 不从头重做角色系统。
4. 不静默覆盖 canon；提出修改并等待用户接受。
5. 严格保留用户的原始表达，不擅自解释或增加哲学立场。
