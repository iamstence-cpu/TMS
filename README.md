# 健康管理师 AI 多智能体训练平台 MVP

## 项目简介
面向健康管理师的岗位训练平台，提供 4 套预置训练主题，覆盖微课、小测、Workflow 流程模拟、Roleplay 对话演练与自动评估报告。

> 本系统仅用于教学实训，不替代医疗诊断或处方行为。

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
7. 生成并查看报告页

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

## 测试
```bash
npm test
```

## 后续扩展
- 账号体系、班级管理
- 语音输入/TTS
- RAG知识库
- 机构报表
- 多 agent 编排
