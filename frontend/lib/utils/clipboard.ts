/**
 * Clipboard utilities
 */

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (error) {
        textArea.remove();
        return false;
      }
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
}

/**
 * Read text from clipboard
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      return await navigator.clipboard.readText();
    }
  } catch (error) {
    console.error('Failed to read clipboard:', error);
  }
  return null;
}

/**
 * Copy rich content (HTML) to clipboard
 */
export async function copyHTMLToClipboard(html: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.write) {
      const blob = new Blob([html], { type: 'text/html' });
      const textBlob = new Blob([html.replace(/<[^>]*>/g, '')], { type: 'text/plain' });
      const data = [new ClipboardItem({ 'text/html': blob, 'text/plain': textBlob })];
      await navigator.clipboard.write(data);
      return true;
    }
  } catch (error) {
    console.error('Failed to copy HTML:', error);
  }
  return false;
}

/**
 * Copy image to clipboard
 */
export async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.write) {
      const item = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([item]);
      return true;
    }
  } catch (error) {
    console.error('Failed to copy image:', error);
  }
  return false;
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return !!(navigator.clipboard && navigator.clipboard.writeText);
}

/**
 * Check if clipboard read permission is granted
 */
export async function hasClipboardReadPermission(): Promise<boolean> {
  try {
    if (navigator.permissions) {
      const result = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
      return result.state === 'granted';
    }
  } catch (error) {
    console.error('Failed to check clipboard permission:', error);
  }
  return false;
}

/**
 * Request clipboard read permission
 */
export async function requestClipboardReadPermission(): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      await navigator.clipboard.readText();
      return true;
    }
  } catch (error) {
    console.error('Failed to request clipboard permission:', error);
  }
  return false;
}

/**
 * Copy with fallback and retry
 */
export async function copyWithRetry(text: string, maxRetries = 3): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    const success = await copyToClipboard(text);
    if (success) return true;

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
  }

  return false;
}

/**
 * Copy multiple items to clipboard
 */
export async function copyMultiple(items: Array<{ text?: string; html?: string }>): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.write) {
      const clipboardItems: ClipboardItem[] = [];

      for (const item of items) {
        const data: Record<string, Blob> = {};

        if (item.text) {
          data['text/plain'] = new Blob([item.text], { type: 'text/plain' });
        }

        if (item.html) {
          data['text/html'] = new Blob([item.html], { type: 'text/html' });
        }

        if (Object.keys(data).length > 0) {
          clipboardItems.push(new ClipboardItem(data));
        }
      }

      await navigator.clipboard.write(clipboardItems);
      return true;
    }
  } catch (error) {
    console.error('Failed to copy multiple items:', error);
  }

  return false;
}

/**
 * Clear clipboard
 */
export async function clearClipboard(): Promise<boolean> {
  try {
    await copyToClipboard('');
    return true;
  } catch (error) {
    console.error('Failed to clear clipboard:', error);
    return false;
  }
}

/**
 * Monitor clipboard changes
 */
export function watchClipboard(callback: (text: string) => void, interval = 1000): () => void {
  let lastText = '';
  let intervalId: NodeJS.Timeout;

  const checkClipboard = async () => {
    const currentText = await readFromClipboard();
    if (currentText !== null && currentText !== lastText) {
      lastText = currentText;
      callback(currentText);
    }
  };

  intervalId = setInterval(checkClipboard, interval);

  return () => clearInterval(intervalId);
}

/**
 * Copy table data to clipboard (tab-separated)
 */
export async function copyTableToClipboard(data: string[][]): Promise<boolean> {
  const text = data.map(row => row.join('\t')).join('\n');
  return await copyToClipboard(text);
}

/**
 * Copy JSON to clipboard
 */
export async function copyJSONToClipboard(data: any): Promise<boolean> {
  const text = JSON.stringify(data, null, 2);
  return await copyToClipboard(text);
}

/**
 * Paste from clipboard (with permission check)
 */
export async function pasteFromClipboard(): Promise<string | null> {
  if (!await hasClipboardReadPermission()) {
    const granted = await requestClipboardReadPermission();
    if (!granted) {
      throw new Error('Clipboard read permission not granted');
    }
  }

  return await readFromClipboard();
}
