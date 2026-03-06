'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export const useTableOfContents = (content: string) => {
  const [items, setItems] = useState<TOCItem[]>([]);

  useEffect(() => {
    const headings = content.match(/^#{1,3}\s+.+$/gm);

    if (!headings) {
      setItems([]);
      return;
    }

    const tocItems: TOCItem[] = headings.map((heading) => {
      const level = heading.match(/^#+/)?.[0].length || 1;
      const text = heading.replace(/^#+\s+/, '');
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      return { id, text, level };
    });

    setItems(tocItems);
  }, [content]);

  return items;
};
