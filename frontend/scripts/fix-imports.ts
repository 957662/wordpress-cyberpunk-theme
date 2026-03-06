#!/usr/bin/env tsx

/**
 * 修复导入路径脚本
 * 将所有 @/lib/utils/classname 和 @/lib/utils/cn 替换为 @/lib/utils
 */

import { readFile, writeFile, readdir } from 'fs/promises';
import { join, relative } from 'path';
import { existsSync } from 'fs';

const FRONTEND_DIR = process.cwd();
const COMPONENTS_DIR = join(FRONTEND_DIR, 'components');

interface FileFixResult {
  file: string;
  fixed: boolean;
  oldImports: string[];
  newImport: string;
}

async function fixImportsInFile(filePath: string): Promise<FileFixResult> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const oldImports: string[] = [];

    // 检查是否包含错误的导入
    if (content.includes('@/lib/utils/classname')) {
      oldImports.push('@/lib/utils/classname');
    }
    if (content.includes('@/lib/utils/cn')) {
      oldImports.push('@/lib/utils/cn');
    }

    if (oldImports.length === 0) {
      return { file: filePath, fixed: false, oldImports: [], newImport: '' };
    }

    // 替换导入
    let newContent = content;
    newContent = newContent.replace(/from '@\/lib\/utils\/classname'/g, "from '@/lib/utils'");
    newContent = newContent.replace(/from '@\/lib\/utils\/cn'/g, "from '@/lib/utils'");
    newContent = newContent.replace(/from "@\/lib\/utils\/classname"/g, 'from "@/lib/utils"');
    newContent = newContent.replace(/from "@\/lib\/utils\/cn"/g, 'from "@/lib/utils"');

    // 写回文件
    await writeFile(filePath, newContent, 'utf-8');

    return {
      file: filePath,
      fixed: true,
      oldImports,
      newImport: '@/lib/utils',
    };
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
    return { file: filePath, fixed: false, oldImports: [], newImport: '' };
  }
}

async function findTsxFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function traverse(currentDir: string) {
    try {
      const entries = await readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);

        if (entry.isDirectory()) {
          // 跳过 node_modules 和 .next
          if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
            await traverse(fullPath);
          }
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // 忽略无法访问的目录
    }
  }

  await traverse(dir);
  return files;
}

async function main() {
  console.log('🔧 开始修复导入路径...\n');

  // 查找所有 .tsx 和 .ts 文件
  console.log('📁 扫描文件中...');
  const files = await findTsxFiles(FRONTEND_DIR);
  console.log(`✅ 找到 ${files.length} 个 TypeScript 文件\n`);

  // 修复每个文件
  let fixedCount = 0;
  const results: FileFixResult[] = [];

  for (const file of files) {
    const result = await fixImportsInFile(file);
    if (result.fixed) {
      fixedCount++;
      console.log(`✅ 修复: ${relative(FRONTEND_DIR, file)}`);
      console.log(`   ${result.oldImports.join(', ')} → ${result.newImport}`);
    }
    results.push(result);
  }

  // 输出统计
  console.log('\n' + '='.repeat(50));
  console.log(`📊 统计信息:`);
  console.log(`   总文件数: ${files.length}`);
  console.log(`   修复文件数: ${fixedCount}`);
  console.log(`   未修改文件数: ${files.length - fixedCount}`);
  console.log('='.repeat(50));

  if (fixedCount > 0) {
    console.log('\n✨ 完成！所有导入路径已修复。\n');
    console.log('💡 提示: 运行以下命令验证修复:');
    console.log('   npm run type-check');
    console.log('   npm run lint');
  } else {
    console.log('\n✅ 所有导入路径都已正确，无需修复。\n');
  }
}

// 运行脚本
main().catch(error => {
  console.error('❌ 脚本执行失败:', error);
  process.exit(1);
});
