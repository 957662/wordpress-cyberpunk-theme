/**
 * 协作服务
 * 处理实时协作功能，包括操作转换、状态同步等
 */

export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: { x: number; y: number };
  selection?: { start: number; end: number };
  isOnline: boolean;
  lastSeen: Date;
}

export interface TextOperation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  content?: string;
  length?: number;
  attributes?: Record<string, any>;
}

export interface CollaborationOperation {
  id: string;
  documentId: string;
  userId: string;
  operation: TextOperation[];
  version: number;
  timestamp: number;
}

export interface DocumentState {
  id: string;
  content: string;
  version: number;
  lastModified: Date;
  collaborators: Collaborator[];
}

class CollaborationService {
  private documents: Map<string, DocumentState> = new Map();
  private operations: Map<string, CollaborationOperation[]> = new Map();
  private listeners: Map<string, Set<(state: DocumentState) => void>> = new Map();

  /**
   * 创建或获取文档
   */
  getOrCreateDocument(documentId: string, initialContent = ''): DocumentState {
    let document = this.documents.get(documentId);

    if (!document) {
      document = {
        id: documentId,
        content: initialContent,
        version: 0,
        lastModified: new Date(),
        collaborators: [],
      };
      this.documents.set(documentId, document);
      this.operations.set(documentId, []);
    }

    return document;
  }

  /**
   * 应用操作到文档
   */
  applyOperation(documentId: string, operation: CollaborationOperation): DocumentState {
    const document = this.getOrCreateDocument(documentId);

    // 验证版本
    if (operation.version !== document.version) {
      throw new Error(`Version mismatch: expected ${document.version}, got ${operation.version}`);
    }

    // 应用操作
    let newContent = document.content;
    let position = 0;

    for (const op of operation.operation) {
      switch (op.type) {
        case 'retain':
          position += op.length || 0;
          break;

        case 'insert':
          if (op.content !== undefined) {
            newContent =
              newContent.slice(0, position) + op.content + newContent.slice(position);
            position += op.content.length;
          }
          break;

        case 'delete':
          if (op.length !== undefined) {
            newContent = newContent.slice(0, position) + newContent.slice(position + op.length);
          }
          break;
      }
    }

    // 更新文档
    const updatedDocument: DocumentState = {
      ...document,
      content: newContent,
      version: document.version + 1,
      lastModified: new Date(),
    };

    this.documents.set(documentId, updatedDocument);

    // 保存操作历史
    const history = this.operations.get(documentId) || [];
    history.push(operation);
    this.operations.set(documentId, history);

    // 通知监听器
    this.notifyListeners(documentId, updatedDocument);

    return updatedDocument;
  }

  /**
   * 转换操作（操作转换算法）
   * 用于解决并发编辑冲突
   */
  transformOperations(
    operation1: TextOperation[],
    operation2: TextOperation[]
  ): TextOperation[] {
    // 简化的操作转换实现
    // 实际应用中需要使用更复杂的算法，如 OT (Operational Transformation) 或 CRDT

    const transformed: TextOperation[] = [];
    let index1 = 0;
    let index2 = 0;
    let offset = 0;

    while (index1 < operation1.length || index2 < operation2.length) {
      const op1 = operation1[index1];
      const op2 = operation2[index2];

      if (!op1) {
        index2++;
        continue;
      }
      if (!op2) {
        transformed.push({ ...op1, position: op1.position + offset });
        index1++;
        continue;
      }

      // 处理操作冲突
      if (op1.position <= op2.position) {
        if (op1.type === 'insert') {
          transformed.push({ ...op1, position: op1.position + offset });
          offset += op1.content?.length || 0;
        } else if (op1.type === 'delete') {
          if (op1.position + (op1.length || 0) <= op2.position) {
            transformed.push({ ...op1, position: op1.position + offset });
          } else {
            // 部分重叠，需要特殊处理
            const length = op2.position - op1.position;
            if (length > 0) {
              transformed.push({
                type: 'delete',
                position: op1.position + offset,
                length,
              });
            }
          }
        } else {
          transformed.push({ ...op1, position: op1.position + offset });
        }
        index1++;
      } else {
        index2++;
      }
    }

    return transformed;
  }

  /**
   * 添加协作者
   */
  addCollaborator(documentId: string, collaborator: Collaborator): void {
    const document = this.getOrCreateDocument(documentId);
    const existingIndex = document.collaborators.findIndex((c) => c.id === collaborator.id);

    let updatedCollaborators: Collaborator[];
    if (existingIndex >= 0) {
      updatedCollaborators = document.collaborators.map((c, i) =>
        i === existingIndex ? { ...collaborator, isOnline: true } : c
      );
    } else {
      updatedCollaborators = [...document.collaborators, { ...collaborator, isOnline: true }];
    }

    const updatedDocument: DocumentState = {
      ...document,
      collaborators: updatedCollaborators,
    };

    this.documents.set(documentId, updatedDocument);
    this.notifyListeners(documentId, updatedDocument);
  }

  /**
   * 移除协作者
   */
  removeCollaborator(documentId: string, userId: string): void {
    const document = this.getOrCreateDocument(documentId);
    const updatedCollaborators = document.collaborators.filter((c) => c.id !== userId);

    const updatedDocument: DocumentState = {
      ...document,
      collaborators: updatedCollaborators,
    };

    this.documents.set(documentId, updatedDocument);
    this.notifyListeners(documentId, updatedDocument);
  }

  /**
   * 更新协作者状态
   */
  updateCollaborator(
    documentId: string,
    userId: string,
    updates: Partial<Collaborator>
  ): void {
    const document = this.getOrCreateDocument(documentId);
    const updatedCollaborators = document.collaborators.map((c) =>
      c.id === userId ? { ...c, ...updates, lastSeen: new Date() } : c
    );

    const updatedDocument: DocumentState = {
      ...document,
      collaborators: updatedCollaborators,
    };

    this.documents.set(documentId, updatedDocument);
    this.notifyListeners(documentId, updatedDocument);
  }

  /**
   * 订阅文档更新
   */
  subscribe(documentId: string, callback: (state: DocumentState) => void): () => void {
    if (!this.listeners.has(documentId)) {
      this.listeners.set(documentId, new Set());
    }

    this.listeners.get(documentId)!.add(callback);

    // 返回取消订阅函数
    return () => {
      const listeners = this.listeners.get(documentId);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * 通知监听器
   */
  private notifyListeners(documentId: string, state: DocumentState): void {
    const listeners = this.listeners.get(documentId);
    if (listeners) {
      listeners.forEach((callback) => callback(state));
    }
  }

  /**
   * 获取操作历史
   */
  getOperationHistory(documentId: string): CollaborationOperation[] {
    return this.operations.get(documentId) || [];
  }

  /**
   * 清除操作历史
   */
  clearHistory(documentId: string): void {
    this.operations.set(documentId, []);
  }

  /**
   * 销毁文档
   */
  destroyDocument(documentId: string): void {
    this.documents.delete(documentId);
    this.operations.delete(documentId);
    this.listeners.delete(documentId);
  }

  /**
   * 计算文档差异
   */
  computeDiff(oldContent: string, newContent: string): TextOperation[] {
    const operations: TextOperation[] = [];
    let i = 0;
    let j = 0;

    while (i < oldContent.length || j < newContent.length) {
      if (i < oldContent.length && j < newContent.length && oldContent[i] === newContent[j]) {
        i++;
        j++;
        // 添加 retain 操作
        const lastOp = operations[operations.length - 1];
        if (lastOp && lastOp.type === 'retain') {
          lastOp.length = (lastOp.length || 0) + 1;
        } else {
          operations.push({ type: 'retain', position: i, length: 1 });
        }
      } else {
        // 找到不同的部分
        const oldEnd = this.findEnd(oldContent, i, newContent, j);
        const newEnd = this.findEnd(newContent, j, oldContent, i);

        if (i < oldEnd && j < newEnd) {
          // 删除和插入
          operations.push({ type: 'delete', position: i, length: oldEnd - i });
          operations.push({ type: 'insert', position: i, content: newContent.slice(j, newEnd) });
          i = oldEnd;
          j = newEnd;
        } else if (i < oldEnd) {
          // 仅删除
          operations.push({ type: 'delete', position: i, length: oldEnd - i });
          i = oldEnd;
        } else if (j < newEnd) {
          // 仅插入
          operations.push({ type: 'insert', position: i, content: newContent.slice(j, newEnd) });
          j = newEnd;
        }
      }
    }

    return operations;
  }

  private findEnd(
    str1: string,
    start1: number,
    str2: string,
    start2: number
  ): number {
    let end1 = start1;
    let end2 = start2;

    while (
      end1 < str1.length &&
      end2 < str2.length &&
      str1[end1] !== str2[end2] &&
      (end1 - start1 < 100 || end2 - start2 < 100)
    ) {
      end1++;
      end2++;
    }

    return end1;
  }

  /**
   * 压缩操作历史
   */
  compressOperations(documentId: string): void {
    const history = this.getOperationHistory(documentId);
    if (history.length < 2) return;

    const compressed: CollaborationOperation[] = [history[0]];

    for (let i = 1; i < history.length; i++) {
      const lastOp = compressed[compressed.length - 1];
      const currentOp = history[i];

      // 合并来自同一用户的连续操作
      if (
        lastOp.userId === currentOp.userId &&
        currentOp.timestamp - lastOp.timestamp < 1000
      ) {
        // 合并操作
        lastOp.operation = [...lastOp.operation, ...currentOp.operation];
        lastOp.version = currentOp.version;
      } else {
        compressed.push(currentOp);
      }
    }

    this.operations.set(documentId, compressed);
  }
}

// 创建单例实例
const collaborationService = new CollaborationService();

export default collaborationService;
