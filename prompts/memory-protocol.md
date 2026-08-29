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
candidate_id: candidate-YYYY-MM-DD-NNN
owner: shared | aeris | iron-regent | avalokita | metis | socrates | little-prince
visibility: private | council | sovereign
type: belief | emotion | event | decision | observation
statement: "..."
epistemic_status: observation | hypothesis
confidence: low | medium | high
evidence:
  - sessions/YYYY-MM-DD/session-file.md
created_at: YYYY-MM-DD
review_status: pending | rejected | deferred | promoted
approved_by_aeris: false
```

## Accepted memory

```yaml
memory_id: memory-YYYY-MM-DD-NNN
source_candidate_id: candidate-YYYY-MM-DD-NNN
owner: shared | aeris | iron-regent | avalokita | metis | socrates | little-prince
visibility: private | council | sovereign
type: belief | emotion | event | decision | observation
statement: "Exact Aeris-approved statement"
epistemic_status: observation | hypothesis | accepted-decision
confidence: low | medium | high
evidence:
  - sessions/YYYY-MM-DD/session-file.md
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
approved_by_aeris: true
supersedes: null | memory-YYYY-MM-DD-NNN
state: current | superseded | archived
```

## Review and revision lifecycle

1. Session 结束时输出 Memory Candidates。
2. 不自动写入长期 memory。
3. Aeris 逐条审核 closed session record 中的 candidate ID：`ACCEPT`、`EDIT`、`REJECT` 或 `DEFER`。
4. `EDIT` 仅替换待审核文本；仍须 `ACCEPT` 才能提升。`REJECT` 和 `DEFER` 只保留在 source session，不写入 memory。
5. `ACCEPT` 将 candidate 的 `review_status` 标为 `promoted`，并在恰好一个 owner store 创建 accepted memory；保留 evidence、confidence、owner 和 visibility。
6. `REVISE` 以既有 memory ID 创建 pending candidate，不覆盖原条目；只有接受该 candidate 后，新 memory 才会以 `supersedes` 指向原 memory，原 memory 的 `state` 变为 `superseded`。
7. `ARCHIVE` 在 Aeris 确认后将 accepted memory 的 `state` 设为 `archived`，保留 evidence 与 Git history。`KEEP` 不作更改。
8. 不允许匿名批量接受；多项操作必须逐一列出每个 candidate 或 memory ID。

## 核心句

> No interpretation becomes identity without the Sovereign's consent.
