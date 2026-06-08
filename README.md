# 消消乐游戏 (Match-3 Game)

## How to Run

### Docker 运行（推荐）

```bash
# 构建并启动
docker compose up --build -d

# 查看运行状态
docker compose ps

# 查看日志
docker compose logs -f frontend-admin

# 停止服务
docker compose down
```

访问地址：http://localhost:8081

### 本地开发运行

```bash
cd frontend-admin
npm install
npm run dev
```

访问地址：http://localhost:8081

## Services

| 服务名称 | 端口 | 描述 |
|---------|------|------|
| frontend-admin | 8081 | 消消乐游戏前端服务 |

## 测试账号

本项目为单机游戏，无需登录账号即可游玩。

## 题目内容

在当前目录下，写一个消消乐的 Vue 游戏。

## 项目介绍

这是一个基于 Vue 3 + TypeScript + Vite 构建的经典消消乐游戏。玩家通过交换相邻的宝石，使三个或更多相同颜色的宝石连成一线即可消除得分。

### 游戏特性

- 🎮 经典三消玩法
- ✨ 流畅的动画效果
- 🎯 计分系统和连击奖励
- ⏱️ 限时挑战模式
- 🎨 精美的视觉设计
- 📱 响应式布局

### 技术栈

- Vue 3 (Composition API)
- TypeScript
- Vite
- Pinia (状态管理)
- CSS3 动画

### 项目结构

```
├── docker-compose.yml        # Docker 编排配置
├── .gitignore                # Git 忽略配置
├── README.md                 # 项目文档
└── frontend-admin/           # 前端项目
    ├── Dockerfile            # Docker 构建文件
    ├── nginx.conf            # Nginx 配置
    ├── package.json          # 项目依赖
    ├── vite.config.ts        # Vite 配置
    ├── tsconfig.json         # TypeScript 配置
    └── src/
        ├── main.ts           # 入口文件
        ├── App.vue           # 根组件
        ├── components/       # 组件目录
        │   ├── ComboDisplay.vue # 连击提示
        │   ├── GameBoard.vue    # 游戏面板
        │   ├── GameHeader.vue   # 游戏头部
        │   ├── GameOverModal.vue# 游戏结束弹窗
        │   ├── GemCell.vue      # 宝石单元格
        │   ├── ScorePanel.vue   # 计分面板
        │   └── ToastMessage.vue # 提示消息
        ├── stores/           # 状态管理
        │   └── gameStore.ts     # 游戏状态
        ├── types/            # 类型定义
        │   └── game.ts          # 游戏类型
        ├── utils/            # 工具函数
        │   └── gameUtils.ts     # 游戏工具
        └── styles/           # 样式文件
            └── variables.css    # CSS 变量
```

### 游戏规则

1. 点击选中一个宝石，再点击相邻的宝石进行交换
2. 三个或更多相同颜色的宝石连成一线即可消除
3. 消除后上方宝石会下落，空位会生成新宝石
4. 连续消除可获得连击奖励
5. 在限定时间内获得尽可能高的分数

### Docker 镜像说明

本项目使用的基础镜像均支持多平台架构（AMD64/ARM64）：
- 构建阶段：`node:20-alpine`
- 生产阶段：`nginx:1.25-alpine`

可在 Apple Silicon (M1/M2/M3) 和 Intel/AMD 处理器上正常运行。
