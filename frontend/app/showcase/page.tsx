'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Rating } from '@/components/ui/Rating';
import { Slider } from '@/components/ui/Slider';
import { useIntersection } from '@/components/hooks/useIntersection';
import {
  Sparkles,
  Zap,
  Shield,
  Rocket,
  Code,
  Palette,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function ShowcasePage() {
  const [ref1, isVisible1] = useIntersection({ threshold: 0.1, triggerOnce: true });
  const [ref2, isVisible2] = useIntersection({ threshold: 0.1, triggerOnce: true });
  const [ref3, isVisible3] = useIntersection({ threshold: 0.1, triggerOnce: true });

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Built for speed with optimized performance and minimal bundle size.',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Type Safe',
      description: 'Full TypeScript support with comprehensive type definitions.',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Beautiful UI',
      description: 'Stunning components with cyberpunk aesthetics and smooth animations.',
      color: 'from-purple-400 to-pink-500',
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Developer Friendly',
      description: 'Easy to use, well-documented, and highly customizable.',
      color: 'from-green-400 to-emerald-500',
    },
  ];

  const stats = [
    { label: 'Components', value: '50+', icon: Sparkles },
    { label: 'Hooks', value: '20+', icon: Zap },
    { label: 'Users', value: '10K+', icon: Users },
    { label: 'Growth', value: '200%', icon: TrendingUp },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      avatar: 'SJ',
      rating: 5,
      content: 'The best component library I\'ve ever used. The cyberpunk theme is absolutely stunning!',
    },
    {
      name: 'Mike Chen',
      role: 'Product Manager',
      avatar: 'MC',
      rating: 5,
      content: 'Our development speed increased by 40% after adopting CyberPress Platform.',
    },
    {
      name: 'Emily Davis',
      role: 'UI Designer',
      avatar: 'ED',
      rating: 4.5,
      content: 'Finally, a component library that doesn\'t compromise on aesthetics for functionality.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-900/30 dark:to-purple-900/30" />
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-700 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <Badge variant="gradient" size="lg" className="animate-pulse">
              <Sparkles className="w-4 h-4 mr-2" />
              v2.0 Now Available
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                Build the Future
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">of Web Apps</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              A powerful, flexible, and beautifully designed component library for Next.js applications.
              Experience the future of web development.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" icon={<Rocket className="w-5 h-5" />}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" icon={<Code className="w-5 h-5" />}>
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2"
                ref={index === 0 ? ref1 : undefined}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={ref2} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose CyberPress?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to build modern, performant web applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`transition-all duration-700 ${
                  isVisible2
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={ref3} className="py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Developers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See what our community has to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`transition-all duration-700 ${
                  isVisible3
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <Rating value={testimonial.rating} readonly size={16} />
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Avatar size="md" fallback={testimonial.avatar} bordered />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-12 space-y-6">
              <h2 className="text-4xl font-bold">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100">
                Join thousands of developers building amazing applications with CyberPress Platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button
                  size="lg"
                  variant="secondary"
                  icon={<Rocket className="w-5 h-5" />}
                >
                  Start Building
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Explore Components
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                CyberPress Platform
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Built with ❤️ for the modern web
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-purple-600 transition-colors">Documentation</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Components</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Examples</a>
              <a href="#" className="hover:text-purple-600 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
