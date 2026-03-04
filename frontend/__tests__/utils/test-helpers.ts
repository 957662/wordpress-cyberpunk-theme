/**
 * 测试辅助函数
 */

import { RenderResult, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// 扩展 RenderResult 类型
export interface ExtendedRenderResult extends RenderResult {
  asFragment: () => DocumentFragment;
  rerender: (ui: React.ReactNode) => void;
}

// 等待异步操作完成
export async function waitForAsyncOperation() {
  await new Promise(resolve => setTimeout(resolve, 0));
}

// 等待指定时间
export async function wait(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

// 模拟点击事件
export async function clickElement(
  element: HTMLElement,
  options?: { delay?: number }
) {
  const user = userEvent.setup({ delay: options?.delay || 0 });
  await user.click(element);
}

// 模拟输入事件
export async function typeInElement(
  element: HTMLInputElement | HTMLTextAreaElement,
  text: string,
  options?: { delay?: number }
) {
  const user = userEvent.setup({ delay: options?.delay || 0 });
  await user.type(element, text);
}

// 模拟悬停事件
export async function hoverElement(
  element: HTMLElement,
  options?: { delay?: number }
) {
  const user = userEvent.setup({ delay: options?.delay || 0 });
  await user.hover(element);
}

// 模拟取消悬停事件
export async function unhoverElement(
  element: HTMLElement,
  options?: { delay?: number }
) {
  const user = userEvent.setup({ delay: options?.delay || 0 });
  await user.unhover(element);
}

// 检查元素是否存在
export function checkElementExists(container: HTMLElement, testId: string): boolean {
  return !!container.querySelector(`[data-testid="${testId}"]`);
}

// 获取元素文本内容
export function getElementText(container: HTMLElement, testId: string): string {
  const element = container.querySelector(`[data-testid="${testId}"]`);
  return element?.textContent || '';
}

// 检查元素是否可见
export function isElementVisible(element: HTMLElement): boolean {
  return !!element && element.offsetParent !== null;
}

// 检查元素是否被禁用
export function isElementDisabled(element: HTMLElement): boolean {
  if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement) {
    return element.disabled;
  }
  return element.getAttribute('aria-disabled') === 'true';
}

// 获取元素属性值
export function getElementAttribute(
  element: HTMLElement,
  attribute: string
): string | null {
  return element.getAttribute(attribute);
}

// 检查元素是否有类名
export function elementHasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

// 模拟文件选择
export async function selectFile(
  input: HTMLInputElement,
  file: File
) {
  const user = userEvent.setup();
  await user.upload(input, file);
}

// 模拟拖放
export async function dragAndDrop(
  source: HTMLElement,
  target: HTMLElement
) {
  source.dispatchEvent(new MouseEvent('dragstart', { bubbles: true }));
  target.dispatchEvent(new MouseEvent('dragover', { bubbles: true }));
  target.dispatchEvent(new MouseEvent('drop', { bubbles: true }));
  source.dispatchEvent(new MouseEvent('dragend', { bubbles: true }));
}

// 模拟键盘事件
export async function pressKey(
  element: HTMLElement,
  key: string,
  options?: { ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean }
) {
  const user = userEvent.setup();
  await user.type(element, key, {
    ...options,
  });
}

// 模拟 Tab 键导航
export async function pressTab() {
  const user = userEvent.setup();
  await user.tab();
}

// 模拟 Enter 键
export async function pressEnter(element: HTMLElement) {
  await pressKey(element, '{Enter}');
}

// 模拟 Escape 键
export async function pressEscape(element: HTMLElement) {
  await pressKey(element, '{Escape}');
}

// 检查表单验证状态
export function getValidationMessage(element: HTMLElement): string | null {
  return element.getAttribute('data-validation-message') ||
         element.getAttribute('aria-invalid') ||
         null;
}

// 模拟表单提交
export async function submitForm(form: HTMLFormElement) {
  const user = userEvent.setup();
  await user.click(
    form.querySelector('button[type="submit"]') ||
    form.querySelector('input[type="submit"]') ||
    form
  );
}

// 清除输入框内容
export async function clearInput(
  element: HTMLInputElement | HTMLTextAreaElement
) {
  const user = userEvent.setup();
  await user.clear(element);
}

// 选择下拉选项
export async function selectOption(
  selectElement: HTMLSelectElement,
  optionValue: string
) {
  const user = userEvent.setup();
  await user.selectOptions(selectElement, optionValue);
}

// 选中复选框
export async function checkCheckbox(
  checkbox: HTMLInputElement
) {
  const user = userEvent.setup();
  await user.click(checkbox);
}

// 取消选中复选框
export async function uncheckCheckbox(
  checkbox: HTMLInputElement
) {
  const user = userEvent.setup();
  await user.click(checkbox);
}

// 选中单选按钮
export async function clickRadio(
  radio: HTMLInputElement
) {
  const user = userEvent.setup();
  await user.click(radio);
}

// 滚动到元素
export function scrollToElement(element: HTMLElement) {
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 滚动到页面顶部
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 滚动到页面底部
export function scrollToBottom() {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  });
}

// 模拟窗口大小变化
export function resizeWindow(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
}

// 模拟剪贴板操作
export async function copyToClipboard(text: string) {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn(() => Promise.resolve()),
    },
  });
  await navigator.clipboard.writeText(text);
}

// 模拟地理位置
export function mockGeolocation(coordinates: {
  latitude: number;
  longitude: number;
}) {
  const mockGeolocation = {
    getCurrentPosition: jest.fn((success) =>
      Promise.resolve(
        success({
          coords: coordinates,
          timestamp: Date.now(),
        })
      )
    ),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  };

  Object.defineProperty(navigator, 'geolocation', {
    value: mockGeolocation,
  });
}

// 模拟网络状态
export function mockNetworkStatus(online: boolean) {
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: online,
  });
  window.dispatchEvent(new Event(online ? 'online' : 'offline'));
}

// 模拟设备方向
export function mockDeviceOrientation(alpha: number, beta: number, gamma: number) {
  window.dispatchEvent(
    new DeviceOrientationEvent('deviceorientation', {
      alpha,
      beta,
      gamma,
    })
  );
}

// 模拟设备运动
export function mockDeviceMotion(
  acceleration: { x: number; y: number; z: number }
) {
  window.dispatchEvent(
    new DeviceMotionEvent('devicemotion', {
      acceleration,
    })
  );
}

// 导出所有辅助函数
export const helpers = {
  waitForAsyncOperation,
  wait,
  clickElement,
  typeInElement,
  hoverElement,
  unhoverElement,
  checkElementExists,
  getElementText,
  isElementVisible,
  isElementDisabled,
  getElementAttribute,
  elementHasClass,
  selectFile,
  dragAndDrop,
  pressKey,
  pressTab,
  pressEnter,
  pressEscape,
  getValidationMessage,
  submitForm,
  clearInput,
  selectOption,
  checkCheckbox,
  uncheckCheckbox,
  clickRadio,
  scrollToElement,
  scrollToTop,
  scrollToBottom,
  resizeWindow,
  copyToClipboard,
  mockGeolocation,
  mockNetworkStatus,
  mockDeviceOrientation,
  mockDeviceMotion,
};
