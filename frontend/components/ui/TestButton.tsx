import React from 'react';

interface TestButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const TestButton: React.FC<TestButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
}) => {
  const baseStyles = 'relative font-bold uppercase tracking-wider border-2 transition-all duration-200';

  const variantStyles = {
    primary: 'bg-black text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]',
    secondary: 'bg-black text-pink-500 border-pink-500 hover:bg-pink-500 hover:text-black hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]',
    danger: 'bg-black text-red-500 border-red-500 hover:bg-red-500 hover:text-black hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles}`}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity duration-200" />
    </button>
  );
};

export default TestButton;
