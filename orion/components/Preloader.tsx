import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface PreloaderProps {
    onLoadingComplete: () => void;
}

// --- Keyframes ---
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// --- Styled Components ---
const PreloaderContainer = styled.div`
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom right, #e0f2fe, #7dd3fc);
    z-index: 9999;
    overflow: hidden;
`;

const Canvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`;

const Logo = styled.img`
    width: 100%;
    max-width: 250px;
    animation: ${fadeIn} 1.2s ease-out forwards;
    z-index: 10;
    filter: drop-shadow(0 0 1.5rem rgba(0, 0, 0, 0.4));
`;

const LoadingContainer = styled.div`
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    z-index: 10;
    animation: ${fadeIn} 1.2s ease-out forwards;
    animation-delay: 0.2s;
    opacity: 0;
`;

const PercentageText = styled.p`
    font-size: 1.5rem;
    font-weight: 700;
    color: #042940;
    letter-spacing: 0.1em;
`;

const SpinningGear = styled.div`
    width: 2rem;
    height: 2rem;
    color: #042940;
    animation: ${spin} 2s linear infinite;
`;

// --- SVG Icon ---
const GearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm7.43-2.53l1.49-1.49c.2-.2.2-.51 0-.71l-1.42-1.42c-.2-.2-.51-.2-.71 0l-1.95 1.95c-.4-.28-.85-.48-1.34-.6V7.25c0-.28-.22-.5-.5-.5h-2c-.28 0-.5.22-.5.5v1.95c-.49.12-.94-.32-1.34.6L7.6 7.84c-.2-.2-.51-.2-.71 0L5.47 9.26c-.2.2-.2.51 0 .71l1.49 1.49c-.08.47-.16.94-.16 1.43s.08.96.16 1.43l-1.49 1.49c-.2.2-.2.51 0 .71l1.42 1.42c.2.2.51.2.71 0l1.95-1.95c.4.28.85.48 1.34.6v1.95c0 .28.22.5.5.5h2c.28 0 .5-.22.5-.5v-1.95c.49-.12.94-.32-1.34-.6l1.95 1.95c.2.2.51.2.71 0l1.42-1.42c-.2-.2.2-.51 0-.71l-1.49-1.49c.08-.47.16-.94-.16-1.43s-.08-.96-.16-1.43z"/>
    </svg>
);


// --- Particle Logic ---
class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() * 2 - 1) * 0.5;
        this.speedY = (Math.random() * 2 - 1) * 0.5;
    }

    update(canvasWidth: number, canvasHeight: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvasWidth) this.x = 0;
        else if (this.x < 0) this.x = canvasWidth;
        if (this.y > canvasHeight) this.y = 0;
        else if (this.y < 0) this.y = canvasHeight;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // FIX: Changed `ctx.fill('nonzero')` to `ctx.fill()` to resolve an argument mismatch error. The 'nonzero' fill rule is the default, so this change maintains the original behavior while fixing the compilation issue.
        ctx.fill();
    }
}


const OrionPreloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameId = useRef<number>();
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const DURATION = 4000; // Total duration in ms

        const completeTimer = setTimeout(() => {
            onLoadingComplete();
        }, DURATION + 500);

        const percentageInterval = setInterval(() => {
            setPercentage(prev => {
                const next = prev + 1;
                if (next > 100) {
                    clearInterval(percentageInterval);
                    return 100;
                }
                return next;
            });
        }, DURATION / 100);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 5000);
        particlesRef.current = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesRef.current.push(new Particle(canvas.width, canvas.height));
        }

        const connect = () => {
            const connectDistance = 80;
            let opacityValue = 1;
            for (let a = 0; a < particlesRef.current.length; a++) {
                for (let b = a; b < particlesRef.current.length; b++) {
                    const distance = Math.sqrt(
                        Math.pow(particlesRef.current[a].x - particlesRef.current[b].x, 2) +
                        Math.pow(particlesRef.current[a].y - particlesRef.current[b].y, 2)
                    );

                    if (distance < connectDistance) {
                        opacityValue = 1 - (distance / connectDistance);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesRef.current[a].x, particlesRef.current[a].y);
                        ctx.lineTo(particlesRef.current[b].x, particlesRef.current[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const particle of particlesRef.current) {
                particle.update(canvas.width, canvas.height);
                particle.draw(ctx);
            }
            connect();
            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                const newNumberOfParticles = Math.floor((canvas.width * canvas.height) / 5000);
                particlesRef.current = [];
                 for (let i = 0; i < newNumberOfParticles; i++) {
                    particlesRef.current.push(new Particle(canvas.width, canvas.height));
                }
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(completeTimer);
            clearInterval(percentageInterval);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [onLoadingComplete]);

    return (
        <PreloaderContainer>
            <Canvas ref={canvasRef} />
            <Logo 
                src="https://i.postimg.cc/TYmLPPGk/Generated-Image-October-17-2025-12-49-AM-2.png"
                alt="Cargando Orion ERP"
            />
            <LoadingContainer>
                <PercentageText>{percentage}%</PercentageText>
                <SpinningGear>
                    <GearIcon />
                </SpinningGear>
            </LoadingContainer>
        </PreloaderContainer>
    );
};

export default OrionPreloader;
