import { useRef, useEffect } from 'react';

/**
 * 弹簧动画 Hook
 * @param targetValue 目标值
 * @param stiffness 刚度
 * @param damping 阻尼
 */
export function useSpring(
  targetValue: number,
  stiffness: number = 100,
  damping: number = 10
): number {
  const valueRef = useRef(targetValue);
  const velocityRef = useRef(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      const currentValue = valueRef.current;
      const currentVelocity = velocityRef.current;

      const springForce = (targetValue - currentValue) * stiffness * 0.01;
      const dampingForce = -currentVelocity * damping * 0.1;

      const acceleration = springForce + dampingForce;
      const newVelocity = currentVelocity + acceleration;
      const newValue = currentValue + newVelocity;

      valueRef.current = newValue;
      velocityRef.current = newVelocity;

      // 如果接近目标值且速度很小，停止动画
      if (
        Math.abs(targetValue - newValue) < 0.001 &&
        Math.abs(newVelocity) < 0.001
      ) {
        valueRef.current = targetValue;
        velocityRef.current = 0;
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, stiffness, damping]);

  return valueRef.current;
}
