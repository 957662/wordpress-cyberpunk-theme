/**
 * 组件测试示例
 * 展示如何测试各种组件
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, createMockRouter, mockApiResponse } from './test-utils';

// 示例组件：计数器
function Counter({ initialCount = 0 }: { initialCount?: number }) {
  const [count, setCount] = React.useState(initialCount);

  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}

describe('Counter', () => {
  it('renders with initial count', () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });

  it('increments count when increment button is clicked', async () => {
    render(<Counter initialCount={0} />);
    const incrementButton = screen.getByText('Increment');

    await userEvent.click(incrementButton);

    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('decrements count when decrement button is clicked', async () => {
    render(<Counter initialCount={0} />);
    const decrementButton = screen.getByText('Decrement');

    await userEvent.click(decrementButton);

    expect(screen.getByTestId('count')).toHaveTextContent('-1');
  });
});

// 示例组件：用户资料卡
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="user-card">
      {user.avatar && <img src={user.avatar} alt={user.name} />}
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

describe('UserCard', () => {
  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  it('renders user information', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByAltText('John Doe')).toBeInTheDocument();
  });

  it('renders without avatar when not provided', () => {
    const userWithoutAvatar = { ...mockUser, avatar: undefined };

    render(<UserCard user={userWithoutAvatar} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

// 示例组件：搜索框
function SearchBox({ onSearch, placeholder = 'Search...' }: { onSearch: (query: string) => void; placeholder?: string }) {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        data-testid="search-input"
      />
      <button type="submit">Search</button>
    </form>
  );
}

describe('SearchBox', () => {
  it('calls onSearch when form is submitted', async () => {
    const onSearch = jest.fn();
    render(<SearchBox onSearch={onSearch} />);

    const input = screen.getByTestId('search-input');
    const submitButton = screen.getByText('Search');

    await userEvent.type(input, 'test query');
    await userEvent.click(submitButton);

    expect(onSearch).toHaveBeenCalledWith('test query');
  });

  it('submits on Enter key press', async () => {
    const onSearch = jest.fn();
    render(<SearchBox onSearch={onSearch} />);

    const input = screen.getByTestId('search-input');
    await userEvent.type(input, 'test query{Enter}');

    expect(onSearch).toHaveBeenCalledWith('test query');
  });
});

// 示例组件：异步数据加载
function AsyncData() {
  const [data, setData] = React.useState<string[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/data');
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData} data-testid="load-button">
        Load Data
      </button>
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">{error}</div>}
      {data && (
        <ul data-testid="data-list">
          {data.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

describe('AsyncData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state while fetching', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ['item1', 'item2'],
      } as Response)
    ) as jest.Mock;

    render(<AsyncData />);

    const loadButton = screen.getByTestId('load-button');
    await userEvent.click(loadButton);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('displays data after successful fetch', async () => {
    const mockData = ['item1', 'item2', 'item3'];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockData,
      } as Response)
    ) as jest.Mock;

    render(<AsyncData />);

    await userEvent.click(screen.getByTestId('load-button'));

    await waitFor(() => {
      expect(screen.getByTestId('data-list')).toBeInTheDocument();
    });

    expect(screen.getByText('item1')).toBeInTheDocument();
    expect(screen.getByText('item2')).toBeInTheDocument();
    expect(screen.getByText('item3')).toBeInTheDocument();
  });

  it('shows error message on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error'))) as jest.Mock;

    render(<AsyncData />);

    await userEvent.click(screen.getByTestId('load-button'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });
});

// 示例组件：表单验证
function ContactForm() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [errors, setErrors] = React.useState<{ name?: string; email?: string }>({});
  const [submitted, setSubmitted] = React.useState(false);

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return <div data-testid="success-message">Thank you for your submission!</div>;
  }

  return (
    <form onSubmit={handleSubmit} data-testid="contact-form">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="name-input"
        />
        {errors.name && <span data-testid="name-error">{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="email-input"
        />
        {errors.email && <span data-testid="email-error">{errors.email}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

describe('ContactForm', () => {
  it('shows validation errors for empty fields', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByText('Submit');
    await userEvent.click(submitButton);

    expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
    expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
  });

  it('shows error for invalid email format', async () => {
    render(<ContactForm />);

    await userEvent.type(screen.getByTestId('name-input'), 'John Doe');
    await userEvent.type(screen.getByTestId('email-input'), 'invalid-email');
    await userEvent.click(screen.getByText('Submit'));

    expect(screen.getByTestId('email-error')).toHaveTextContent('Email is invalid');
  });

  it('submits successfully with valid data', async () => {
    render(<ContactForm />);

    await userEvent.type(screen.getByTestId('name-input'), 'John Doe');
    await userEvent.type(screen.getByTestId('email-input'), 'john@example.com');
    await userEvent.click(screen.getByText('Submit'));

    expect(screen.getByTestId('success-message')).toBeInTheDocument();
  });
});

// 示例：测试自定义 Hook
import { renderHook, act } from '@testing-library/react';

function useCounter(initialValue = 0) {
  const [count, setCount] = React.useState(initialValue);
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

describe('useCounter', () => {
  it('initializes with initial value', () => {
    const { result } = renderHook(() => useCounter(5));

    expect(result.current.count).toBe(5);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(-1);
  });

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(10);
  });
});

// 示例：测试 Context
const ThemeContext = React.createContext<'light' | 'dark'>('light');

function ThemeToggler() {
  const [theme, setTheme] = React.useContext(ThemeContext);

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      data-testid="theme-toggle"
    >
      Current theme: {theme}
    </button>
  );
}

describe('ThemeToggler', () => {
  it('toggles theme when button is clicked', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider value={React.useState<'light' | 'dark'>('light')}>
        {children}
      </ThemeContext.Provider>
    );

    render(<ThemeToggler />, { wrapper });

    const button = screen.getByTestId('theme-toggle');
    expect(button).toHaveTextContent('Current theme: light');

    await userEvent.click(button);

    expect(button).toHaveTextContent('Current theme: dark');
  });
});
