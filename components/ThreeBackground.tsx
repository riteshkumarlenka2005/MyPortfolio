import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Floating geometric shape component
const FloatingShape: React.FC<{
    position: [number, number, number];
    color: string;
    speed?: number;
    rotationSpeed?: number;
    shape?: 'box' | 'octahedron' | 'torus' | 'icosahedron';
}> = ({ position, color, speed = 1, rotationSpeed = 0.5, shape = 'octahedron' }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.002 * rotationSpeed;
            meshRef.current.rotation.y += 0.003 * rotationSpeed;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
        }
    });

    const geometry = useMemo(() => {
        switch (shape) {
            case 'box': return <boxGeometry args={[1, 1, 1]} />;
            case 'torus': return <torusGeometry args={[0.5, 0.2, 16, 32]} />;
            case 'icosahedron': return <icosahedronGeometry args={[0.6, 0]} />;
            default: return <octahedronGeometry args={[0.6, 0]} />;
        }
    }, [shape]);

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position}>
                {geometry}
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={0.15}
                    wireframe
                />
            </mesh>
        </Float>
    );
};

// Particle field component
const ParticleField: React.FC<{ count?: number }> = ({ count = 200 }) => {
    const points = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.elapsedTime * 0.02;
            points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.025}
                color="#ffffff"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
};

// Main 3D Scene
const Scene: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
    const primaryColor = '#d4a574'; // Dark theme default

    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            <pointLight position={[-10, -10, -5]} intensity={0.3} color={primaryColor} />

            {/* Particle field - reduced on mobile */}
            <ParticleField count={isMobile ? 60 : 200} />

            {/* Stars background - reduced on mobile */}
            <Stars
                radius={50}
                depth={50}
                count={isMobile ? 300 : 1000}
                factor={4}
                saturation={0}
                fade
                speed={0.5}
            />
        </>
    );
};

// Exported 3D Background component
export const ThreeBackground: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                style={{ background: 'transparent' }}
                gl={{ alpha: true, antialias: !isMobile }}
                dpr={isMobile ? 1 : undefined}
            >
                <Scene isMobile={isMobile} />
            </Canvas>
        </div>
    );
};

