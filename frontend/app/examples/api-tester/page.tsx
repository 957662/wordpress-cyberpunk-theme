'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Copy,
  Check,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Code,
  FileJson,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface Header {
  key: string;
  value: string;
}

interface ApiTest {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: Header[];
  body?: string;
}

export default function ApiTesterExample() {
  const [tests, setTests] = useState<ApiTest[]>([
    {
      id: '1',
      name: '获取文章列表',
      method: 'GET',
      url: '/api/v1/posts',
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Authorization', value: 'Bearer YOUR_TOKEN' },
      ],
    },
    {
      id: '2',
      name: '创建文章',
      method: 'POST',
      url: '/api/v1/posts',
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Authorization', value: 'Bearer YOUR_TOKEN' },
      ],
      body: JSON.stringify(
        {
          title: '测试文章',
          content: '这是一篇测试文章的内容',
          category_id: 1,
          tag_ids: [1, 2],
        },
        null,
        2
      ),
    },
  ]);

  const [selectedTest, setSelectedTest] = useState<string | null>(tests[0].id);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  const selectedTest_data = tests.find((t) => t.id === selectedTest);

  const handleSendRequest = async () => {
    if (!selectedTest_data) return;

    setLoading(true);
    setResponse('');

    try {
      const options: RequestInit = {
        method: selectedTest_data.method,
        headers: Object.fromEntries(
          selectedTest_data.headers
            .filter((h) => h.key && h.value)
            .map((h) => [h.key, h.value])
        ),
      };

      if (
        ['POST', 'PUT', 'PATCH'].includes(selectedTest_data.method) &&
        selectedTest_data.body
      ) {
        options.body = selectedTest_data.body;
      }

      // In a real app, this would make an actual API call
      // For demo purposes, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResponse = {
        success: true,
        data: {
          id: 1,
          title: '测试文章',
          content: '这是一篇测试文章的内容',
          created_at: new Date().toISOString(),
        },
        message: '操作成功',
      };

      setResponse(JSON.stringify(mockResponse, null, 2));
    } catch (error) {
      setResponse(
        JSON.stringify(
          {
            success: false,
            error: error instanceof Error ? error.message : '请求失败',
          },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = () => {
    const newTest: ApiTest = {
      id: Date.now().toString(),
      name: '新测试',
      method: 'GET',
      url: '/api/v1/',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
    };
    setTests([...tests, newTest]);
    setSelectedTest(newTest.id);
  };

  const handleDeleteTest = (id: string) => {
    setTests(tests.filter((t) => t.id !== id));
    if (selectedTest === id) {
      setSelectedTest(tests[0]?.id || null);
    }
  };

  const handleUpdateTest = (id: string, updates: Partial<ApiTest>) => {
    setTests(tests.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(response);
    // Could add a toast notification here
  };

  const methodColors: Record<HttpMethod, string> = {
    GET: 'text-green-500',
    POST: 'text-blue-500',
    PUT: 'text-yellow-500',
    DELETE: 'text-red-500',
    PATCH: 'text-purple-500',
  };

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API 测试工具</h1>
          <p className="text-gray-400">
            测试和调试您的 API 端点，支持所有 HTTP 方法
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test List */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">测试列表</h2>
                <Button size="sm" variant="ghost" onClick={handleAddTest}>
                  <Plus size={16} />
                </Button>
              </div>
              <div className="space-y-2">
                {tests.map((test) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedTest === test.id
                          ? 'bg-cyber-cyan/20 border border-cyber-cyan'
                          : 'hover:bg-cyber-cyan/10'
                      }`}
                      onClick={() => setSelectedTest(test.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={`font-bold ${methodColors[test.method]}`}>
                            {test.method}
                          </span>
                          <span className="text-sm truncate">{test.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedTest(
                                expandedTest === test.id ? null : test.id
                              );
                            }}
                            className="p-1 hover:bg-cyber-cyan/20 rounded"
                          >
                            {expandedTest === test.id ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTest(test.id);
                            }}
                            className="p-1 hover:bg-red-500/20 rounded text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {expandedTest === test.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-2 pt-2 border-t border-cyber-cyan/20 text-xs text-gray-400"
                        >
                          <div>{test.url}</div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Test Editor */}
          <div className="lg:col-span-2 space-y-6">
            {selectedTest_data && (
              <>
                {/* Request Details */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Input
                      value={selectedTest_data.name}
                      onChange={(e) =>
                        handleUpdateTest(selectedTest_data.id, {
                          name: e.target.value,
                        })
                      }
                      className="font-bold text-lg"
                    />
                  </div>

                  <div className="space-y-4">
                    {/* Method and URL */}
                    <div className="flex gap-4">
                      <select
                        value={selectedTest_data.method}
                        onChange={(e) =>
                          handleUpdateTest(selectedTest_data.id, {
                            method: e.target.value as HttpMethod,
                          })
                        }
                        className="px-4 py-2 bg-cyber-dark border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan font-bold"
                      >
                        {Object.keys(methodColors).map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                      <Input
                        value={selectedTest_data.url}
                        onChange={(e) =>
                          handleUpdateTest(selectedTest_data.id, {
                            url: e.target.value,
                          })
                        }
                        placeholder="https://api.example.com/endpoint"
                        className="flex-1"
                      />
                    </div>

                    {/* Headers */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">请求头</h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleUpdateTest(selectedTest_data.id, {
                              headers: [
                                ...selectedTest_data.headers,
                                { key: '', value: '' },
                              ],
                            })
                          }
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {selectedTest_data.headers.map((header, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={header.key}
                              onChange={(e) => {
                                const newHeaders = [...selectedTest_data.headers];
                                newHeaders[index].key = e.target.value;
                                handleUpdateTest(selectedTest_data.id, {
                                  headers: newHeaders,
                                });
                              }}
                              placeholder="Header name"
                              className="flex-1"
                            />
                            <Input
                              value={header.value}
                              onChange={(e) => {
                                const newHeaders = [...selectedTest_data.headers];
                                newHeaders[index].value = e.target.value;
                                handleUpdateTest(selectedTest_data.id, {
                                  headers: newHeaders,
                                });
                              }}
                              placeholder="Header value"
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newHeaders = selectedTest_data.headers.filter(
                                  (_, i) => i !== index
                                );
                                handleUpdateTest(selectedTest_data.id, {
                                  headers: newHeaders,
                                });
                              }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Request Body */}
                    {['POST', 'PUT', 'PATCH'].includes(
                      selectedTest_data.method
                    ) && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold">请求体</h3>
                          <Badge variant="ghost" size="sm">
                            JSON
                          </Badge>
                        </div>
                        <textarea
                          value={selectedTest_data.body || ''}
                          onChange={(e) =>
                            handleUpdateTest(selectedTest_data.id, {
                              body: e.target.value,
                            })
                          }
                          placeholder='{"key": "value"}'
                          className="w-full h-40 p-3 bg-cyber-dark border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan font-mono text-sm resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Send Button */}
                  <div className="mt-6">
                    <Button
                      variant="neon"
                      className="w-full"
                      onClick={handleSendRequest}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={20} className="animate-spin mr-2" />
                          发送中...
                        </>
                      ) : (
                        <>
                          <Send size={20} className="mr-2" />
                          发送请求
                        </>
                      )}
                    </Button>
                  </div>
                </Card>

                {/* Response */}
                {response && (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold">响应</h2>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopyResponse}
                      >
                        <Copy size={16} className="mr-2" />
                        复制
                      </Button>
                    </div>
                    <div className="relative">
                      <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{response}</code>
                      </pre>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
