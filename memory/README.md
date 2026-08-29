# Memory

Memory 保存角色长期积累的观察。解释不能直接写成事实。

## 与其他内容的区别

- `characters/`：角色定义。
- `sessions/`：一次具体对话的原始记录或总结。
- `memory/`：由 session 提出、经过用户明确认可后保留的长期内容。

## 写入规则

1. Session 先输出 Memory Candidates。
2. 用户明确接受后才能写入长期 memory。
3. 每条 memory 保存 owner、visibility、type、confidence、evidence 和时间。
4. Hypothesis 继续标注为 hypothesis，不能改写成 fact。
5. 角色 memory 分开管理；shared memory 只保存需要被多个角色读取的内容。

详细格式见 `prompts/memory-protocol.md`。
