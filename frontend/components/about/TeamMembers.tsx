/**
 * 团队成员展示组件
 * 完整的赛博朋克风格团队成员卡片
 */

'use client';

import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  skills: string[];
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: '张三',
    role: '创始人 & 首席架构师',
    bio: '10年+全栈开发经验，专注于高性能Web应用架构设计',
    avatar: '👨‍💻',
    skills: ['React', 'Next.js', 'Node.js', 'System Design'],
    social: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      email: 'zhangsan@example.com',
    },
  },
  {
    id: '2',
    name: '李四',
    role: 'UI/UX 设计师',
    bio: '赛博朋克风格设计专家，追求极致用户体验',
    avatar: '👩‍🎨',
    skills: ['Figma', 'Motion Design', '3D Design', 'Branding'],
    social: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      email: 'lisi@example.com',
    },
  },
  {
    id: '3',
    name: '王五',
    role: '后端工程师',
    bio: 'WordPress和API集成专家，确保系统稳定运行',
    avatar: '👨‍🔧',
    skills: ['WordPress', 'PHP', 'REST API', 'DevOps'],
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      email: 'wangwu@example.com',
    },
  },
  {
    id: '4',
    name: '赵六',
    role: '前端工程师',
    bio: 'React和动画特效专家，打造流畅的用户交互体验',
    avatar: '👩‍💻',
    skills: ['React', 'TypeScript', 'Framer Motion', 'Three.js'],
    social: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      email: 'zhaoliu@example.com',
    },
  },
];

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.2, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 text-gray-400 hover:text-cyber-cyan transition-colors"
      aria-label={label}
    >
      {icon}
    </motion.a>
  );
}

export function TeamMembers() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            核心团队
          </h2>
          <p className="text-gray-400 text-lg">
            来自世界各地的优秀开发者、设计师和工程师
          </p>
        </motion.div>

        {/* 团队成员网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative h-full p-6 rounded-xl border border-cyber-border bg-cyber-card/50 backdrop-blur-sm hover:border-cyber-cyan/50 transition-all overflow-hidden">
                {/* 发光效果 */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/0 via-cyber-purple/0 to-cyber-pink/0 group-hover:from-cyber-cyan/5 group-hover:via-cyber-purple/5 group-hover:to-cyber-pink/5 transition-all duration-300" />

                {/* 内容 */}
                <div className="relative z-10">
                  {/* 头像 */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 flex items-center justify-center text-5xl border-2 border-cyber-border group-hover:border-cyber-cyan transition-colors"
                  >
                    {member.avatar}
                  </motion.div>

                  {/* 姓名 */}
                  <h3 className="text-xl font-display font-bold text-white text-center mb-1 group-hover:text-cyber-cyan transition-colors">
                    {member.name}
                  </h3>

                  {/* 职位 */}
                  <p className="text-sm text-cyber-cyan text-center mb-3">
                    {member.role}
                  </p>

                  {/* 简介 */}
                  <p className="text-sm text-gray-400 text-center mb-4 line-clamp-2">
                    {member.bio}
                  </p>

                  {/* 技能标签 */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {member.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs rounded bg-cyber-muted text-gray-300 border border-cyber-border"
                      >
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded bg-cyber-muted text-gray-400 border border-cyber-border">
                        +{member.skills.length - 3}
                      </span>
                    )}
                  </div>

                  {/* 社交链接 */}
                  <div className="flex items-center justify-center gap-2">
                    {member.social.github && (
                      <SocialLink
                        href={member.social.github}
                        icon={<Github className="w-4 h-4" />}
                        label={`${member.name}的GitHub`}
                      />
                    )}
                    {member.social.twitter && (
                      <SocialLink
                        href={member.social.twitter}
                        icon={<Twitter className="w-4 h-4" />}
                        label={`${member.name}的Twitter`}
                      />
                    )}
                    {member.social.linkedin && (
                      <SocialLink
                        href={member.social.linkedin}
                        icon={<Linkedin className="w-4 h-4" />}
                        label={`${member.name}的LinkedIn`}
                      />
                    )}
                    {member.social.email && (
                      <SocialLink
                        href={`mailto:${member.social.email}`}
                        icon={<Mail className="w-4 h-4" />}
                        label={`给${member.name}发邮件`}
                      />
                    )}
                  </div>
                </div>

                {/* 装饰线 */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 加入我们 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-8 rounded-xl border border-cyber-border bg-cyber-card/30 backdrop-blur-sm">
            <h3 className="text-2xl font-display font-bold text-white mb-3">
              想要加入我们？
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              我们正在寻找充满激情的人才加入我们的团队。如果你热爱技术和创新，欢迎联系我们！
            </p>
            <motion.a
              href="mailto:jobs@cyberpress.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg text-cyber-dark font-semibold hover:shadow-lg hover:shadow-cyber-cyan/20 transition-all"
            >
              <Mail className="w-5 h-5" />
              发送简历
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default TeamMembers;
