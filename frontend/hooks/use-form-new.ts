/**
 * Form Management Hooks
 * 提供表单状态管理和验证的 React Hooks
 */

'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Hook: 通用表单管理
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Record<string, string>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(
    (name: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [name]: value }));

      // 清除该字段的错误
      if (errors[name as string]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name as string];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValue(name, value);
  }, [setValue]);

  const setFieldTouched = useCallback((name: keyof T, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;

      if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setValue(name, checked);
      } else if (type === 'number') {
        setValue(name, value === '' ? '' : parseFloat(value));
      } else {
        setValue(name, value);
      }
    },
    [setValue]
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setFieldTouched(name, true);

    // 验证该字段
    if (validate) {
      const fieldErrors = validate(values);
      if (fieldErrors[name]) {
        setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
      }
    }
  }, [validate, values, setFieldTouched]);

  const validateForm = useCallback(() => {
    if (!validate) return true;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    return Object.keys(validationErrors).length === 0;
  }, [validate, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void> | void) => {
      if (!validateForm()) {
        return false;
      }

      setIsSubmitting(true);

      try {
        await onSubmit(values);
        return true;
      } catch (error) {
        console.error('Form submission error:', error);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm]
  );

  const isValid = Object.keys(errors).length === 0;
  const isDirty = Object.keys(touched).length > 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    setValue,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    validateForm,
  };
}

/**
 * Hook: 异步表单提交
 */
export function useAsyncForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Record<string, string>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;

      if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setValue(name, checked);
      } else if (type === 'number') {
        setValue(name, value === '' ? '' : parseFloat(value));
      } else {
        setValue(name, value);
      }
    },
    [setValue]
  );

  const validateForm = useCallback(() => {
    if (!validate) return true;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [validate, values]);

  const handleSubmit = useCallback(
    async (
      onSubmit: (values: T) => Promise<any>,
      onSuccess?: (result: any) => void
    ) => {
      if (!validateForm()) {
        return false;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const result = await onSubmit(values);
        setSubmitSuccess(true);

        if (onSuccess) {
          onSuccess(result);
        }

        return true;
      } catch (error: any) {
        setSubmitError(error.message || '提交失败，请重试');
        setSubmitSuccess(false);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    submitError,
    submitSuccess,
    setValue,
    handleChange,
    handleSubmit,
    resetForm,
    validateForm,
  };
}

/**
 * Hook: 搜索表单（带防抖）
 */
export function useSearchForm<T = any>(
  initialQuery: string = '',
  delay: number = 300
) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setIsSearching(true);
        setError(null);
      } else {
        setResults([]);
        setIsSearching(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const search = useCallback(async (searchFn: (q: string) => Promise<T[]>) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const data = await searchFn(query);
      setResults(data);
    } catch (err: any) {
      setError(err.message || '搜索失败');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    search,
    clearSearch,
    hasResults: results.length > 0,
  };
}

/**
 * Hook: 文件上传表单
 */
export function useFileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const selectFiles = useCallback((selectedFiles: FileList | File[], maxFiles: number = 5) => {
    const fileArray = Array.from(selectedFiles).slice(0, maxFiles);

    setFiles(fileArray);

    // 生成预览
    const newPreviews: string[] = [];
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === fileArray.length) {
            setPreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    setError(null);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setPreviews([]);
    setError(null);
    setProgress(0);
  }, []);

  const upload = useCallback(
    async (
      uploadFn: (files: File[], onProgress?: (progress: number) => void) => Promise<any>
    ) => {
      if (files.length === 0) {
        setError('请选择文件');
        return null;
      }

      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        const result = await uploadFn(files, setProgress);
        setProgress(100);
        return result;
      } catch (err: any) {
        setError(err.message || '上传失败');
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [files]
  );

  return {
    files,
    previews,
    isUploading,
    error,
    progress,
    selectFiles,
    removeFile,
    clearFiles,
    upload,
    hasFiles: files.length > 0,
  };
}

/**
 * Hook: 多步骤表单
 */
export function useMultiStepForm<T extends Record<string, any>>(
  steps: Array<keyof T>,
  initialValues: T
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentStepKey = steps[currentStep];

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  }, [steps.length]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return {
    currentStep,
    currentStepKey,
    values,
    errors,
    completedSteps,
    isFirstStep,
    isLastStep,
    progress,
    setValue,
    goToStep,
    nextStep,
    prevStep,
    setErrors,
    setValues,
  };
}
