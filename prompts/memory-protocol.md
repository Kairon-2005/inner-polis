# Memory Protocol

## 原则

Character prompt、memory 与 session 分开。

- Character prompt 定义角色是谁、怎么看世界、怎么说话、什么不能做。
- Memory 保存角色长期积累的观察，但不要把解释直接写成事实。
- Session 是一次具体对话的原始记录或总结。
- 只有用户明确认可的 Memory Candidates 才进入长期 memory。

## 禁止的写法

```text
Aeris fears abandonment.
```

## 原对话建议的写法

```text
Hypothesis: in several situations, Aeris appeared to place unusually high weight on external recognition.
Confidence: medium.
Evidence: sessions X, Y.
```

## Memory candidate

```yaml
id: candidate-YYYY-MM-DD-NNN
owner: shared | aeris | iron-regent | avalokita | metis | socrates | little-prince
visibility: private | council | sovereign
type: belief | emotion | event | decision | observation
statement: "..."
status: observation | hypothesis | accepted
confidence: low | medium | high
evidence:
  - sessions/YYYY-MM-DD-name.md
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
approved_by_aeris: false
```

## Promotion

1. Session 结束时输出 Memory Candidates。
2. 不自动写入长期 memory。
3. 用户逐条接受、修改或拒绝。
4. 只有接受后的 candidate 可以写入 `memory/`。
5. 保留 evidence、confidence、owner 和 visibility。
6. 如果以后修改，更新 `updated_at`，不要静默改写来源。

## 核心句

> No interpretation becomes identity without the Sovereign's consent.
