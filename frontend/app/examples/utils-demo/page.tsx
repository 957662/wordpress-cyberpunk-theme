'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  generateUUID,
  generateNanoID,
  sha256,
  base64Encode,
  base64Decode,
  isEmail,
  isPhoneNumber,
  isStrongPassword,
  formatFileSize,
  getFileExtension,
} from '@/lib/utils';
import { MainLayout, Section, SectionHeader, Container } from '@/components/layout';
import { Card, Input, Button } from '@/components/ui';

export default function UtilsDemo() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [text, setText] = useState('');
  const [encoded, setEncoded] = useState('');
  const [decoded, setDecoded] = useState('');

  // 加密演示
  const [uuid, setUuid] = useState('');
  const [nanoId, setNanoId] = useState('');
  const [hash, setHash] = useState('');

  const generateIds = () => {
    setUuid(generateUUID());
    setNanoId(generateNanoID());
  };

  const calculateHash = async () => {
    const result = await sha256(text || 'Hello, CyberPress!');
    setHash(result);
  };

  // 编码演示
  const handleEncode = () => {
    const result = base64Encode(text);
    setEncoded(result);
  };

  const handleDecode = () => {
    try {
      const result = base64Decode(encoded);
      setDecoded(result);
    } catch (error) {
      setDecoded('解码失败：无效的 Base64 字符串');
    }
  };

  return (
    <MainLayout>
      <Container size="lg">
        <Section variant="cyber" padding="lg">
          <SectionHeader
            title="工具函数演示"
            badge="Utils"
            description="展示各种工具函数的使用方法"
          />
        </Section>

        {/* ID 生成 */}
        <Section variant="neon" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">ID 生成</h3>

          <Card className="p-6 space-y-4">
            <Button onClick={generateIds} variant="primary">
              生成 ID
            </Button>

            {uuid && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">UUID</label>
                <div className="p-3 bg-cyber-darker border border-cyber-border rounded-lg font-mono text-sm text-cyber-cyan break-all">
                  {uuid}
                </div>
              </div>
            )}

            {nanoId && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">NanoID</label>
                <div className="p-3 bg-cyber-darker border border-cyber-border rounded-lg font-mono text-sm text-cyber-purple break-all">
                  {nanoId}
                </div>
              </div>
            )}

            {hash && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">SHA-256 Hash</label>
                <div className="p-3 bg-cyber-darker border border-cyber-border rounded-lg font-mono text-sm text-cyber-pink break-all">
                  {hash}
                </div>
              </div>
            )}
          </Card>
        </Section>

        {/* 验证函数 */}
        <Section variant="holographic" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">验证函数</h3>

          <Card className="p-6 space-y-6">
            {/* 邮箱验证 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">邮箱验证</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入邮箱地址"
                  className="flex-1"
                />
                <span className={isEmail(email) ? 'text-cyber-green' : 'text-gray-500'}>
                  {isEmail(email) ? '✓ 有效' : '✗ 无效'}
                </span>
              </div>
            </div>

            {/* 手机号验证 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">手机号验证（中国大陆）</label>
              <div className="flex gap-2">
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="输入手机号"
                  className="flex-1"
                />
                <span className={isPhoneNumber(phone) ? 'text-cyber-green' : 'text-gray-500'}>
                  {isPhoneNumber(phone) ? '✓ 有效' : '✗ 无效'}
                </span>
              </div>
            </div>

            {/* 密码强度验证 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">密码强度验证</label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                className="mb-2"
              />
              {password && (() => {
                const result = isStrongPassword(password);
                return (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">强度:</span>
                      <span className={`font-semibold ${
                        result.strength === 'strong' ? 'text-cyber-green' :
                        result.strength === 'medium' ? 'text-cyber-yellow' : 'text-cyber-pink'
                      }`}>
                        {result.strength === 'strong' ? '强' :
                         result.strength === 'medium' ? '中' : '弱'}
                      </span>
                    </div>
                    {result.errors.length > 0 && (
                      <ul className="text-sm text-cyber-pink space-y-1">
                        {result.errors.map((error, i) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })()}
            </div>
          </Card>
        </Section>

        {/* 编码/解码 */}
        <Section variant="cyber" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">Base64 编码/解码</h3>

          <Card className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">原始文本</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 bg-cyber-darker border border-cyber-border rounded-lg text-gray-300 focus:border-cyber-cyan focus:outline-none resize-none"
                rows={3}
                placeholder="输入要编码的文本"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleEncode} variant="primary">
                编码
              </Button>
              <Button onClick={calculateHash} variant="secondary">
                计算哈希
              </Button>
            </div>

            {encoded && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">编码结果</label>
                <div className="p-3 bg-cyber-darker border border-cyber-border rounded-lg font-mono text-sm text-cyber-cyan break-all">
                  {encoded}
                </div>
              </div>
            )}

            <div className="border-t border-cyber-border pt-4">
              <label className="block text-sm text-gray-400 mb-2">Base64 字符串</label>
              <textarea
                value={encoded}
                onChange={(e) => setEncoded(e.target.value)}
                className="w-full px-4 py-2 bg-cyber-darker border border-cyber-border rounded-lg text-gray-300 focus:border-cyber-cyan focus:outline-none resize-none"
                rows={3}
                placeholder="输入要解码的 Base64 字符串"
              />
              <Button onClick={handleDecode} variant="ghost" className="mt-2">
                解码
              </Button>
            </div>

            {decoded && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">解码结果</label>
                <div className="p-3 bg-cyber-darker border border-cyber-border rounded-lg text-sm text-cyber-purple break-all">
                  {decoded}
                </div>
              </div>
            )}
          </Card>
        </Section>

        {/* 文件工具 */}
        <Section variant="neon" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">文件工具</h3>

          <Card className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">文件名</label>
              <Input
                value="document.pdf"
                readOnly
                className="font-mono"
              />
              <div className="mt-2 text-sm text-gray-400">
                扩展名: <span className="text-cyber-cyan">{getFileExtension('document.pdf')}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">文件大小格式化</label>
              {[0, 1024, 1048576, 1073741824, 10737418240].map((size, i) => (
                <div key={i} className="flex justify-between py-1">
                  <span className="text-gray-300">{size.toLocaleString()} bytes</span>
                  <span className="text-cyber-cyan font-mono">{formatFileSize(size)}</span>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* 综合示例 */}
        <Section variant="holographic" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">综合示例</h3>

          <Card className="p-6">
            <p className="text-gray-300 mb-4">
              这些工具函数可以组合使用，创建更复杂的功能。例如：
            </p>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan">•</span>
                <span>用户注册时验证邮箱和密码强度</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan">•</span>
                <span>文件上传时验证文件类型和大小</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan">•</span>
                <span>敏感数据传输前进行编码加密</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan">•</span>
                <span>生成唯一的会话 ID 和令牌</span>
              </li>
            </ul>
          </Card>
        </Section>
      </Container>
    </MainLayout>
  );
}
