/**
 * CyberUtils Tests
 * 赛博朋克工具函数测试
 */

import { describe, it, expect } from 'vitest';
import {
  generateCyberGradient,
  getNeonGlow,
  generateGlitchText,
  cyberColors,
  getCyberColorClasses,
  formatCyberTime,
  generateCyberId,
  supportsCyberEffects,
  getCyberTheme,
} from '@/lib/cyber-utils';

describe('CyberUtils', () => {
  describe('generateCyberGradient', () => {
    it('should generate primary gradient', () => {
      const gradient = generateCyberGradient('primary');
      expect(gradient).toContain('linear-gradient');
      expect(gradient).toContain('#0a0a0f');
    });

    it('should generate secondary gradient', () => {
      const gradient = generateCyberGradient('secondary');
      expect(gradient).toContain('linear-gradient');
      expect(gradient).toContain('rgba');
    });

    it('should generate accent gradient', () => {
      const gradient = generateCyberGradient('accent');
      expect(gradient).toContain('linear-gradient');
      expect(gradient).toContain('#00f0ff');
    });
  });

  describe('getNeonGlow', () => {
    it('should generate cyan glow', () => {
      const glow = getNeonGlow('cyan', 1);
      expect(glow).toContain('0, 240, 255');
      expect(glow).toContain('box-shadow');
    });

    it('should scale glow intensity', () => {
      const glow1 = getNeonGlow('cyan', 1);
      const glow2 = getNeonGlow('cyan', 2);
      expect(glow2).not.toBe(glow1);
    });
  });

  describe('generateGlitchText', () => {
    it('should replace some characters with glitch chars', () => {
      const text = 'Hello World';
      const glitched = generateGlitchText(text);
      expect(glitched.length).toBe(text.length);
    });

    it('should not always change text', () => {
      const text = 'Hello World';
      const glitched = generateGlitchText(text);
      // 由于随机性，文本可能保持不变
      expect(glitched).toBeTruthy();
    });
  });

  describe('cyberColors', () => {
    it('should have all required colors', () => {
      expect(cyberColors.cyan).toBe('#00f0ff');
      expect(cyberColors.purple).toBe('#9d00ff');
      expect(cyberColors.pink).toBe('#ff0080');
      expect(cyberColors.green).toBe('#00ff88');
      expect(cyberColors.yellow).toBe('#f0ff00');
      expect(cyberColors.dark).toBe('#0a0a0f');
      expect(cyberColors.muted).toBe('#1a1a2e');
    });
  });

  describe('getCyberColorClasses', () => {
    it('should return correct classes for cyan', () => {
      const classes = getCyberColorClasses('cyan');
      expect(classes.bg).toContain('cyber-cyan');
      expect(classes.text).toContain('text-cyber-cyan');
      expect(classes.border).toContain('border-cyber-cyan');
    });

    it('should return correct classes for all colors', () => {
      const colors: Array<keyof typeof cyberColors> = ['cyan', 'purple', 'pink', 'green', 'yellow'];
      colors.forEach(color => {
        const classes = getCyberColorClasses(color);
        expect(classes.bg).toBeTruthy();
        expect(classes.text).toBeTruthy();
        expect(classes.border).toBeTruthy();
        expect(classes.hover).toBeTruthy();
      });
    });
  });

  describe('formatCyberTime', () => {
    it('should format seconds ago', () => {
      const date = new Date(Date.now() - 30000); // 30 seconds ago
      const formatted = formatCyberTime(date);
      expect(formatted).toMatch(/\d+s ago/);
    });

    it('should format minutes ago', () => {
      const date = new Date(Date.now() - 120000); // 2 minutes ago
      const formatted = formatCyberTime(date);
      expect(formatted).toMatch(/\d+m ago/);
    });

    it('should format hours ago', () => {
      const date = new Date(Date.now() - 7200000); // 2 hours ago
      const formatted = formatCyberTime(date);
      expect(formatted).toMatch(/\d+h ago/);
    });

    it('should format days ago', () => {
      const date = new Date(Date.now() - 172800000); // 2 days ago
      const formatted = formatCyberTime(date);
      expect(formatted).toMatch(/\d+d ago/);
    });
  });

  describe('generateCyberId', () => {
    it('should generate ID in correct format', () => {
      const id = generateCyberId();
      expect(id).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    });

    it('should generate unique IDs', () => {
      const id1 = generateCyberId();
      const id2 = generateCyberId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('getCyberTheme', () => {
    it('should return complete theme configuration', () => {
      const theme = getCyberTheme();
      expect(theme).toHaveProperty('colors');
      expect(theme).toHaveProperty('fonts');
      expect(theme).toHaveProperty('animations');
      expect(theme).toHaveProperty('effects');
    });

    it('should have correct font families', () => {
      const theme = getCyberTheme();
      expect(theme.fonts.mono).toContain('monospace');
      expect(theme.fonts.display).toContain('sans-serif');
      expect(theme.fonts.body).toContain('sans-serif');
    });
  });
});
