'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Star } from 'lucide-react';

interface FeedbackWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const positionClasses = { 'bottom-right': 'bottom-6 right-6', 'bottom-left': 'bottom-6 left-6' };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed ${positionClasses[position]} z-40 p-4 bg-cyan-500 text-white rounded-full`}
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-gray-900 rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">反馈</h2>
                <button onClick={() => setIsOpen(false)}><X size={24} className="text-gray-400" /></button>
              </div>
              <div className="mb-4 flex gap-2">
                {[1,2,3,4,5].map(v => (
                  <button key={v} onClick={() => setRating(v)} className="p-2">
                    <Star size={24} className={v <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />
                  </button>
                ))}
              </div>
              <textarea className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg mb-4" rows={4} placeholder="您的反馈..." />
              <div className="flex gap-3">
                <button onClick={() => setIsOpen(false)} className="flex-1 px-4 py-2 border border-gray-600 text-white rounded-lg">取消</button>
                <button className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg">提交</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackWidget;
