'use client';

import React from 'react';
import { Timeline, createWorkExperience, createEducation, createProjects } from '@/components/timeline';
import { TimelineVertical, TimelineHorizontal } from '@/components/timeline';
import { Calendar, Briefcase, GraduationCap, FolderOpen } from 'lucide-react';

export default function TimelineExamplePage() {
  const workExperience = createWorkExperience();
  const education = createEducation();
  const projects = createProjects();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-glow-cyan mb-2">
            Timeline Components Demo
          </h1>
          <p className="text-gray-400">
            Explore different timeline layouts and styles
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Vertical Timeline - Work Experience */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-glow-cyan">Work Experience</h2>
          </div>
          <Timeline
            items={workExperience}
            colorScheme="cyan"
            showYear
            animate
            sortOrder="desc"
          />
        </section>

        {/* Vertical Timeline - Education */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-glow-purple">Education</h2>
          </div>
          <Timeline
            items={education}
            colorScheme="purple"
            showYear
            animate
            sortOrder="desc"
          />
        </section>

        {/* Vertical Timeline - Projects */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <FolderOpen className="w-8 h-8 text-pink-400" />
            <h2 className="text-3xl font-bold text-glow-pink">Projects</h2>
          </div>
          <Timeline
            items={projects}
            colorScheme="pink"
            showYear={false}
            animate
            sortOrder="desc"
          />
        </section>

        {/* Compact Vertical Timeline */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-bold text-glow-green">Compact Timeline</h2>
          </div>
          <div className="max-w-2xl">
            <TimelineVertical
              items={workExperience}
              colorScheme="green"
              compact
              animate
              sortOrder="desc"
            />
          </div>
        </section>

        {/* Horizontal Timeline */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-8 h-8 text-orange-400" />
            <h2 className="text-3xl font-bold text-glow-orange">Horizontal Timeline</h2>
          </div>
          <TimelineHorizontal
            items={projects}
            colorScheme="orange"
            animate
          />
        </section>

        {/* Custom Timeline */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold text-glow-blue">Mixed Colors</h2>
          </div>
          <Timeline
            items={[
              ...workExperience.map((item) => ({ ...item, color: 'cyan' as const })),
              ...education.map((item) => ({ ...item, color: 'purple' as const })),
              ...projects.map((item) => ({ ...item, color: 'pink' as const })),
            ]}
            colorScheme="blue"
            showYear
            animate
            sortOrder="desc"
          />
        </section>
      </div>
    </div>
  );
}
