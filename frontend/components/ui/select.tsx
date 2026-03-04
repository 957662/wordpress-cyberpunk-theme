import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export interface SelectOptionProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Select({
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  error,
  label,
  children,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const selectedChild = React.Children.toArray(children).find(
    (child: any) => child.props.value === value
  );

  const selectedLabel = selectedChild
    ? (selectedChild as any).props.children
    : placeholder;

  const handleSelect = (newValue: string) => {
    onChange?.(newValue);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
      >
        <span className={cn(!value && 'text-gray-500')}>
          {selectedLabel}
        </span>
        <svg
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as any, {
                onSelect: handleSelect,
                isSelected: (child as any).props.value === value,
              });
            }
            return child;
          })}
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export function SelectOption({
  value,
  children,
  disabled = false,
  onSelect,
  isSelected,
}: SelectOptionProps & {
  onSelect?: (value: string) => void;
  isSelected?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect?.(value)}
      disabled={disabled}
      className={cn(
        'w-full px-3 py-2 text-left text-sm transition-colors',
        isSelected
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {children}
    </button>
  );
}
