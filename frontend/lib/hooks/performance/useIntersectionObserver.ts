import { useState, useEffect, RefObject } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: UseIntersectionObserverProps = {}
): boolean {
  const { threshold = 0, rootMargin = '0px', root = null, freezeOnceVisible = false } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || isFrozen) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);

        if (entry.isIntersecting && freezeOnceVisible) {
          setIsFrozen(true);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, rootMargin, root, freezeOnceVisible, isFrozen]);

  return isIntersecting;
}

interface UseOnScreenProps extends UseIntersectionObserverProps {}

export function useOnScreen(
  elementRef: RefObject<Element>,
  options: UseOnScreenProps = {}
): boolean {
  return useIntersectionObserver(elementRef, options);
}

// Hook for multiple elements
export function useIntersectionObserverList(
  elementRefs: RefObject<Element>[],
  options: UseIntersectionObserverProps = {}
): boolean[] {
  const [intersections, setIntersections] = useState<boolean[]>(new Array(elementRefs.length).fill(false));

  useEffect(() => {
    const observers = elementRefs.map((ref, index) => {
      const element = ref.current;
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIntersections((prev) => {
            const newIntersections = [...prev];
            newIntersections[index] = entry.isIntersecting;
            return newIntersections;
          });
        },
        { threshold: options.threshold, rootMargin: options.rootMargin, root: options.root }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [elementRefs, options]);

  return intersections;
}
