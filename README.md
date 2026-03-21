# 健康管理师 AI 多智能体训练平台 MVP（迭代中）

## 当前状态判断
当前版本已具备 **可演示的 MVP 主链路**：
- 首页/主题列表/详情
- 创建 session
- 微课小测
- Workflow 模拟
- Roleplay 对练
- 报告生成与下一训练推荐
- 管理端训练编辑（基础信息 + 微课 + workflow + roleplay）

> 说明：仍属于“可运行 MVP”，不是生产级版本；账号体系、机构化运营、审计权限等尚未实现。

## 技术栈
- Next.js 14 + TypeScript + App Router
- Prisma + SQLite
- Tailwind CSS
- Zod
- OpenAI-compatible LLM abstraction（含 fallback）

## 快速开始
```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```
访问 `http://localhost:3000`。

## 预置训练主题
1. 首次健康信息采集与建档
2. 高血压高风险人群健康教育与干预沟通
3. 糖尿病管理对象随访沟通与依从性提升
4. 体重管理咨询与行为改变激励

## 推荐演示路径
1. 首页 → 训练主题列表
2. 进入“高血压高风险人群健康教育与干预沟通”
3. 开始 session
4. 完成微课小测
5. 完成 workflow steps
6. 进行 roleplay（6~8轮）
7. 完成并查看报告页（含推荐下一训练）

## API
- `GET/POST /api/trainings`
- `GET/PUT /api/trainings/[id]`
- `POST /api/sessions`
- `GET /api/sessions/[id]`
- `POST /api/sessions/[id]/microlearning/submit`
- `POST /api/sessions/[id]/workflow/submit-step`
- `POST /api/sessions/[id]/roleplay/message`
- `POST /api/sessions/[id]/complete`
- `GET /api/sessions/[id]/report`
- `GET /api/recommendations/next-training?sessionId=...`

## 下一步开发建议（MVP+）
- 登录/组织/班级与学习进度归档
- 管理端表单化编辑（替代 JSON 文本）
- 评估解释可追溯证据面板
- 机构级训练报表与导出
- 多 agent 编排与提示词版本管理

## 测试
```bash
npm test
```
