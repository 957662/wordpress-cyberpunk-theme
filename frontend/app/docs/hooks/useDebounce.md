# useDebounce Hook

防抖 Hook，用于延迟执行函数。

## 导入

```tsx
import { useDebounce } from '@/lib/hooks/useDebounce';
```

## 基础用法

### 防抖值

```tsx
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

useEffect(() => {
  // 使用防抖后的值进行搜索
  if (debouncedSearchTerm) {
    performSearch(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);

return (
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search..."
  />
);
```

### 防抖回调

```tsx
const { useDebouncedCallback } = '@/lib/hooks/useDebounce';

const handleClick = useDebouncedCallback(
  () => {
    console.log('Clicked!');
  },
  1000
);

return <button onClick={handleClick}>Click Me</button>;
```

### 防抖状态

```tsx
const { useDebouncedState } from '@/lib/hooks/useDebounce';

const [debouncedValue, setValue, immediateValue] = useDebouncedState(
  '',
  500
);

return (
  <div>
    <input
      type="text"
      value={immediateValue}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Type something..."
    />
    <p>Debounced: {debouncedValue}</p>
  </div>
);
```

## API

### useDebounce

```tsx
useDebounce<T>(value: T, delay?: number): T
```

**参数：**
- `value`: 需要防抖的值
- `delay`: 延迟时间（毫秒），默认 300

**返回：**
- 防抖后的值

### useDebouncedCallback

```tsx
useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay?: number
): T
```

**参数：**
- `callback`: 需要防抖的回调函数
- `delay`: 延迟时间（毫秒），默认 300

**返回：**
- 防抖后的回调函数

### useDebouncedState

```tsx
useDebouncedState<T>(
  initialState: T,
  delay?: number
): [T, (value: T) => void, T]
```

**参数：**
- `initialState`: 初始状态
- `delay`: 延迟时间（毫秒），默认 300

**返回：**
- `[debouncedValue, setValue, immediateValue]` - 防抖值、设置函数、即时值

## 使用场景

- 搜索框输入
- 窗口 resize 事件
- 滚动事件处理
- API 请求防抖
