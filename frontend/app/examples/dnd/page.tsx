/**
 * 拖拽组件示例页面
 */

'use client';

import React, { useState } from 'react';
import { DraggableList, DraggableItem } from '@/components/dnd/DraggableList';
import { SortableGrid, SortableGridItem } from '@/components/dnd/SortableGrid';

export default function DndExamplePage() {
  const [listItems, setListItems] = useState<DraggableItem[]>([
    { id: '1', content: '项目 1' },
    { id: '2', content: '项目 2' },
    { id: '3', content: '项目 3' },
    { id: '4', content: '项目 4' },
    { id: '5', content: '项目 5' }
  ]);

  const [gridItems, setGridItems] = useState<SortableGridItem[]>([
    { id: '1', content: '卡片 1', size: 'medium', color: '#06b6d4' },
    { id: '2', content: '卡片 2', size: 'small', color: '#8b5cf6' },
    { id: '3', content: '卡片 3', size: 'large', color: '#ec4899' },
    { id: '4', content: '卡片 4', size: 'medium', color: '#f59e0b' },
    { id: '5', content: '卡片 5', size: 'small', color: '#10b981' },
    { id: '6', content: '卡片 6', size: 'medium', color: '#ef4444' }
  ]);

  const handleAddListItem = () => {
    const newItem: DraggableItem = {
      id: Date.now().toString(),
      content: `项目 ${listItems.length + 1}`
    };
    setListItems([...listItems, newItem]);
  };

  const handleAddGridItem = () => {
    const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const newItem: SortableGridItem = {
      id: Date.now().toString(),
      content: `卡片 ${gridItems.length + 1}`,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setGridItems([...gridItems, newItem]);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-cyber-cyan mb-2">
          拖拽排序
        </h1>
        <p className="text-cyber-muted">
          支持拖拽排序的列表和网格组件
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 拖拽列表 */}
        <div>
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">可拖拽列表</h2>
          <DraggableList
            items={listItems}
            onChange={setListItems}
            onAdd={handleAddListItem}
            onRemove={(id) => {
              setListItems(listItems.filter(item => item.id !== id));
            }}
            showHandles={true}
            showRemove={true}
            showArrows={true}
          />
        </div>

        {/* 拖拽网格 */}
        <div>
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">可拖拽网格</h2>
          <SortableGrid
            items={gridItems}
            onChange={setGridItems}
            onAdd={handleAddGridItem}
            onRemove={(id) => {
              setGridItems(gridItems.filter(item => item.id !== id));
            }}
            columns={2}
            showHandles={true}
            showRemove={true}
            allowResize={true}
          />
        </div>
      </div>
    </div>
  );
}
