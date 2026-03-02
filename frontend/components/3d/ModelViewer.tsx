/**
 * 3D模型查看器组件
 * 支持多种3D格式，交互式查看，动画控制
 */

'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, useGLTF, useAnimations } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Box,
  Download
} from 'lucide-react';

export interface ModelViewerProps {
  modelUrl?: string;
  autoRotate?: boolean;
  showControls?: boolean;
  showEnvironment?: boolean;
  backgroundColor?: string;
  className?: string;
}

// 默认3D立方体组件
function DefaultCube() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#06b6d4"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

// 3D模型加载器
function Model({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const action = actions[Object.keys(actions)[0]];
      action?.play();
    }
  }, [actions]);

  return <primitive ref={group} object={scene} />;
}

// 3D场景
function Scene({
  modelUrl,
  autoRotate = true,
  showEnvironment = true
}: {
  modelUrl?: string;
  autoRotate?: boolean;
  showEnvironment?: boolean;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />

      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={2}
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
      />

      {showEnvironment && (
        <Environment preset="city" />
      )}

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      <Suspense fallback={<DefaultCube />}>
        {modelUrl ? <Model url={modelUrl} /> : <DefaultCube />}
      </Suspense>

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  );
}

export function ModelViewer({
  modelUrl,
  autoRotate = true,
  showControls = true,
  showEnvironment = true,
  backgroundColor = '#0f172a',
  className
}: ModelViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(2);

  const handleReset = () => {
    // 重置相机位置
    const event = new CustomEvent('reset-camera');
    window.dispatchEvent(event);
  };

  const handleDownload = () => {
    if (modelUrl) {
      const link = document.createElement('a');
      link.href = modelUrl;
      link.download = '3d-model.glb';
      link.click();
    }
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
      style={{ backgroundColor }}
    >
      {/* 3D画布 */}
      <div className="w-full h-full min-h-[400px]">
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          <Scene
            modelUrl={modelUrl}
            autoRotate={autoRotate && isPlaying}
            showEnvironment={showEnvironment}
          />
        </Canvas>
      </div>

      {/* 控制面板 */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4"
        >
          {/* 播放控制 */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              leftIcon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            >
              {isPlaying ? '暂停' : '播放'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              重置
            </Button>
          </div>

          {/* 速度控制 */}
          <div className="flex items-center gap-2 px-3 py-2 bg-cyber-card/80 backdrop-blur rounded-lg">
            <span className="text-xs text-cyber-muted">速度</span>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-xs text-cyber-muted w-8">{rotationSpeed.toFixed(1)}x</span>
          </div>

          {/* 其他操作 */}
          <div className="flex items-center gap-2">
            {modelUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                leftIcon={<Download className="w-4 h-4" />}
              >
                下载
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              leftIcon={isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            />
          </div>
        </motion.div>
      )}

      {/* 模型信息 */}
      {modelUrl && (
        <div className="absolute top-4 left-4 px-3 py-2 bg-cyber-card/80 backdrop-blur rounded-lg">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-cyber-cyan" />
            <span className="text-xs text-cyber-muted">3D模型</span>
          </div>
        </div>
      )}
    </Card>
  );
}
