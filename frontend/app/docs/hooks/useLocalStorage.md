# useLocalStorage Hook

LocalStorage Hook，用于在浏览器 localStorage 中存储和读取数据。

## 导入

```tsx
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
```

## 基础用法

```tsx
const [name, setName, removeName] = useLocalStorage('name', 'Guest');

return (
  <div>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <button onClick={removeName}>Remove</button>
  </div>
);
```

## 存储对象

```tsx
interface User {
  name: string;
  email: string;
}

const [user, setUser, removeUser] = useLocalStorage<User>('user', {
  name: '',
  email: ''
});

const handleUpdate = () => {
  setUser({
    name: 'John Doe',
    email: 'john@example.com'
  });
};
```

## 存储数组

```tsx
const [items, setItems, removeItems] = useLocalStorage<string[]>('items', []);

const addItem = (item: string) => {
  setItems([...items, item]);
};

const clearItems = () => {
  setItems([]);
};
```

## 函数式更新

```tsx
const [count, setCount] = useLocalStorage('count', 0);

const increment = () => {
  setCount(prev => prev + 1);
};
```

## SessionStorage

```tsx
import { useSessionStorage } from '@/lib/hooks/useLocalStorage';

const [tempData, setTempData, removeTempData] = useSessionStorage(
  'temp',
  null
);
```

## API

### useLocalStorage

```tsx
useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void]
```

**参数：**
- `key`: localStorage 键名
- `initialValue`: 初始值

**返回：**
- `[storedValue, setValue, removeValue]`
  - `storedValue`: 存储的值
  - `setValue`: 设置值
  - `removeValue`: 删除值

### useSessionStorage

```tsx
useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void]
```

参数和返回值与 `useLocalStorage` 相同，但使用 sessionStorage。

## 特性

- 自动序列化/反序列化 JSON
- 跨标签页同步
- 类型安全（TypeScript）
- 错误处理

## 注意事项

- localStorage 有大小限制（通常 5-10MB）
- 不要存储敏感信息
- 在 SSR 环境中需要检查 `typeof window !== 'undefined'`
