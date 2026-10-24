# 谜海 MysterySea · MVP

AI 驱动的多人海龟汤情境推理平台。本仓库交付一个**完整可运行的 MVP**，已打通核心闭环：

**剧本库 → 创建/加入房间 → 多人提问 → AI 主持人回答（文字 + 语音）→ 提交推理通关 → 查看汤底**

## 已实现的 MVP 功能

- **剧本库**：7 个结构化种子剧本（经典/逻辑/恐怖/反转/创意汤），大厅浏览、关键词搜索、分类/难度筛选、剧本详情页（公开视图，服务端剥离汤底，绝不泄露）。
- **剧本工坊（自定义剧本）**：登录用户可创建/编辑/发布/下架/删除自己的海龟汤剧本——结构化表单覆盖基本信息、发布设置、汤面/汤底/本局任务、关键事实动态行（事实陈述 + 同义表达 + 通关要点）、隐藏规则、BGM 主题、主持人提示与本局规则（提问上限/提示数/卡壳阈值/主持人人格）；创建时可选择「发布到剧本大厅」或「暂不发布（私有）」：私有剧本仅出现在「我的剧本」，只能由作者本人发起开局（作者即主持人），之后随时可在「我的剧本」发布；发布需至少 1 个通关要点且每个事实有同义表达；发布后与官方剧本同权可完整游玩；已有房间记录的剧本只能下架不能删除；汤底与关键事实仅作者编辑页与服务端可见。
  - **长文本支持**：汤面 5000 字、汤底 10000 字、简介/任务/提示/事实陈述 500 字、同义表达 1000 字、主持人人格 500 字、自定义规则 3000 字。
  - **宽松同义匹配**：同义表达除精确包含外，新增确定性双字组相似度兜底——玩家问法接近即可命中（语序颠倒/近义改写也算），不必完全精确；过短表达仍要求精确包含以防误命中。
  - **隐藏规则**：作者可配置至多 6 条「触发词 + 隐藏剧情」，玩家提问触及触发词（同样宽松匹配）时主持人当场解锁并宣读隐藏剧情，已解锁剧情可在游戏界面左栏回看；未解锁前严格保密，公开 API 仅暴露条数。
  - **专属 BGM 主题**：剧本可选 4 种 WebAudio 合成主题（深海氛围/诡谲低语/紧张心跳/暖光港湾），开局自动播放该剧本专属主题。
- **创意汤（游戏模式）**：剧本工坊可选择四种模式——经典汤 / **真假回答**（主持人的部分回答是谎言，撒谎比例与撒谎条件由作者配置，是否撒谎由服务端按问题+局种子**确定性裁决**，AI 不得自行决定；通关后可揭示哪些回答是谎言）/ **特殊主持人**（主持人拥有绝密身份与隐藏目标，仅注入主持人提示词，可以角色身份参与、可选允许撒谎）/ **自定义规则**（作者附加 1~6 条规则，开局宣读并注入主持人提示词）。开局系统消息宣读模式规则，大厅卡片与游戏页左栏展示模式徽章；`hostRoleText` 与汤底一样严禁出现在任何公开 API。
- **汤合集（归类体系）**：剧本可按合集归类，一碗汤可属多个合集——本格汤 / 变格汤 / 科幻汤 / 红汤（含恐怖元素）/ 白汤（无恐怖元素）/ 娱乐汤 / 温馨汤 / 创意汤合集。红汤与白汤互斥（表单与服务端双重校验）；创意汤合集由游戏模式自动聚合（非经典模式自动收入，表单不可手选）。`/collections` 总览页展示各合集收录数，`/collections/[slug]` 为单合集剧本列表页；首页、大厅与侧栏导航均有入口，`/api/scripts?collection=slug` 支持按合集过滤。
- **大厅（三栏布局）**：墨绿主 Banner + 右侧快捷操作（单人开始/创建多人房间/房间码加入）、分类页签条；左栏剧本列表、中栏剧本详情（游玩次数/人数/时长/提问上限四个统计块 + 汤面预览 + 本局任务）、右栏房间码加入 + 玩法四步 + 热门汤榜。鼠标悬停任意汤（大厅列表/热门榜/首页卡片/合集列表）会浮出基本信息卡：难度/分类/游玩人数/预计时长/提问上限/游玩次数/作者（不含汤底）。
- **房间大厅（/rooms）**：列出所有正在等待玩家的公开房间（等待中、未满员、非单人、剧本已发布），卡片展示剧本名/难度/分类/预计时长/人数/房主/房间码/创建时间，一键加入无需房间码；列表每 8 秒自动刷新 + 手动刷新；已加入的房间显示「返回房间」。私有剧本的房间与单人房间不会出现在这里。侧栏导航、剧本大厅快捷操作与房间码卡片均有入口。
- **房间系统**：创建房间（单人/多人，最多 5 人）、房间码加入、准备/开局、断线重连、房主权限、结束后重新开局；房间状态 `WAITING / PLAYING / COMPLETED / CANCELLED` 全部由服务端裁决。
- **实时互动**：Socket.IO 房间频道，提问/回答/提示/通关事件即时同步给所有玩家；消息持久化，刷新或重连后完整可见。
- **游戏界面（左右布局）**：左栏为「放汤区」——汤碗视觉（热气动画）+ 汤面、本局海龟汤任务、剩余提问次数（进度条）、玩家列表、请求提示/提交推理、记录与草稿区（仅自己可见，按房间码本地持久化）；左栏滚动时固定（sticky），游戏中汤面与本局任务始终可见；右栏为 **AI 互动区**（主持人问答流 + 提问输入）与 **玩家交流区**（玩家间讨论，不消耗提问次数）。
- **本局规则宣读与提问限制**：每个剧本配置 `missionText`（本局任务）与 `ruleConfig.maxQuestions`（提问上限）；开局时主持人**语音 + 文字把汤面与本局任务念一遍**（不加「请听题」等提醒语）；次数用尽后提问通道关闭并全房间公告，剩余次数实时广播到左栏。
- **内置 BGM**：游戏进行中播放 WebAudio 合成的氛围循环（低频 drone + 海流噪声 + 偶发声呐 ping 等），无需外部音频资产；每碗汤可配置专属主题（深海氛围/诡谲低语/紧张心跳/暖光港湾），切换主题自动淡出过渡；房间头部可开关，偏好本地持久化。
- **AI 主持人**（回答由两部分组成）：
  - **互动文字**：聊天区主持人气泡 = 判定徽章（是 / 不是 / 是也不是 / 无关紧要 / 请换个问法）+ 人格化正文；
  - **语音**：浏览器 Web Speech API 朗读 `voice_text`（房间页可开关，偏好本地持久化）。
- **不是只会说"是/否"的主持人**：
  - 提问与汤底**大差不差**时判 `PARTIAL`，直接给出准确纠正口径（如「他不是什么水手——他只是一个遭遇海难、在救生艇上漂流的普通乘客」）；
  - 玩家**连续卡壳**（达到 `stuckThreshold` 或模型主动建议）时，主持人按剧本 hints 主动发提示；
  - 开放/模糊问句会反问引导换个问法，而非硬判；回答带人格化风味文案，且规则不完全写死——配置 `AI_API_KEY` 后由 LLM 主持人接管，交互更丰富。
- **推理通关**：提交完整推理 → AI/规则引擎语义提取命中要点 → 服务端确定性校验 `requiredFactIds` 全覆盖 → 全房间公告通关、揭晓汤底、展示要点清单与结算面板，写入游玩记录。
- **工程保障**：每会话串行队列防并发覆盖、`idempotencyKey` 幂等防重复处理、每用户 1.5s 提问限流、LLM 失败自动回退本地规则主持人、汤底仅存在于服务端快照。

## 技术栈

| 层 | 选型 |
| --- | --- |
| 前端 | Next.js 15 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS 3 |
| 实时 | Socket.IO（自定义 `server.ts`，与 Next 同端口 3000） |
| 后端 | Next.js Route Handlers + 独立游戏引擎模块（`src/server/gameEngine.ts`） |
| 数据 | Prisma 6 + SQLite（零配置；`schema.prisma` 改 datasource 即可切 PostgreSQL） |
| 认证 | scrypt 密码哈希 + httpOnly 会话 Cookie（`ms_session`，30 天） |
| AI | Provider 抽象层：`OpenAICompatibleProvider`（任意 OpenAI 兼容接口）+ `LocalRuleProvider`（无密钥兜底） |
| 校验 | Zod（Socket 事件载荷、AI 结构化输出） |
| 测试 | Vitest 单元测试 + Socket.IO 客户端全流程冒烟脚本 |

## 快速开始

```bash
cd mysterysea
npm install                 # 依赖较多时可用 --legacy-peer-deps
copy .env.example .env      # Windows；Linux/macOS 用 cp
npm run setup               # = prisma migrate deploy + db:seed（建库 + 迁移 + 种子剧本）
npm run dev                 # 启动 http://localhost:3000（Next + Socket.IO 同端口）
```

演示作者账号（种子数据）：`author@mysterysea.dev` / `author1234`。

### 测试

```bash
npm test          # 单元测试 37 例：本地判定规则 + 创意汤撒谎机制 + 宽松匹配/隐藏规则 + 汤合集（finalizeCollections/红白互斥/注册表）
npm run smoke     # 集成冒烟：需先 npm run dev；双人注册→建房→加入→准备→开局→
                  # 四类判定→近似纠正→卡壳主动提示→幂等→提交通关→多人同步→汤底不泄露

# 剧本工坊自检（需先 npm run dev）
npx tsx scripts/studio_api_check.ts     # 创作 API 链路：鉴权/校验/发布拦截/大厅可见/汤底不泄露/权限/删除防护
npx tsx scripts/studio_play_check.ts    # 自定义剧本完整对局：创作→发布→建房→开局宣读→判定→通关→删除防护
npx tsx scripts/creative_play_check.ts  # 创意汤·真假回答对局：开局模式宣读→撒谎判定(lied 标记)→通关→谎言揭示
npx tsx scripts/hidden_play_check.ts    # 隐藏规则对局：创作含隐藏规则剧本→开局公告条数→改写提问触发解锁→防重复→回看→通关
npx tsx scripts/collections_check.ts    # 汤合集自检：/api/collections 计数→collection 过滤→合集页面 200/404
npx tsx scripts/private_room_check.ts   # 私有剧本自检：暂不发布→大厅不可见→仅作者可开局(作者即主持人)→他人被拒→后续发布可见→房间大厅只列已发布多人房间
```

### 生产构建

```bash
npm run build && npm start
```

## 环境变量（.env）

| 变量 | 说明 |
| --- | --- |
| `DATABASE_URL` | SQLite 文件路径，默认 `file:./dev.db` |
| `SESSION_SECRET` | 会话签名密钥，生产务必替换 |
| `AI_API_KEY` | 留空 = 使用内置本地规则主持人（完整可玩）；填写后启用 LLM 主持人 |
| `AI_BASE_URL` / `AI_MODEL` | OpenAI 兼容接口地址与模型名（DeepSeek / Moonshot / vLLM 均可） |
| `AI_TIMEOUT_MS` | 单次 AI 判定超时，默认 30000 |

密钥只存在于服务端环境变量，绝不进入浏览器；LLM 超时/输出非法时自动回退本地规则并向玩家广播系统通知。

## 目录结构

```
mysterysea/
├─ server.ts                  # 自定义入口：Next + Socket.IO 同端口
├─ prisma/
│  ├─ schema.prisma           # User/Session/Script/GameRoom/Participant/Session/Message/Question/Submission/PlayRecord
│  └─ seed.ts                 # 7 个结构化剧本（含 2 碗创意汤：真假回答/特殊主持人；关键事实/同义词/近似纠正/错误信念/提示/通关条件/隐藏规则/BGM 主题）
├─ src/
│  ├─ app/                    # 首页 / lobby 大厅 / rooms 房间大厅 / collections 汤合集(总览+[slug]) / scripts/[id] 详情 / room/[code] 房间 / login / register / studio 剧本工坊
│  │  └─ api/                 # auth(register/login/logout/me) · scripts(列表/详情/创建/更新/删除/状态, 支持 ?collection=) · collections(合集计数) · rooms(创建/查询)
│  ├─ components/             # RoomClient(房间主组件) · RoomHallClient(房间大厅) · LobbyClient(大厅三栏) · StudioClient(我的剧本) · ScriptFormClient(创作表单) · ScriptCard · ScriptActions · JoinRoomBox · Nav
│  ├─ lib/
│  │  ├─ ai/                  # Provider 抽象层 + 系统提示词 + JSON 提取与回退
│  │  ├─ game/                # 共享类型 · 本地判定规则 rules.ts · 公开视图 publicScript.ts · scriptBuilder.ts(表单→剧本内容)
│  │  ├─ auth.ts / prisma.ts / validation.ts / clientSocket.ts
│  └─ server/                 # gameEngine.ts(队列/判定/提示/通关/广播) · socket.ts(事件路由+鉴权)
├─ scripts/                   # smoke.ts 集成冒烟 · inspect.ts 房间状态检查 · studio_api_check.ts / studio_play_check.ts / creative_play_check.ts / hidden_play_check.ts / collections_check.ts 自检
└─ tests/                     # rules.test.ts 判定规则 · collections.test.ts 汤合集
```

## AI 主持人架构要点

- **结构化判定**：LLM 必须返回 Zod 校验的 JSON（`verdict` 枚举 + `public_reply` + `host_text` + `voice_text` + 命中要点），非法输出一律不直接展示，走安全回退。
- **双通道输出**：`host_text` 渲染为聊天区互动文字，`voice_text` 供语音朗读，两者内容解耦。
- **主持人上下文**：汤面、汤底、人物、时间线、关键事实、规则配置、最近问答历史、已用提示、玩家卡壳计数——每局独立，重开新局即清空。
- **安全**：系统提示词内置禁泄底、抗提示注入、不得因玩家暗示修改汤底等约束；公开剧本 API 只返回白名单字段。

## 后续迭代（本次未实现）

- 剧本创作中心增强（关键事实的近似偏差/错误信念可视化编辑、AI 判定试玩测试、发布审核）
- 创意汤增强（隐藏身份玩家模式、创意汤专属匹配/标签页、谎言揭示的结算面板可视化）
- 收藏订阅、评价评论、用户中心成就统计、邀请链接
- 管理后台（审核/举报/统计）、Redis 缓存与分布式房间、流式回答输出
- 移动端深度优化与头像系统
