import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonTableProps {
  className?: string;
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

/**
 * SkeletonTable - 骨架屏表格组件
 * 用于表格加载时显示占位符
 */
export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  className,
  rows = 5,
  columns = 4,
  showHeader = true,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          {showHeader && (
            <thead>
              <tr>
                {Array.from({ length: columns }).map((_, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 bg-gray-900 animate-pulse"
                  >
                    <div className="h-4 bg-gray-800 rounded w-24 mx-auto" />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-gray-800">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-gray-800 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonTable;
