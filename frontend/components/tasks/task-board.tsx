'use client';

import { useState, DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit,
  Check,
  Clock,
  AlertCircle,
  Flag,
  Calendar,
  User,
  Tag,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: Date;
  tags?: string[];
  createdAt: Date;
}

interface Column {
  id: TaskStatus;
  title: string;
  icon: React.ElementType;
  color: string;
}

interface TaskBoardProps {
  className?: string;
  initialTasks?: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskCreate?: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  readOnly?: boolean;
}

const COLUMNS: Column[] = [
  { id: 'todo', title: '待办', icon: AlertCircle, color: 'gray' },
  { id: 'in-progress', title: '进行中', icon: Clock, color: 'cyan' },
  { id: 'review', title: '审核', icon: Edit, color: 'purple' },
  { id: 'done', title: '已完成', icon: Check, color: 'green' }
];

const PRIORITY_CONFIG = {
  low: { color: 'gray', label: '低', icon: Flag },
  medium: { color: 'cyan', label: '中', icon: Flag },
  high: { color: 'orange', label: '高', icon: Flag },
  urgent: { color: 'red', label: '紧急', icon: AlertCircle }
};

const TAG_COLORS = [
  'bg-cyan-500/20 text-cyan-400',
  'bg-purple-500/20 text-purple-400',
  'bg-pink-500/20 text-pink-400',
  'bg-green-500/20 text-green-400',
  'bg-orange-500/20 text-orange-400',
  'bg-yellow-500/20 text-yellow-400'
];

export function TaskBoard({
  className,
  initialTasks = [],
  onTaskUpdate,
  onTaskDelete,
  onTaskCreate,
  readOnly = false
}: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskColumn, setNewTaskColumn] = useState<TaskStatus>('todo');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: TaskStatus) => {
    if (!draggedTask || readOnly) return;

    const updatedTasks = tasks.map((task) =>
      task.id === draggedTask.id ? { ...task, status } : task
    );
    setTasks(updatedTasks);
    onTaskUpdate?.(draggedTask.id, { status });
    setDraggedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    onTaskDelete?.(taskId);
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTasks([...tasks, newTask]);
    onTaskCreate?.(taskData);
    setShowNewTaskModal(false);
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const priorityConfig = PRIORITY_CONFIG[task.priority];
    const PriorityIcon = priorityConfig.icon;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        draggable={!readOnly}
        onDragStart={() => handleDragStart(task)}
        className={cn(
          'bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border',
          'hover:border-cyan-500/40 hover:bg-gray-900/70',
          'transition-all duration-300 cursor-grab active:cursor-grabbing',
          draggedTask?.id === task.id && 'opacity-50 scale-95',
          task.priority === 'urgent' && 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
        )}
      >
        {/* 任务标题 */}
        <h4 className="font-medium text-white mb-2 line-clamp-2">{task.title}</h4>

        {/* 描述 */}
        {task.description && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{task.description}</p>
        )}

        {/* 标签 */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className={cn(
                  'px-2 py-0.5 rounded text-xs',
                  TAG_COLORS[index % TAG_COLORS.length]
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {/* 优先级 */}
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded',
                `bg-${priorityConfig.color}-500/20 text-${priorityConfig.color}-400`
              )}
            >
              <PriorityIcon className="w-3 h-3" />
              <span>{priorityConfig.label}</span>
            </div>

            {/* 负责人 */}
            {task.assignee && (
              <div className="flex items-center gap-1 text-gray-400">
                <User className="w-3 h-3" />
                <span>{task.assignee}</span>
              </div>
            )}
          </div>

          {/* 截止日期 */}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{task.dueDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        {!readOnly && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditingTask(task)}
              className="flex-1 px-2 py-1 text-xs bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors"
            >
              编辑
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDeleteTask(task.id)}
              className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={cn('h-full flex flex-col', className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          任务看板
        </h2>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400">
            {tasks.length} 个任务
          </div>
        </div>
      </div>

      {/* 看板列 */}
      <div className="flex-1 grid grid-cols-4 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const Icon = column.icon;
          const columnTasks = getTasksByStatus(column.id);

          return (
            <div
              key={column.id}
              className={cn(
                'flex flex-col bg-black/30 backdrop-blur-xl rounded-2xl border border-cyan-500/20 overflow-hidden',
                'min-w-[280px]'
              )}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              {/* 列头 */}
              <div className="p-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 to-purple-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={cn('w-4 h-4 text-${column.color}-400')} />
                    <h3 className="font-medium text-white">{column.title}</h3>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs',
                      `bg-${column.color}-500/20 text-${column.color}-400`
                    )}>
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* 添加任务按钮 */}
                  {!readOnly && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setNewTaskColumn(column.id);
                        setShowNewTaskModal(true);
                      }}
                      className="p-1 rounded-lg hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* 任务列表 */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                <AnimatePresence>
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </AnimatePresence>

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    暂无任务
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 新建任务模态框 */}
      <AnimatePresence>
        {showNewTaskModal && (
          <NewTaskModal
            column={newTaskColumn}
            onClose={() => setShowNewTaskModal(false)}
            onCreate={handleCreateTask}
          />
        )}
      </AnimatePresence>

      {/* 编辑任务模态框 */}
      <AnimatePresence>
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onUpdate={(updates) => {
              const updatedTasks = tasks.map((task) =>
                task.id === editingTask.id ? { ...task, ...updates } : task
              );
              setTasks(updatedTasks);
              onTaskUpdate?.(editingTask.id, updates);
              setEditingTask(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 新建任务模态框
function NewTaskModal({
  column,
  onClose,
  onCreate
}: {
  column: TaskStatus;
  onClose: () => void;
  onCreate: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleCreate = () => {
    if (!title.trim()) return;

    onCreate({
      title,
      description,
      status: column,
      priority,
      tags: tags.length > 0 ? tags : undefined
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-bold text-white mb-4">创建任务</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              标题 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500/60 text-white"
              placeholder="输入任务标题"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500/60 text-white resize-none"
              placeholder="输入任务描述（可选）"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              优先级
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(PRIORITY_CONFIG).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p as TaskPriority)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    priority === p
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  )}
                >
                  {PRIORITY_CONFIG[p as TaskPriority].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              标签
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500/60 text-white text-sm"
                placeholder="添加标签"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                添加
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            创建
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 编辑任务模态框（简化版）
function EditTaskModal({
  task,
  onClose,
  onUpdate
}: {
  task: Task;
  onClose: () => void;
  onUpdate: (updates: Partial<Task>) => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority);

  const handleUpdate = () => {
    if (!title.trim()) return;
    onUpdate({ title, description, priority });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-bold text-white mb-4">编辑任务</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500/60 text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500/60 text-white resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              优先级
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(PRIORITY_CONFIG).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p as TaskPriority)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    priority === p
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  )}
                >
                  {PRIORITY_CONFIG[p as TaskPriority].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
          >
            保存
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
