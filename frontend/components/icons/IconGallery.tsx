'use client';

/**
 * IconGallery - 图标画廊组件
 * 展示所有可用的赛博朋克风格图标
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Copy, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CyberIcon } from './CyberIcon';

const iconCategories = [
  { name: '基础', icons: ['Home', 'User', 'Settings', 'Search', 'Menu'] },
  { name: '媒体', icons: ['Play', 'Pause', 'Volume2', 'Mic', 'Image'] },
  { name: '文件', icons: ['File', 'Folder', 'Download', 'Upload', 'Save'] },
  { name: '编辑', icons: ['Edit', 'Trash2', 'Copy', 'Cut', 'Clipboard'] },
  { name: '社交', icons: ['Github', 'Twitter', 'Mail', 'MessageCircle', 'Share2'] },
  { name: '开发', icons: ['Code', 'Terminal', 'Database', 'Cpu', 'HardDrive'] },
];

const colorOptions = [
  { name: 'Cyan', value: 'cyan' as const },
  { name: 'Purple', value: 'purple' as const },
  { name: 'Pink', value: 'pink' as const },
  { name: 'Yellow', value: 'yellow' as const },
  { name: 'Green', value: 'green' as const },
];

export function IconGallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<'cyan' | 'purple' | 'pink' | 'yellow' | 'green'>('cyan');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const handleCopy = async (iconName: string) => {
    const code = `import { ${iconName} } from 'lucide-react';\n\n<CyberIcon icon={${iconName}} color="${selectedColor}" />`;
    await navigator.clipboard.writeText(code);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  const filteredCategories = iconCategories.map((category) => ({
    ...category,
    icons: category.icons.filter((icon) =>
      icon.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.icons.length > 0);

  return (
    <div className="cyber-card p-6">
      {/* 搜索和颜色选择 */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索图标..."
            className="w-full pl-10 pr-4 py-2 bg-cyber-dark/50 border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20"
          />
        </div>

        <div className="flex gap-2">
          {colorOptions.map((color) => (
            <motion.button
              key={color.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedColor(color.value)}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                selectedColor === color.value
                  ? `border-cyber-${color.value} bg-cyber-${color.value}/10`
                  : 'border-cyber-border hover:border-cyber-border/80'
              }`}
              style={selectedColor === color.value ? {
                borderColor: color.value === 'cyan' ? '#00f0ff' :
                             color.value === 'purple' ? '#9d00ff' :
                             color.value === 'pink' ? '#ff0080' :
                             color.value === 'yellow' ? '#f0ff00' : '#4ade80',
                backgroundColor: color.value === 'cyan' ? 'rgba(0, 240, 255, 0.1)' :
                                 color.value === 'purple' ? 'rgba(157, 0, 255, 0.1)' :
                                 color.value === 'pink' ? 'rgba(255, 0, 128, 0.1)' :
                                 color.value === 'yellow' ? 'rgba(240, 255, 0, 0.1)' : 'rgba(74, 222, 128, 0.1)',
              } : {}}
            >
              {color.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 图标列表 */}
      <div className="space-y-8">
        {filteredCategories.map((category, categoryIndex) => (
          <div key={category.name}>
            <h3 className="text-lg font-semibold text-white mb-4">{category.name}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {category.icons.map((iconName, iconIndex) => {
                const IconComponent = (LucideIcons as any)[iconName];
                if (!IconComponent) return null;

                return (
                  <motion.div
                    key={iconName}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (categoryIndex * category.icons.length + iconIndex) * 0.02 }}
                    className="group"
                  >
                    <div className="cyber-card p-4 hover:border-cyber-cyan/50 transition-all cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <CyberIcon
                          icon={IconComponent}
                          color={selectedColor}
                          size={32}
                          glow
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span className="text-xs text-gray-400 font-mono">{iconName}</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopy(iconName)}
                          className="p-2 bg-cyber-dark/50 rounded-lg hover:bg-cyber-cyan/10 transition-colors"
                        >
                          {copiedIcon === iconName ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400 group-hover:text-cyber-cyan" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 使用说明 */}
      <div className="mt-8 p-4 bg-cyber-dark/30 rounded-lg">
        <h4 className="text-sm font-semibold text-cyber-cyan mb-2">使用说明</h4>
        <pre className="text-xs text-gray-400 overflow-x-auto">
{`import { CyberIcon } from '@/components/icons';
import { Star } from 'lucide-react';

// 基础使用
<CyberIcon icon={Star} color="cyan" size={24} />

// 带发光效果
<CyberIcon icon={Star} color="purple" glow glowIntensity="high" />

// 带动画
<CyberIcon icon={Star} color="pink" spin pulse />
`}
        </pre>
      </div>
    </div>
  );
}

export default IconGallery;
