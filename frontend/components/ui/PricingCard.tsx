/**
 * 定价卡片组件
 * 用于展示产品/服务的定价方案
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface PricingFeature {
  name: string;
  included: boolean;
  description?: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: PricingFeature[];
  highlighted?: boolean;
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary';
  onButtonClick?: () => void;
}

export interface PricingCardProps {
  plans: PricingPlan[];
  className?: string;
}

export function PricingCard({ plans, className }: PricingCardProps) {
  return (
    <div className={cn('grid md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {plans.map((plan, index) => (
        <PricingCardItem key={index} plan={plan} />
      ))}
    </div>
  );
}

function PricingCardItem({ plan }: { plan: PricingPlan }) {
  const {
    name,
    price,
    period,
    description,
    features,
    highlighted = false,
    buttonText = '选择方案',
    buttonVariant = 'primary',
    onButtonClick,
  } = plan;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={cn(
        'relative rounded-xl p-6 backdrop-blur-md border-2',
        'transition-all duration-300',
        highlighted
          ? 'border-cyber-cyan bg-cyber-cyan/5 shadow-neon-cyan scale-105'
          : 'border-cyber-purple/30 bg-cyber-purple/5 hover:border-cyber-purple/50'
      )}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="px-4 py-1 bg-cyber-cyan text-cyber-dark text-sm font-semibold rounded-full">
            推荐
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold">{price}</span>
          {period && <span className="text-gray-400">{period}</span>}
        </div>
        {description && (
          <p className="mt-3 text-gray-400 text-sm">{description}</p>
        )}
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            {feature.included ? (
              <svg className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-cyber-pink flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={cn('text-sm', feature.included ? 'text-gray-300' : 'text-gray-500')}>
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onButtonClick}
        className={cn(
          'w-full py-3 rounded-lg font-semibold transition-all duration-200',
          buttonVariant === 'primary'
            ? 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90 shadow-neon-cyan'
            : 'border-2 border-cyber-purple text-cyber-purple hover:bg-cyber-purple/10'
        )}
      >
        {buttonText}
      </motion.button>
    </motion.div>
  );
}

// 定价比较表
export interface PricingComparisonProps {
  plans: PricingPlan[];
  features: string[];
  className?: string;
}

export function PricingComparison({ plans, features, className }: PricingComparisonProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 px-4 font-semibold">功能</th>
            {plans.map((plan, index) => (
              <th key={index} className="text-center py-4 px-4 font-semibold">
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, featureIndex) => (
            <tr key={featureIndex} className="border-b border-gray-800">
              <td className="py-4 px-4">{feature}</td>
              {plans.map((plan, planIndex) => {
                const planFeature = plan.features.find(f => f.name === feature);
                return (
                  <td key={planIndex} className="text-center py-4 px-4">
                    {planFeature?.included ? (
                      <svg className="w-5 h-5 text-cyber-green mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-cyber-pink mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 定价切换器（月付/年付）
export interface PricingToggleProps {
  value: 'monthly' | 'yearly';
  onChange: (value: 'monthly' | 'yearly') => void;
  discount?: number;
  className?: string;
}

export function PricingToggle({ value, onChange, discount, className }: PricingToggleProps) {
  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      <button
        onClick={() => onChange('monthly')}
        className={cn(
          'px-4 py-2 rounded-lg font-medium transition-all duration-200',
          value === 'monthly'
            ? 'bg-cyber-cyan text-cyber-dark'
            : 'text-gray-400 hover:text-white'
        )}
      >
        月付
      </button>

      <div className="relative">
        <motion.button
          onClick={() => onChange(value === 'monthly' ? 'yearly' : 'monthly')}
          className={cn(
            'w-14 h-7 rounded-full transition-colors duration-200',
            value === 'yearly' ? 'bg-cyber-purple' : 'bg-gray-700'
          )}
        >
          <motion.div
            className="w-5 h-5 bg-white rounded-full absolute top-1"
            animate={{ left: value === 'yearly' ? 'calc(100% - 24px)' : '4px' }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
      </div>

      <button
        onClick={() => onChange('yearly')}
        className={cn(
          'px-4 py-2 rounded-lg font-medium transition-all duration-200',
          value === 'yearly'
            ? 'bg-cyber-cyan text-cyber-dark'
            : 'text-gray-400 hover:text-white'
        )}
      >
        年付
        {discount && (
          <span className="ml-2 text-cyber-green text-sm">
            省 {discount}%
          </span>
        )}
      </button>
    </div>
  );
}
