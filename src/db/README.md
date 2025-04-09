# Table Tap 数据库

本目录包含Table Tap应用的数据库相关代码。

## 数据库结构

数据库使用PostgreSQL，通过Drizzle ORM进行管理。主要表结构包括：

- `users`: 用户信息
- `categories`: 菜单分类
- `menuItems`: 菜单项
- `optionGroups`: 选项组
- `options`: 选项
- `menuItemOptions`: 菜单项-选项组关联
- `tables`: 桌子信息
- `carts`: 购物车
- `cartItems`: 购物车项
- `orders`: 订单
- `orderItems`: 订单项
- `payments`: 支付记录

## 初始化步骤

首次设置数据库时，请按照以下步骤操作：

1. 确保您有一个PostgreSQL数据库实例，并设置了连接URL在环境变量中：

```bash
DATABASE_URL=postgres://user:password@host:port/database
```

2. 生成数据库迁移文件：

```bash
npm run db:generate
```

3. 应用迁移到数据库：

```bash
npm run db:push
```

4. 应用用户角色修复迁移（如果需要）：

```bash
npm run db:apply-migration
```

5. 创建管理员用户：

```bash
npm run db:create-admin
```

按照提示输入管理员邮箱、密码和姓名。此操作会为您创建一个具有管理权限的用户。

## 数据库迁移脚本

我们提供了一个自动化迁移脚本来处理数据库结构的变更，特别是从旧结构（使用`is_admin`字段）到新结构（使用`role`字段）的过渡。

### 用户角色迁移

`applyMigration.js`脚本可以自动执行以下操作：

1. 检查用户表中是否存在`role`列
2. 如果不存在，添加`role`列并设置默认值为`'customer'`
3. 检查是否存在旧的`is_admin`列
4. 如果存在，将`is_admin = true`的用户角色设置为`'admin'`，其他用户设置为`'customer'`
5. 所有操作在事务中执行，确保数据一致性

运行迁移脚本：

```bash
npm run db:apply-migration
```

脚本执行时会显示详细的进度信息，告知您执行了哪些操作。如果迁移已经完成，脚本会安全地退出而不做任何更改。

### 自定义迁移

如果您需要执行其他自定义迁移，可以参考`src/db/scripts/applyMigration.js`的模式，创建新的迁移脚本。

## 数据库问题排查

如果您在使用系统时遇到"column 'role' does not exist"错误，这意味着您的数据库结构需要更新。请运行：

```bash
npm run db:apply-migration
```

这将应用必要的迁移来添加role列并更新用户表结构。

### 常见问题解决方案

1. **连接错误**: 检查您的`DATABASE_URL`环境变量是否正确设置
2. **权限错误**: 确保数据库用户有足够的权限执行ALTER TABLE操作
3. **表不存在**: 请先运行`npm run db:push`创建基本表结构

## 数据库视图

您可以使用Drizzle Studio查看和编辑数据库内容：

```bash
npm run db:studio
```

这将启动一个Web界面，您可以通过它查看和管理数据库内容。

## 目录结构

```
src/db/
  ├── index.js          # 数据库连接配置
  ├── schema.js         # 数据库表结构定义
  ├── migrations/       # 数据库迁移文件 (由drizzle-kit生成)
  ├── scripts/          # 数据库脚本
  │   ├── applyMigration.js  # 迁移脚本
  │   └── createAdmin.js     # 创建管理员脚本
  └── README.md         # 本文档
```

## 环境变量配置

在项目根目录的`.env`文件中设置以下环境变量:

```
DATABASE_URL="postgres://user:password@host:port/database"
NODE_ENV="development"
```

## 可用命令

在`package.json`中配置了以下命令:

- `npm run db:generate` - 生成数据库迁移文件
- `npm run db:push` - 将模式更改直接推送到数据库
- `npm run db:studio` - 启动Drizzle Studio可视化界面管理数据库
- `npm run db:apply-migration` - 运行数据库迁移脚本
- `npm run db:create-admin` - 创建管理员用户

## 使用方法

### 在API路由中使用

```javascript
import { db } from '@/db';
import { users } from '@/db/schema';

// 获取所有用户
const allUsers = await db.select().from(users);

// 获取特定用户
import { eq } from 'drizzle-orm';
const user = await db.select().from(users).where(eq(users.id, userId));

// 创建用户
const newUser = await db.insert(users).values({
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
}).returning();

// 更新用户
await db.update(users)
  .set({ name: 'Updated Name' })
  .where(eq(users.id, userId));

// 删除用户
await db.delete(users).where(eq(users.id, userId));
```

### 关系查询示例

```javascript
import { db } from '@/db';
import { users, tasks } from '@/db/schema';

// 获取用户及其任务
const usersWithTasks = await db.select({
  id: users.id,
  name: users.name,
  email: users.email,
  tasks: tasks
}).from(users)
  .leftJoin(tasks, eq(users.id, tasks.userId));
```

## 更多资源

- [Drizzle ORM 文档](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit 文档](https://orm.drizzle.team/kit-docs/overview) 