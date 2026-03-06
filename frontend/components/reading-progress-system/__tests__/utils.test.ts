/**
 * Reading Progress System - Utils Tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateReadingTime,
  calculateScrollProgress,
  formatDuration,
  formatWordCount,
  calculateReadingSpeed,
  getReadingSpeedRating,
  generateMilestones,
  hasReachedMilestone,
  calculateCompletion,
  getThemeColors,
} from '../utils';

describe('calculateReadingTime', () => {
  it('should calculate reading time correctly', () => {
    const content = 'This is a test content with some words.';
    const result = calculateReadingTime(content, 200);

    expect(result.wordCount).toBe(9);
    expect(result.minutes).toBeGreaterThanOrEqual(0);
    expect(result.seconds).toBeGreaterThanOrEqual(0);
    expect(result.formatted).toBeTruthy();
  });

  it('should handle empty content', () => {
    const result = calculateReadingTime('', 200);

    expect(result.wordCount).toBe(0);
    expect(result.minutes).toBe(0);
  });

  it('should format time correctly', () => {
    const result = calculateReadingTime('word '.repeat(200), 200);

    expect(result.formatted).toMatch(/\d+m/);
  });
});

describe('calculateScrollProgress', () => {
  it('should calculate progress correctly', () => {
    const progress = calculateScrollProgress(500, 1000, 200);

    expect(progress).toBe(62.5); // (500 / (1000 - 200)) * 100
  });

  it('should return 100% when scrolled to bottom', () => {
    const progress = calculateScrollProgress(800, 1000, 200);

    expect(progress).toBe(100);
  });

  it('should return 0% when at top', () => {
    const progress = calculateScrollProgress(0, 1000, 200);

    expect(progress).toBe(0);
  });

  it('should handle zero scroll height', () => {
    const progress = calculateScrollProgress(0, 0, 100);

    expect(progress).toBe(100);
  });
});

describe('formatDuration', () => {
  it('should format seconds correctly', () => {
    expect(formatDuration(45)).toBe('45s');
  });

  it('should format minutes correctly', () => {
    expect(formatDuration(90)).toBe('1m 30s');
    expect(formatDuration(120)).toBe('2m');
  });

  it('should format hours correctly', () => {
    expect(formatDuration(3600)).toBe('1h');
    expect(formatDuration(3900)).toBe('1h 30m');
  });
});

describe('formatWordCount', () => {
  it('should format word count with locale', () => {
    expect(formatWordCount(1000)).toBe('1,000');
    expect(formatWordCount(1000000)).toBe('1,000,000');
  });

  it('should handle zero', () => {
    expect(formatWordCount(0)).toBe('0');
  });
});

describe('calculateReadingSpeed', () => {
  it('should calculate WPM correctly', () => {
    const wpm = calculateReadingSpeed(400, 120); // 400 words in 2 minutes

    expect(wpm).toBe(200);
  });

  it('should return 0 for zero time', () => {
    const wpm = calculateReadingSpeed(100, 0);

    expect(wpm).toBe(0);
  });
});

describe('getReadingSpeedRating', () => {
  it('should return slow rating for slow reading', () => {
    const rating = getReadingSpeedRating(100);

    expect(rating.level).toBe('slow');
    expect(rating.label).toBe('轻松阅读');
  });

  it('should return normal rating for normal reading', () => {
    const rating = getReadingSpeedRating(200);

    expect(rating.level).toBe('normal');
    expect(rating.label).toBe('正常速度');
  });

  it('should return fast rating for fast reading', () => {
    const rating = getReadingSpeedRating(300);

    expect(rating.level).toBe('fast');
    expect(rating.label).toBe('快速阅读');
  });

  it('should return very-fast rating for very fast reading', () => {
    const rating = getReadingSpeedRating(400);

    expect(rating.level).toBe('very-fast');
    expect(rating.label).toBe('极速阅读');
  });
});

describe('generateMilestones', () => {
  it('should generate milestones for long content', () => {
    const milestones = generateMilestones(1500);

    expect(milestones).toEqual([10, 25, 50, 75, 90, 100]);
  });

  it('should generate milestones for medium content', () => {
    const milestones = generateMilestones(800);

    expect(milestones).toEqual([25, 50, 75, 100]);
  });

  it('should generate milestones for short content', () => {
    const milestones = generateMilestones(300);

    expect(milestones).toEqual([50, 100]);
  });
});

describe('hasReachedMilestone', () => {
  it('should return true when milestone is reached', () => {
    expect(hasReachedMilestone(50, 50)).toBe(true);
    expect(hasReachedMilestone(51, 50)).toBe(true);
    expect(hasReachedMilestone(49, 50)).toBe(true);
  });

  it('should return false when milestone is not reached', () => {
    expect(hasReachedMilestone(40, 50)).toBe(false);
    expect(hasReachedMilestone(60, 50)).toBe(false);
  });

  it('should respect threshold', () => {
    expect(hasReachedMilestone(52, 50, 5)).toBe(true);
    expect(hasReachedMilestone(58, 50, 5)).toBe(false);
  });
});

describe('calculateCompletion', () => {
  it('should calculate completion percentage', () => {
    const completion = calculateCompletion(80, 4, 5); // 80% scroll, 4/5 min time

    expect(completion).toBeGreaterThan(0);
    expect(completion).toBeLessThanOrEqual(100);
  });

  it('should weight scroll more heavily', () => {
    const completion1 = calculateCompletion(100, 0, 5);
    const completion2 = calculateCompletion(0, 5, 5);

    expect(completion1).toBeGreaterThan(completion2);
  });
});

describe('getThemeColors', () => {
  it('should return cyan theme colors', () => {
    const colors = getThemeColors('cyan');

    expect(colors.primary).toBe('#00f0ff');
    expect(colors.glow).toBe('rgba(0, 240, 255, 0.5)');
  });

  it('should return purple theme colors', () => {
    const colors = getThemeColors('purple');

    expect(colors.primary).toBe('#9d00ff');
    expect(colors.glow).toBe('rgba(157, 0, 255, 0.5)');
  });

  it('should return pink theme colors', () => {
    const colors = getThemeColors('pink');

    expect(colors.primary).toBe('#ff0080');
    expect(colors.glow).toBe('rgba(255, 0, 128, 0.5)');
  });

  it('should return green theme colors', () => {
    const colors = getThemeColors('green');

    expect(colors.primary).toBe('#00ff88');
    expect(colors.glow).toBe('rgba(0, 255, 136, <tool_call><arg_key>limit</arg_key><arg_value>50