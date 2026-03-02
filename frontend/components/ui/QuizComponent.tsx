/**
 * 测验组件
 * 支持单选、多选、填空题，带计分和结果展示
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type QuestionType = 'single' | 'multiple' | 'input';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: QuizOption[];
  correctAnswer?: string; // 用于填空题
  explanation?: string;
  points?: number;
}

export interface QuizComponentProps {
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore?: number;
  onComplete?: (score: number, totalPoints: number) => void;
  showExplanations?: boolean;
  className?: string;
}

export function QuizComponent({
  title,
  description,
  questions,
  passingScore = 70,
  onComplete,
  showExplanations = true,
  className,
}: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    const { score } = calculateScore();
    onComplete?.(score, getTotalPoints());
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setReviewMode(false);
  };

  const calculateScore = () => {
    let score = 0;
    let correct = 0;

    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const points = question.points || 1;

      if (question.type === 'single') {
        const selectedOption = question.options?.find(opt => opt.id === userAnswer);
        if (selectedOption?.isCorrect) {
          score += points;
          correct++;
        }
      } else if (question.type === 'multiple') {
        const selectedOptions = userAnswer as string[];
        const correctOptions = question.options?.filter(opt => opt.isCorrect).map(opt => opt.id);

        if (JSON.stringify(selectedOptions.sort()) === JSON.stringify(correctOptions?.sort())) {
          score += points;
          correct++;
        }
      } else if (question.type === 'input') {
        if (userAnswer === question.correctAnswer) {
          score += points;
          correct++;
        }
      }
    });

    return { score, correct, total: questions.length };
  };

  const getTotalPoints = () => {
    return questions.reduce((sum, q) => sum + (q.points || 1), 0);
  };

  const getScorePercentage = () => {
    const { score } = calculateScore();
    return Math.round((score / getTotalPoints()) * 100);
  };

  const { score, correct, total } = calculateScore();
  const percentage = getScorePercentage();
  const passed = percentage >= passingScore;

  if (showResults && reviewMode) {
    return (
      <div className={cn('backdrop-blur-md rounded-xl border-2 border-cyber-purple/30 p-6', className)}>
        <QuizResults
          title={title}
          questions={questions}
          answers={answers}
          score={score}
          totalPoints={getTotalPoints()}
          correct={correct}
          totalQuestions={total}
          passed={passed}
          onRetry={handleRetry}
          showExplanations={showExplanations}
        />
      </div>
    );
  }

  if (showResults) {
    return (
      <div className={cn('backdrop-blur-md rounded-xl border-2 border-cyber-purple/30 p-6', className)}>
        <QuizSummary
          title={title}
          score={score}
          totalPoints={getTotalPoints()}
          correct={correct}
          totalQuestions={total}
          percentage={percentage}
          passed={passed}
          passingScore={passingScore}
          onReview={() => setReviewMode(true)}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const question = questions[currentQuestion];
  const userAnswer = answers[question.id];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className={cn('backdrop-blur-md rounded-xl border-2 border-cyber-purple/30 p-6', className)}>
      {/* 标题和描述 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {description && <p className="text-gray-400">{description}</p>}
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">
            问题 {currentQuestion + 1} / {questions.length}
          </span>
          <span className="text-cyber-cyan">
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            className="h-full bg-cyber-cyan"
          />
        </div>
      </div>

      {/* 问题 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <QuizQuestionItem
            question={question}
            userAnswer={userAnswer}
            onAnswer={(answer) => handleAnswer(question.id, answer)}
          />
        </motion.div>
      </AnimatePresence>

      {/* 导航按钮 */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={cn(
            'px-6 py-2.5 rounded-lg font-medium transition-all',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'border-2 border-cyber-purple text-cyber-purple hover:bg-cyber-purple/10'
          )}
        >
          上一题
        </button>

        <button
          onClick={handleNext}
          disabled={!userAnswer}
          className={cn(
            'px-6 py-2.5 rounded-lg font-medium transition-all',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90'
          )}
        >
          {isLastQuestion ? '提交' : '下一题'}
        </button>
      </div>
    </div>
  );
}

// 问题组件
function QuizQuestionItem({
  question,
  userAnswer,
  onAnswer,
}: {
  question: QuizQuestion;
  userAnswer: string | string[] | undefined;
  onAnswer: (answer: string | string[]) => void;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleOptionClick = (optionId: string) => {
    if (question.type === 'single') {
      onAnswer(optionId);
    } else if (question.type === 'multiple') {
      const currentAnswers = (userAnswer as string[]) || [];
      const newAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter(id => id !== optionId)
        : [...currentAnswers, optionId];
      onAnswer(newAnswers);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onAnswer(value);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>

      {question.type === 'input' ? (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="请输入你的答案..."
          className="w-full px-4 py-3 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg focus:border-cyber-cyan focus:outline-none"
        />
      ) : (
        <div className="space-y-3">
          {question.options?.map(option => {
            const isSelected =
              question.type === 'single'
                ? userAnswer === option.id
                : (userAnswer as string[])?.includes(option.id);

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={cn(
                  'w-full text-left p-4 rounded-lg border-2 transition-all',
                  'hover:border-cyber-purple/50',
                  isSelected
                    ? 'border-cyber-cyan bg-cyber-cyan/10'
                    : 'border-cyber-purple/30 bg-cyber-purple/5'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                      question.type === 'single' ? 'border-cyber-cyan' : 'border-cyber-purple',
                      question.type === 'multiple' && 'rounded-sm'
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          'w-3 h-3 rounded-sm',
                          question.type === 'single' ? 'bg-cyber-cyan rounded-full' : 'bg-cyber-purple'
                        )}
                      />
                    )}
                  </div>
                  <span className={cn('font-medium', isSelected && 'text-cyber-cyan')}>
                    {option.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {question.points && (
        <div className="mt-4 text-sm text-gray-400">
          分值: {question.points} 分
        </div>
      )}
    </div>
  );
}

// 结果摘要组件
function QuizSummary({
  title,
  score,
  totalPoints,
  correct,
  totalQuestions,
  percentage,
  passed,
  passingScore,
  onReview,
  onRetry,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="mb-6">
        <div
          className={cn(
            'inline-flex items-center justify-center w-24 h-24 rounded-full mb-4',
            passed ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-pink/20 text-cyber-pink'
          )}
        >
          <span className="text-4xl font-bold">{percentage}%</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {passed ? '恭喜通过！' : '未能通过'}
        </h2>
        <p className="text-gray-400">
          你答对了 {correct}/{totalQuestions} 题，获得 {score}/{totalPoints} 分
        </p>
        <p className="text-sm text-gray-500 mt-2">
          及格分数: {passingScore}%
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onReview}
          className="px-6 py-2.5 border-2 border-cyber-purple text-cyber-purple rounded-lg hover:bg-cyber-purple/10 transition-all"
        >
          查看答案
        </button>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-cyber-cyan text-cyber-dark rounded-lg hover:bg-cyber-cyan/90 transition-all"
        >
          重新测验
        </button>
      </div>
    </motion.div>
  );
}

// 详细结果组件
function QuizResults({
  title,
  questions,
  answers,
  score,
  totalPoints,
  correct,
  totalQuestions,
  passed,
  onRetry,
  showExplanations,
}: any) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{title} - 答案解析</h2>
        <p className="text-gray-400">
          得分: {score}/{totalPoints} | 正确率: {Math.round((correct / totalQuestions) * 100)}%
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {questions.map((question: QuizQuestion, index: number) => {
          const userAnswer = answers[question.id];
          let isCorrect = false;

          if (question.type === 'single') {
            isCorrect = question.options?.find(opt => opt.id === userAnswer)?.isCorrect || false;
          } else if (question.type === 'multiple') {
            const correctOptions = question.options?.filter(opt => opt.isCorrect).map(opt => opt.id);
            isCorrect = JSON.stringify((userAnswer as string[]).sort()) === JSON.stringify(correctOptions?.sort());
          } else if (question.type === 'input') {
            isCorrect = userAnswer === question.correctAnswer;
          }

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'p-4 rounded-lg border-2',
                isCorrect ? 'border-cyber-green bg-cyber-green/10' : 'border-cyber-pink bg-cyber-pink/10'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('text-2xl', isCorrect ? 'text-cyber-green' : 'text-cyber-pink')}>
                  {isCorrect ? '✓' : '✗'}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-2">
                    {index + 1}. {question.question}
                  </p>

                  {question.type !== 'input' && question.options?.map(option => {
                    const isSelected =
                      question.type === 'single'
                        ? userAnswer === option.id
                        : (userAnswer as string[])?.includes(option.id);
                    const isOptionCorrect = option.isCorrect;

                    return (
                      <div
                        key={option.id}
                        className={cn(
                          'text-sm py-1 px-2 rounded',
                          isSelected && isOptionCorrect && 'bg-cyber-green/20 text-cyber-green',
                          isSelected && !isOptionCorrect && 'bg-cyber-pink/20 text-cyber-pink',
                          !isSelected && isOptionCorrect && 'text-cyber-green'
                        )}
                      >
                        {option.text}
                        {isOptionCorrect && ' ✓ 正确答案'}
                      </div>
                    );
                  })}

                  {question.type === 'input' && (
                    <div className="text-sm">
                      <div className={cn(isCorrect ? 'text-cyber-green' : 'text-cyber-pink')}>
                        你的答案: {userAnswer}
                      </div>
                      <div className="text-cyber-green">
                        正确答案: {question.correctAnswer}
                      </div>
                    </div>
                  )}

                  {showExplanations && question.explanation && (
                    <div className="mt-3 p-3 bg-cyber-dark/50 rounded text-sm text-gray-400">
                      💡 {question.explanation}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-cyber-cyan text-cyber-dark rounded-lg hover:bg-cyber-cyan/90 transition-all"
        >
          重新测验
        </button>
      </div>
    </div>
  );
}
