/**
 * Batch Operation Panel Component
 *
 * Handles bulk operations on multiple items with progress tracking
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Trash2,
  Edit,
  Archive,
  Tag,
  Check,
  X,
  AlertCircle,
  Loader2,
  Download,
  Upload,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface BatchItem {
  id: string | number;
  title: string;
  status?: string;
  [key: string]: any;
}

export interface BatchOperationResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ error: string; item?: any }>;
  duration_ms: number;
}

interface BatchOperationPanelProps {
  items: BatchItem[];
  itemType: 'posts' | 'comments' | 'users' | 'media';
  onBatchDelete?: (ids: Array<string | number>) => Promise<BatchOperationResult>;
  onBatchUpdate?: (ids: Array<string | number>, data: any) => Promise<BatchOperationResult>;
  onBatchExport?: (ids: Array<string | number>) => Promise<void>;
  onBatchImport?: (file: File) => Promise<BatchOperationResult>;
  selectable?: boolean;
  maxSelection?: number;
}

type OperationType =
  | 'delete'
  | 'publish'
  | 'draft'
  | 'archive'
  | 'tag'
  | 'category'
  | 'export'
  | 'import';

interface OperationConfig {
  type: OperationType;
  label: string;
  icon: React.ReactNode;
  variant: 'default' | 'destructive' | 'outline' | 'secondary';
  confirmMessage?: string;
  requiresInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
}

const OPERATIONS: Record<string, OperationConfig> = {
  delete: {
    type: 'delete',
    label: 'Delete',
    icon: <Trash2 className="w-4 h-4" />,
    variant: 'destructive',
    confirmMessage: 'Are you sure you want to delete the selected items? This action cannot be undone.',
  },
  publish: {
    type: 'publish',
    label: 'Publish',
    icon: <Check className="w-4 h-4" />,
    variant: 'default',
    confirmMessage: 'Publish the selected items?',
  },
  draft: {
    type: 'draft',
    label: 'Set as Draft',
    icon: <Edit className="w-4 h-4" />,
    variant: 'outline',
    confirmMessage: 'Set the selected items as draft?',
  },
  archive: {
    type: 'archive',
    label: 'Archive',
    icon: <Archive className="w-4 h-4" />,
    variant: 'secondary',
    confirmMessage: 'Archive the selected items?',
  },
  tag: {
    type: 'tag',
    label: 'Add Tag',
    icon: <Tag className="w-4 h-4" />,
    variant: 'outline',
    requiresInput: true,
    inputLabel: 'Tag Name',
    inputPlaceholder: 'Enter tag name...',
  },
  export: {
    type: 'export',
    label: 'Export',
    icon: <Download className="w-4 h-4" />,
    variant: 'outline',
    confirmMessage: 'Export the selected items?',
  },
  import: {
    type: 'import',
    label: 'Import',
    icon: <Upload className="w-4 h-4" />,
    variant: 'outline',
  },
};

export const BatchOperationPanel: React.FC<BatchOperationPanelProps> = ({
  items,
  itemType,
  onBatchDelete,
  onBatchUpdate,
  onBatchExport,
  onBatchImport,
  selectable = true,
  maxSelection,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<OperationType | null>(null);
  const [operationResult, setOperationResult] = useState<BatchOperationResult | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOperation, setSelectedOperation] = useState<OperationConfig | null>(null);

  const availableOperations = Object.entries(OPERATIONS).filter(([key, op]) => {
    if (op.type === 'delete' && !onBatchDelete) return false;
    if (op.type === 'export' && !onBatchExport) return false;
    if (op.type === 'import' && !onBatchImport) return false;
    if (['publish', 'draft', 'archive', 'tag'].includes(op.type) && !onBatchUpdate)
      return false;
    return true;
  });

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      const limit = maxSelection || items.length;
      const newSelection = new Set(items.slice(0, limit).map((item) => item.id));
      setSelectedIds(newSelection);
    }
  }, [items, selectedIds.size, maxSelection]);

  const handleSelectItem = useCallback((id: string | number) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      if (maxSelection && newSelection.size >= maxSelection) {
        toast({
          title: 'Selection limit reached',
          description: `You can only select up to ${maxSelection} items at once.`,
          variant: 'destructive',
        });
        return;
      }
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  }, [selectedIds, maxSelection]);

  const handleOperationStart = useCallback((operation: OperationConfig) => {
    if (selectedIds.size === 0 && operation.type !== 'import') {
      toast({
        title: 'No items selected',
        description: 'Please select at least one item to perform this operation.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedOperation(operation);
    if (operation.confirmMessage) {
      setShowConfirmDialog(true);
    } else if (operation.requiresInput) {
      setInputValue('');
      setShowConfirmDialog(true);
    } else {
      executeOperation(operation.type);
    }
  }, [selectedIds]);

  const executeOperation = async (type: OperationType) => {
    if (!selectedIds.size && type !== 'import') return;

    setOperationInProgress(true);
    setCurrentOperation(type);
    setOperationResult(null);

    try {
      let result: BatchOperationResult;

      switch (type) {
        case 'delete':
          if (onBatchDelete) {
            result = await onBatchDelete(Array.from(selectedIds));
          } else {
            throw new Error('Delete operation not available');
          }
          break;

        case 'export':
          if (onBatchExport) {
            await onBatchExport(Array.from(selectedIds));
            result = {
              total: selectedIds.size,
              successful: selectedIds.size,
              failed: 0,
              errors: [],
              duration_ms: 0,
            };
          } else {
            throw new Error('Export operation not available');
          }
          break;

        case 'import':
          if (onBatchImport && selectedOperation) {
            // Import is handled separately via file input
            return;
          } else {
            throw new Error('Import operation not available');
          }

        default:
          if (onBatchUpdate) {
            const updateData: Record<string, any> = {};
            if (type === 'publish') updateData.status = 'published';
            if (type === 'draft') updateData.status = 'draft';
            if (type === 'archive') updateData.archived = true;
            if (type === 'tag') updateData.tags = [inputValue];

            result = await onBatchUpdate(Array.from(selectedIds), updateData);
          } else {
            throw new Error('Update operation not available');
          }
      }

      setOperationResult(result);

      if (result.failed > 0) {
        toast({
          title: 'Operation completed with errors',
          description: `${result.successful} succeeded, ${result.failed} failed.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Operation completed successfully',
          description: `${result.successful} items processed.`,
        });
        setSelectedIds(new Set());
      }
    } catch (error) {
      toast({
        title: 'Operation failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setOperationInProgress(false);
      setCurrentOperation(null);
      setShowConfirmDialog(false);
    }
  };

  const handleFileImport = async (file: File) => {
    if (!onBatchImport) return;

    setOperationInProgress(true);
    setCurrentOperation('import');
    setOperationResult(null);

    try {
      const result = await onBatchImport(file);
      setOperationResult(result);

      if (result.failed > 0) {
        toast({
          title: 'Import completed with errors',
          description: `${result.successful} imported, ${result.failed} failed.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Import completed successfully',
          description: `${result.successful} items imported.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setOperationInProgress(false);
      setCurrentOperation(null);
    }
  };

  if (!selectable && availableOperations.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Batch Operations</span>
            {selectedIds.size > 0 && (
              <Badge variant="secondary">
                {selectedIds.size} selected
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Perform operations on multiple {itemType} at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selection Controls */}
          {selectable && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedIds.size === items.length && items.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="cursor-pointer">
                  Select All ({items.length})
                </Label>
              </div>
              {selectedIds.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds(new Set())}
                >
                  Clear Selection
                </Button>
              )}
            </div>
          )}

          {/* Operation Buttons */}
          <div className="flex flex-wrap gap-2">
            {availableOperations.map(([key, operation]) => (
              <Button
                key={key}
                variant={operation.variant}
                size="sm"
                disabled={
                  operationInProgress ||
                  (operation.type !== 'import' && selectedIds.size === 0)
                }
                onClick={() => handleOperationStart(operation)}
              >
                {operationInProgress && currentOperation === operation.type ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  operation.icon
                )}
                {operation.label}
              </Button>
            ))}
          </div>

          {/* Operation Result */}
          {operationResult && (
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Operation Result</h4>
                <Badge
                  variant={operationResult.failed > 0 ? 'destructive' : 'default'}
                >
                  {operationResult.failed > 0 ? 'Completed with Errors' : 'Success'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{operationResult.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {operationResult.successful}
                  </p>
                  <p className="text-sm text-muted-foreground">Successful</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {operationResult.failed}
                  </p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>

              {operationResult.errors.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-semibold">
                    View Errors ({operationResult.errors.length})
                  </summary>
                  <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                    {operationResult.errors.map((error, i) => (
                      <div
                        key={i}
                        className="text-sm text-destructive flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{error.error}</span>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              <p className="text-xs text-muted-foreground">
                Completed in {(operationResult.duration_ms / 1000).toFixed(2)}s
              </p>
            </div>
          )}

          {/* Progress */}
          {operationInProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing...</span>
                <span className="text-muted-foreground">Please wait</span>
              </div>
              <Progress value={66} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedOperation?.label || 'Confirm Operation'}
            </DialogTitle>
            <DialogDescription>
              {selectedOperation?.confirmMessage || 'Are you sure you want to proceed?'}
            </DialogDescription>
          </DialogHeader>

          {selectedOperation?.requiresInput && (
            <div className="space-y-2 py-4">
              <Label htmlFor="operation-input">
                {selectedOperation.inputLabel}
              </Label>
              <Input
                id="operation-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={selectedOperation.inputPlaceholder}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={operationInProgress}
            >
              Cancel
            </Button>
            <Button
              variant={selectedOperation?.variant}
              onClick={() => executeOperation(selectedOperation!.type)}
              disabled={operationInProgress || (selectedOperation?.requiresInput && !inputValue)}
            >
              {operationInProgress ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BatchOperationPanel;
