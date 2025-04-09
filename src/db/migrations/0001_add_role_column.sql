-- 添加role列
ALTER TABLE "users" ADD COLUMN "role" varchar(50) DEFAULT 'customer' NOT NULL;

-- 更新现有管理员
UPDATE "users" SET "role" = 'admin' WHERE "is_admin" = true;

-- 移除is_admin列
ALTER TABLE "users" DROP COLUMN "is_admin"; 