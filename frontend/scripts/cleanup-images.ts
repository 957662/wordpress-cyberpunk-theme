#!/usr/bin/env tsx

/**
 * Cleanup Unused Images Script
 * 清理未使用的图片脚本
 *
 * 用法:
 * npm run cleanup-images
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const publicDir = path.join(process.cwd(), 'public');
const imagesDir = path.join(publicDir, 'images');

// 递归获取目录下所有文件
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// 检查文件是否在代码中被引用
function isFileUsed(filePath: string): boolean {
  const relativePath = path.relative(publicDir, filePath).replace(/\\/g, '/');

  try {
    // 在源代码中搜索文件引用
    const result = execSync(
      `grep -r "${relativePath}" app/ components/ lib/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" || true`,
      { encoding: 'utf-8' }
    );

    return result.trim().length > 0;
  } catch (error) {
    return false;
  }
}

// 主函数
async function main() {
  try {
    console.log('🔍 Scanning for unused images...');

    if (!fs.existsSync(imagesDir)) {
      console.log('ℹ️  Images directory not found');
      return;
    }

    const allFiles = getAllFiles(imagesDir);
    const imageFiles = allFiles.filter((file) =>
      /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(file)
    );

    console.log(`📁 Found ${imageFiles.length} image files`);

    const unusedFiles: string[] = [];

    for (const file of imageFiles) {
      if (!isFileUsed(file)) {
        unusedFiles.push(file);
      }
    }

    if (unusedFiles.length === 0) {
      console.log('✅ No unused images found');
      return;
    }

    console.log(`\n❌ Found ${unusedFiles.length} unused images:`);
    unusedFiles.forEach((file) => {
      const relativePath = path.relative(publicDir, file);
      console.log(`  - ${relativePath}`);
    });

    // 询问是否删除
    console.log('\n⚠️  Do you want to delete these files? (yes/no)');
    // 在实际使用中，这里需要添加用户输入处理
    console.log('ℹ️  Run with --delete flag to auto-delete');

    // 如果有 --delete 参数，则删除文件
    if (process.argv.includes('--delete')) {
      console.log('\n🗑️  Deleting unused files...');
      unusedFiles.forEach((file) => {
        fs.unlinkSync(file);
        console.log(`  Deleted: ${path.relative(publicDir, file)}`);
      });
      console.log('✅ Cleanup complete');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
