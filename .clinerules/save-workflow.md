# Save Workflow - 自动构建、提交和发布

每次输入"save"时自动执行以下步骤：

## 工作流程
1. **分析更改**：检查git状态和文件更改
2. **构建项目**：运行 `npm run build` 确保代码无误
3. **生成提交信息**：基于更改内容自动生成有意义的提交信息
4. **提交更改**：`git add . && git commit -m "自动生成的提交信息"`
5. **推送代码**：`git push` 到GitHub
6. **部署状态**：如果配置了自动部署，会触发线上更新

## 提交信息生成规则
- 如果只有样式/文本更改：`style: update UI/typography`
- 如果有功能新增：`feat: add new feature description`
- 如果有bug修复：`fix: resolve issue description`
- 如果有重构：`refactor: improve code structure`
- 默认：`update: ${更改的文件数量} files modified`

## 支持的文件类型
- 代码文件：`.tsx`, `.ts`, `.js`, `.jsx`
- 样式文件：`.css`, `.scss`, `.less`
- 配置文：`package.json`, `vite.config.ts`, `tailwind.config.js`
- 文档：`.md`, `README.md`

## 跳过规则
不会提交以下情况：
- 只有注释更改
- 只有格式化更改
- node_modules或其他构建产物
- .DS_Store等系统文件

## 使用方法
在聊天中输入：`save`

Cline会自动执行完整的工作流程并报告结果。
