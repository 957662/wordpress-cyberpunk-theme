/**
 * SVG Tech Icons - 技术类 SVG 图标集合
 * 可以直接内联使用或作为组件导入
 */

export const Icons = {
  // 服务器图标
  server: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="#00f0ff" stroke-width="2"/>
    <line x1="8" y1="7" x2="16" y2="7" stroke="#00f0ff" stroke-width="2"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke="#00f0ff" stroke-width="2"/>
    <line x1="8" y1="17" x2="16" y2="17" stroke="#00f0ff" stroke-width="2"/>
    <circle cx="6" cy="7" r="1" fill="#00f0ff"/>
    <circle cx="6" cy="12" r="1" fill="#9d00ff"/>
    <circle cx="6" cy="17" r="1" fill="#ff0080"/>
  </svg>`,

  // 云端图标
  cloud: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 15C4 17.7614 6.23858 20 9 20H15C17.7614 20 20 17.7614 20 15C20 12.2386 17.7614 10 15 10C14.8256 10 14.6548 10.0138 14.4883 10.0405C14.1044 7.18376 11.6775 5 8.75 5C5.57436 5 3 7.57436 3 10.75C3 10.8337 3.00195 10.9169 3.00582 10.9996C3.00196 11.1663 4 11.3333 4 11.5V15Z" fill="url(#cloudGradient)" stroke="#00f0ff" stroke-width="2"/>
    <defs>
      <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#9d00ff" stop-opacity="0.1"/>
      </linearGradient>
    </defs>
  </svg>`,

  // 数据库图标
  database: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="5" rx="8" ry="3" stroke="#9d00ff" stroke-width="2"/>
    <path d="M4 5V19C4 21 20 21 20 19V5" stroke="#9d00ff" stroke-width="2"/>
    <path d="M4 12C4 14 20 14 20 12" stroke="#9d00ff" stroke-width="2"/>
  </svg>`,

  // API 图标
  api: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00f0ff" stroke-width="2" stroke-linejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="#9d00ff" stroke-width="2" stroke-linejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="#ff0080" stroke-width="2" stroke-linejoin="round"/>
  </svg>`,

  // 代码图标
  code: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 18L22 12L16 6" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 6L2 12L8 18" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="14" y1="4" x2="10" y2="20" stroke="#9d00ff" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  // 终端图标
  terminal: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#00ff88" stroke-width="2"/>
    <path d="M6 8L10 12L6 16" stroke="#00ff88" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="12" y1="16" x2="18" y2="16" stroke="#00ff88" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  // 齿轮图标
  settings: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke="#00f0ff" stroke-width="2"/>
    <path d="M12 2V4M12 20V22M2 12H4M20 12H22M4.92999 4.92999L6.34399 6.34399M17.656 17.656L19.07 19.07M4.92999 19.07L6.34399 17.656M17.656 6.34399L19.07 4.92999" stroke="#00f0ff" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  // 锁图标
  lock: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="11" width="12" height="10" rx="2" stroke="#ff0080" stroke-width="2"/>
    <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="#ff0080" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="16" r="1" fill="#ff0080"/>
  </svg>`,

  // 盾牌图标
  shield: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7V12C3 17 7 21 12 22C17 21 21 17 21 12V7L12 2Z" stroke="#00ff88" stroke-width="2" stroke-linejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="#00ff88" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  // 时钟图标
  clock: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#f0ff00" stroke-width="2"/>
    <path d="M12 6V12L16 14" stroke="#f0ff00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  // 日历图标
  calendar: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#00f0ff" stroke-width="2"/>
    <path d="M16 2V6M8 2V6" stroke="#00f0ff" stroke-width="2" stroke-linecap="round"/>
    <path d="M3 10H21" stroke="#00f0ff" stroke-width="2"/>
  </svg>`,

  // 用户图标
  user: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="7" r="4" stroke="#9d00ff" stroke-width="2"/>
    <path d="M20 21C20 17 16 15 12 15C8 15 4 17 4 21" stroke="#9d00ff" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  // 邮件图标
  mail: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#00f0ff" stroke-width="2"/>
    <path d="M2 6L12 14L22 6" stroke="#00f0ff" stroke-width="2"/>
  </svg>`,

  // 搜索图标
  search: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="#00f0ff" stroke-width="2"/>
    <path d="M21 21L16.65 16.65" stroke="#00f0ff" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  // 心形图标
  heart: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04096 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12084 20.84 4.61V4.61Z" stroke="#ff0080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  // 星星图标
  star: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#f0ff00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  // 书签图标
  bookmark: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 21L12 17L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="#9d00ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  // 文件夹图标
  folder: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 5H20C20.5304 5 21.0391 5.21071 21.4142 5.58579C21.7893 5.96086 22 6.46957 22 7V19Z" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

/**
 * 获取 SVG 图标
 * @param iconKey 图标键名
 * @param className 可选的 CSS 类名
 * @returns SVG 字符串
 */
export function getIcon(iconKey: keyof typeof Icons, className = ''): string {
  const svg = Icons[iconKey];
  if (!svg) {
    console.warn(`Icon "${iconKey}" not found`);
    return '';
  }

  // 如果有 className，将其添加到 svg 标签中
  if (className) {
    return svg.replace('<svg', `<svg class="${className}"`);
  }

  return svg;
}

/**
 * 渲染 SVG 图标为 React 组件
 * @param iconKey 图标键名
 * @param props 可选的 props
 * @returns React 组件
 */
export function renderIcon(iconKey: keyof typeof Icons, props: React.SVGProps<SVGSVGElement> = {}) {
  const svgString = Icons[iconKey];
  if (!svgString) {
    return null;
  }

  // 将 SVG 字符串转换为 React 组件
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = doc.documentElement;

  // 提取属性
  const svgProps: React.SVGProps<SVGSVGElement> = {
    dangerouslySetInnerHTML: { __html: svgElement.innerHTML },
    ...props,
  };

  // 获取原始属性
  ['viewBox', 'fill', 'xmlns'].forEach(attr => {
    const value = svgElement.getAttribute(attr);
    if (value) {
      (svgProps as any)[attr] = value;
    }
  });

  return <svg {...svgProps} />;
}

export default Icons;
