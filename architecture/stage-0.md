# Stage 0

用户选择：先不做可视化，利用 GitHub repo 和 `.md`，把对话文档、prompt 等存进去；对话时注入 prompt 或相关联的 memory。相当于没有可视化的网站。

## 最小闭环

```text
角色定义
  → 注入相关 memory
  → 对话
  → session summary
  → 人工批准 memory
  → 下一次继续
```

## 三层内容

- **Character prompt**：这个角色是谁、怎么看世界、怎么说话、什么不能做。
- **Memory**：这个角色长期积累的观察，但不要把解释直接写成事实。
- **Session**：一次具体对话的原始记录或总结。

## Session 输出

```text
Session Summary
- What happened?
- What was discovered?
- What remains unresolved?

Memory Candidates
- candidate memories worth retaining

Actions / Decisions
- anything Aeris explicitly decided
```

只有用户明确认可的 Memory Candidates 才进入长期 memory。
