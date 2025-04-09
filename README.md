# Table Tap 智能餐厅点餐系统

Table Tap 是一个现代化的餐厅点餐系统，通过扫描桌面二维码实现顾客自助点餐，提高服务效率和用户体验。系统包含管理后台和客户点餐前端，支持菜品管理、订单处理、支付集成等完整功能。
项目讲解视频在我的youtube频道：https://www.youtube.com/@thevaliantfodder

## 📋 功能特点

### 顾客端
- **扫码点餐**: 顾客通过扫描桌上二维码直接进入点餐页面
- **直观菜单**: 分类展示菜品，配有图片和详细描述
- **个性化选择**: 支持菜品规格、配料等多种选项定制
- **实时购物车**: 动态更新所选菜品和总价
- **在线支付**: 支持多种支付方式，包括支付宝、微信支付等
- **订单跟踪**: 查看订单状态和预计上菜时间

### 管理端
- **仪表盘概览**: 销售数据和订单情况实时统计
- **菜单管理**: 添加、编辑、下架菜品及分类管理
- **订单处理**: 实时接收订单、修改订单状态
- **桌号管理**: 生成桌面二维码，管理餐桌状态
- **用户管理**: 管理员和员工账户权限控制
- **数据分析**: 销售趋势、热门菜品分析等

## 🚀 技术栈

- **前端**: 
  - Next.js 15 (React框架)
  - Tailwind CSS (样式库)
  - React Context API (状态管理)

- **后端**: 
  - Next.js API Routes (服务器端API)
  - PostgreSQL (数据库)
  - Drizzle ORM (数据库ORM)

- **工具与库**:
  - qrcode.react (二维码生成)
  - html2canvas (二维码导出)
  - bcrypt (密码加密)

## 🛠️ 安装与设置

### 前提条件
- Node.js 18+ 
- PostgreSQL 数据库
- npm 或 yarn 包管理器

### 安装步骤

1. 克隆仓库
```bash
cd table-tap
```

2. 安装依赖
```bash
npm install
# 或使用 yarn
yarn install
```

3. 环境变量配置
创建 `.env.local` 文件并配置以下变量:
```
DATABASE_URL=


4. 数据库设置
```bash
# 生成数据库迁移文件
npm run db:generate

# 应用迁移到数据库
npm run db:push

# 如果从旧结构迁移(is_admin到role字段)
npm run db:apply-migration
```

5. 启动开发服务器
```bash
npm run dev
```

6. 访问系统
   - 管理后台: http://localhost:3000/admin
   - 客户点餐: 扫描生成的桌面二维码

## 📱 使用指南

### 管理员操作流程

1. **登录系统**: 使用管理员账户登录系统
2. **管理菜单**: 通过菜单管理页面添加或编辑菜品
3. **生成二维码**: 在二维码管理页面为每个桌子生成专属二维码
4. **打印二维码**: 下载生成的二维码并放置于对应餐桌
5. **处理订单**: 通过订单管理页面查看和处理顾客下单

### 顾客点餐流程

1. **扫描二维码**: 使用手机扫描桌面上的二维码
2. **浏览菜单**: 查看分类菜单和菜品详情
3. **选择菜品**: 将喜欢的菜品添加到购物车
4. **确认订单**: 检查购物车并确认订单信息
5. **在线支付**: 选择支付方式完成支付
6. **等待上菜**: 查看订单状态等待上菜

## 🗄️ 数据库结构

系统使用PostgreSQL数据库，通过Drizzle ORM进行管理。主要表结构包括：

- `users`: 用户信息，包括管理员和员工
- `categories`: 菜品分类
- `menuItems`: 菜单项
- `optionGroups`: 选项组（如温度、甜度等）
- `options`: 具体选项
- `menuItemOptions`: 菜单项与选项关联
- `tables`: 餐桌信息
- `carts`: 购物车
- `cartItems`: 购物车项目
- `orders`: 订单信息
- `orderItems`: 订单中的具体项目
- `payments`: 支付记录


## 👥 贡献与开发

欢迎贡献代码、提交问题或建议！

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 📄 许可证

本项目采用MIT许可证 - 详情见 [LICENSE](LICENSE) 文件

