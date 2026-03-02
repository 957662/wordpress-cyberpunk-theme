/**
 * 打印功能演示页面
 */

import { Metadata } from 'next';
import { PrintButton, PrintContainer, PrintStyles, PrintHeader, PrintFooter } from '@/components/utility/PrintButton';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: '打印功能演示 - CyberPress',
  description: '展示各种打印功能和打印样式',
};

export default function PrintDemoPage() {
  const reportData = [
    { id: 1, name: '项目 A', status: '进行中', progress: 75, value: '$50,000' },
    { id: 2, name: '项目 B', status: '已完成', progress: 100, value: '$30,000' },
    { id: 3, name: '项目 C', status: '待开始', progress: 0, value: '$25,000' },
  ];

  return (
    <div className="min-h-screen bg-cyber-darker">
      {/* 页面头部 - 打印时隐藏 */}
      <PrintHeader>
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-lg">项目报告</h1>
          <p className="text-sm">生成时间: {new Date().toLocaleDateString()}</p>
        </div>
      </PrintHeader>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 打印按钮 - 打印时隐藏 */}
        <PrintContainer className="mb-8 flex justify-end" hideOnPrint>
          <PrintButton
            onBeforePrint={() => {
              console.log('准备打印...');
              return true;
            }}
            onAfterPrint={() => {
              console.log('打印完成！');
            }}
          />
        </PrintContainer>

        {/* 文档标题 */}
        <PrintStyles>
          <div className="mb-8">
            <h1 className="font-display font-bold text-4xl text-cyber-cyan mb-2">
              项目状态报告
            </h1>
            <p className="text-gray-400">
              生成日期: {new Date().toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </PrintStyles>

        {/* 摘要 */}
        <Card className="mb-6">
          <h2 className="font-display font-semibold text-xl text-cyber-cyan mb-4">
            摘要
          </h2>
          <p className="text-gray-300 leading-relaxed">
            本报告展示了当前所有项目的状态和进展情况。数据实时更新，
            反映了项目团队在最近一个季度的努力成果。通过本报告，
            您可以了解项目的整体进度、预算使用情况以及存在的问题。
          </p>
        </Card>

        {/* 数据表格 */}
        <Card className="mb-6">
          <h2 className="font-display font-semibold text-xl text-cyber-cyan mb-4">
            项目列表
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-border">
                  <th className="text-left py-3 px-4 font-display text-gray-400">项目名称</th>
                  <th className="text-left py-3 px-4 font-display text-gray-400">状态</th>
                  <th className="text-left py-3 px-4 font-display text-gray-400">进度</th>
                  <th className="text-left py-3 px-4 font-display text-gray-400">预算</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((project) => (
                  <tr key={project.id} className="border-b border-cyber-border/50">
                    <td className="py-3 px-4 text-gray-300">{project.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        project.status === '已完成' ? 'bg-cyber-green/20 text-cyber-green' :
                        project.status === '进行中' ? 'bg-cyber-cyan/20 text-cyber-cyan' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-cyber-muted rounded-full h-2">
                          <div
                            className="bg-cyber-cyan h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-mono">{project.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <h3 className="text-gray-400 text-sm mb-2">总项目数</h3>
            <p className="font-display font-bold text-3xl text-cyber-cyan">12</p>
          </Card>
          <Card>
            <h3 className="text-gray-400 text-sm mb-2">进行中</h3>
            <p className="font-display font-bold text-3xl text-cyber-yellow">5</p>
          </Card>
          <Card>
            <h3 className="text-gray-400 text-sm mb-2">已完成</h3>
            <p className="font-display font-bold text-3xl text-cyber-green">7</p>
          </Card>
        </div>

        {/* 页脚 - 仅打印时显示 */}
        <PrintFooter>
          <div className="flex justify-between">
            <span>CyberPress Platform - 机密文档</span>
            <span>第 1 页，共 1 页</span>
          </div>
        </PrintFooter>

        {/* 使用说明 - 仅屏幕显示 */}
        <PrintContainer hideOnPrint className="mt-8">
          <Card>
            <h3 className="font-display font-semibold text-lg text-cyber-cyan mb-4">
              使用说明
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>• 点击右上角的"打印"按钮可以打印此页面</li>
              <li>• 页面标题和说明在打印时会被隐藏</li>
              <li>• 打印时会自动添加页眉和页脚</li>
              <li>• 打印样式经过优化，确保可读性</li>
              <li>• 可以使用浏览器的打印预览功能查看效果</li>
            </ul>
          </Card>
        </PrintContainer>
      </div>
    </div>
  );
}
