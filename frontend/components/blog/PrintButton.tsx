'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  className?: string;
  variant?: 'icon' | 'text' | 'both';
  onClick?: () => void;
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  className = '',
  variant = 'icon',
  onClick,
}) => {
  const handlePrint = () => {
    window.print();
    onClick?.();
  };

  const renderContent = () => {
    switch (variant) {
      case 'icon':
        return <Printer size={18} />;
      case 'text':
        return <span className="text-sm font-medium">打印</span>;
      case 'both':
        return (
          <>
            <Printer size={18} />
            <span className="text-sm font-medium ml-2">打印文章</span>
          </>
        );
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handlePrint}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 text-gray-300 hover:text-white transition-all ${className}`}
      title="打印此页面"
    >
      {renderContent()}
    </motion.button>
  );
};

export default PrintButton;
