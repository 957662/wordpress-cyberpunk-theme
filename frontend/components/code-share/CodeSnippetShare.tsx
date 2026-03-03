'use client';

import React, { useState, useCallback } from 'react';
import {
  Copy,
  Check,
  Download,
  Share2,
  Code2,
  Lightbulb,
  Save,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: Date;
}

interface CodeSnippetShareProps {
  onSave?: (snippet: Omit<CodeSnippet, 'id' | 'createdAt'>) => void;
  className?: string;
}

export const CodeSnippetShare: React.FC<CodeSnippetShareProps> = ({
  onSave,
  className = '',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const languages = [
    'typescript',
    'javascript',
    'python',
    'java',
    'cpp',
    'go',
    'rust',
    'php',
    'ruby',
    'swift',
    'kotlin',
    'sql',
    'html',
    'css',
    'json',
    'yaml',
    'markdown',
  ];

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [code]);

  const handleDownload = useCallback(() => {
    const extensions: Record<string, string> = {
      typescript: '.ts',
      javascript: '.js',
      python: '.py',
      java: '.java',
      cpp: '.cpp',
      go: '.go',
      rust: '.rs',
      php: '.php',
      ruby: '.rb',
      swift: '.swift',
      kotlin: '.kt',
      sql: '.sql',
      html: '.html',
      css: '.css',
      json: '.json',
      yaml: '.yaml',
      markdown: '.md',
    };

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'snippet'}${extensions[language] || '.txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, title, language]);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }, [tags]);

  const handleSave = useCallback(() => {
    const snippet: Omit<CodeSnippet, 'id' | 'createdAt'> = {
      title,
      description,
      code,
      language,
      tags,
    };

    if (onSave) {
      onSave(snippet);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      // 重置表单
      setTitle('');
      setDescription('');
      setCode('');
      setLanguage('typescript');
      setTags([]);
    }
  }, [title, description, code, language, tags, onSave]);

  const handleClear = useCallback(() => {
    setTitle('');
    setDescription('');
    setCode('');
    setLanguage('typescript');
    setTags([]);
  }, []);

  return (
    <div className={`code-snippet-share ${className}`}>
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Code2 className="w-6 h-6 text-cyber-cyan" />
            <h2 className="text-xl font-bold text-gray-100">Code Snippet Share</h2>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-2 hover:bg-cyber-purple/20 rounded-md transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4 text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="p-2 hover:bg-cyber-cyan/20 rounded-md transition-colors"
              title="Copy"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter snippet title..."
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this code does..."
            rows={3}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyber-cyan resize-none"
          />
        </div>

        {/* Language Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:border-cyber-cyan"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Code Editor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            rows={15}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyber-cyan font-mono text-sm resize-none"
            style={{ tabSize: 2 }}
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddTag}
              className="px-4 py-2 bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan rounded-md transition-colors"
            >
              Add
            </motion.button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-cyber-purple/20 text-cyber-purple rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </motion.button>

          <div className="flex items-center gap-2">
            {saved && (
              <div className="flex items-center gap-2 text-green-400 mr-2">
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={!title || !code}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:from-cyber-cyan/80 hover:to-cyber-purple/80 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Snippet
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 p-4 bg-cyber-purple/10 border border-cyber-purple/30 rounded-md">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-cyber-purple flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-cyber-purple mb-1">Pro Tips</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Use descriptive titles and tags to make snippets searchable</li>
              <li>• Include a clear description to explain the code's purpose</li>
              <li>• Select the correct language for proper syntax highlighting</li>
              <li>• Keep snippets focused on a single concept or utility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetShare;
