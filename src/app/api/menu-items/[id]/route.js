import { NextResponse } from 'next/server';
import db from '@/db';
import { menuItems, menuItemOptions, optionGroups, options } from '@/db/schema';
import { eq } from 'drizzle-orm';

// 获取单个菜单项及其自定义选项
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // 获取菜单项
    const item = await db.select()
      .from(menuItems)
      .where(eq(menuItems.id, parseInt(id)))
      .limit(1);
    
    if (item.length === 0) {
      return NextResponse.json(
        { error: '菜单项不存在' },
        { status: 404 }
      );
    }
    
    // 获取菜单项相关的选项组
    const itemOptionGroups = await db.select({
      optionGroup: optionGroups
    })
    .from(menuItemOptions)
    .innerJoin(
      optionGroups,
      eq(menuItemOptions.optionGroupId, optionGroups.id)
    )
    .where(eq(menuItemOptions.menuItemId, parseInt(id)));
    
    // 获取每个选项组的选项值
    const optionGroupsWithOptions = await Promise.all(
      itemOptionGroups.map(async ({ optionGroup }) => {
        const optionValues = await db.select()
          .from(options)
          .where(eq(options.groupId, optionGroup.id))
          .orderBy(options.displayOrder);
        
        return {
          ...optionGroup,
          options: optionValues
        };
      })
    );
    
    return NextResponse.json({
      ...item[0],
      optionGroups: optionGroupsWithOptions
    });
    
  } catch (error) {
    console.error('获取菜单项详情失败:', error);
    return NextResponse.json(
      { error: '获取菜单项详情失败' },
      { status: 500 }
    );
  }
} 