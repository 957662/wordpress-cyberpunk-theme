'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value?: Date;
  onChange?: (time: Date) => void;
  className?: string;
  format?: '12h' | '24h';
  minuteStep?: number;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value = new Date(),
  onChange,
  className,
  format = '24h',
  minuteStep = 1,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(value.getHours());
  const [minutes, setMinutes] = useState(value.getMinutes());
  const [ampm, setAmPm] = useState<'AM' | 'PM'>(hours >= 12 ? 'PM' : 'AM');

  const handleHoursChange = (delta: number) => {
    let newHours = hours + delta;
    if (format === '12h') {
      if (newHours > 12) newHours = 1;
      if (newHours < 1) newHours = 12;
    } else {
      if (newHours > 23) newHours = 0;
      if (newHours < 0) newHours = 23;
    }
    setHours(newHours);
    updateTime(newHours, minutes);
  };

  const handleMinutesChange = (delta: number) => {
    let newMinutes = minutes + delta * minuteStep;
    if (newMinutes > 59) newMinutes = 0;
    if (newMinutes < 0) newMinutes = 60 - minuteStep;
    setMinutes(newMinutes);
    updateTime(hours, newMinutes);
  };

  const handleAmPmToggle = () => {
    const newAmPm = ampm === 'AM' ? 'PM' : 'AM';
    setAmPm(newAmPm);
    const newHours = hours === 12 ? 0 : hours + (newAmPm === 'PM' ? 12 : -12);
    updateTime(newHours, minutes);
  };

  const updateTime = (h: number, m: number) => {
    const newDate = new Date(value);
    let finalHours = h;

    if (format === '12h') {
      if (ampm === 'PM' && h !== 12) finalHours = h + 12;
      if (ampm === 'AM' && h === 12) finalHours = 0;
    }

    newDate.setHours(finalHours, m, 0, 0);
    onChange?.(newDate);
  };

  const formatHours = () => {
    if (format === '12h') {
      return hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    }
    return hours;
  };

  const formatMinutes = () => {
    return minutes.toString().padStart(2, '0');
  };

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
          'bg-dark-800 border-dark-700 hover:border-cyber-cyan/50',
          isOpen && 'border-cyber-cyan'
        )}
      >
        <Clock className="w-4 h-4 text-cyber-cyan" />
        <span className="text-white">
          {formatHours()}:{formatMinutes()}
          {format === '12h' && <span className="ml-1">{ampm}</span>}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 p-4 rounded-lg bg-dark-800 border border-dark-700 shadow-xl"
          >
            <div className="flex items-center gap-4">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleHoursChange(1)}
                  className="p-1 rounded hover:bg-dark-700 transition-colors"
                >
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                </button>
                <span className="text-2xl font-bold text-white w-12 text-center">
                  {formatHours()}
                </span>
                <button
                  onClick={() => handleHoursChange(-1)}
                  className="p-1 rounded hover:bg-dark-700 transition-colors"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <span className="text-2xl font-bold text-gray-600">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleMinutesChange(1)}
                  className="p-1 rounded hover:bg-dark-700 transition-colors"
                >
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                </button>
                <span className="text-2xl font-bold text-white w-12 text-center">
                  {formatMinutes()}
                </span>
                <button
                  onClick={() => handleMinutesChange(-1)}
                  className="p-1 rounded hover:bg-dark-700 transition-colors"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* AM/PM */}
              {format === '12h' && (
                <div className="flex flex-col items-center gap-1 ml-2">
                  <button
                    onClick={() => setAmPm('AM')}
                    className={cn(
                      'px-3 py-1 rounded text-sm transition-colors',
                      ampm === 'AM'
                        ? 'bg-cyber-cyan text-dark-900'
                        : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                    )}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => setAmPm('PM')}
                    className={cn(
                      'px-3 py-1 rounded text-sm transition-colors',
                      ampm === 'PM'
                        ? 'bg-cyber-cyan text-dark-900'
                        : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                    )}
                  >
                    PM
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onChange?: (start: Date, end: Date) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  className,
}) => {
  const [start, setStart] = useState<Date>(
    startDate || new Date()
  );
  const [end, setEnd] = useState<Date>(
    endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(e.target.value);
    setStart(newStart);
    onChange?.(newStart, end);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value);
    setEnd(newEnd);
    onChange?.(start, newEnd);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="flex-1">
        <label className="block text-sm text-gray-400 mb-1">开始日期</label>
        <input
          type="date"
          value={formatDate(start)}
          onChange={handleStartChange}
          className={cn(
            'w-full px-4 py-2 rounded-lg border',
            'bg-dark-800 border-dark-700 text-white',
            'focus:border-cyber-cyan focus:outline-none'
          )}
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm text-gray-400 mb-1">结束日期</label>
        <input
          type="date"
          value={formatDate(end)}
          onChange={handleEndChange}
          min={formatDate(start)}
          className={cn(
            'w-full px-4 py-2 rounded-lg border',
            'bg-dark-800 border-dark-700 text-white',
            'focus:border-cyber-cyan focus:outline-none'
          )}
        />
      </div>
    </div>
  );
};

export default TimePicker;
