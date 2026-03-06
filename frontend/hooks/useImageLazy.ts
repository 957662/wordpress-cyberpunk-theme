import { useState, useEffect, useRef } from 'react';

interface UseImageLazyOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseImageLazyReturn {
  ref: React.RefObject<HTMLImageElement>;
  isLoaded: boolean;
  isError: boolean;
}

export function useImageLazy(
  src: string,
  options: UseImageLazyOptions = {}
): UseImageLazyReturn {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  useEffect(() => {
    if (!shouldLoad || !src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setIsLoaded(true);
      setIsError(false);
    };

    img.onerror = () => {
      setIsError(true);
      setIsLoaded(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [shouldLoad, src]);

  return {
    ref: imgRef,
    isLoaded,
    isError,
  };
}

interface UseImageLazyWithSrcReturn extends UseImageLazyReturn {
  imgSrc: string;
}

export function useImageLazyWithSrc(
  src: string,
  placeholder?: string,
  options?: UseImageLazyOptions
): UseImageLazyWithSrcReturn {
  const { ref, isLoaded, isError } = useImageLazy(src, options);

  const imgSrc = isLoaded ? src : placeholder || '';

  return {
    ref,
    isLoaded,
    isError,
    imgSrc,
  };
}
