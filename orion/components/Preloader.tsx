
import React, { useState, useEffect, useMemo } from 'react';

interface PreloaderProps {
    onLoadingComplete: () => void;
}

const constellationData = {
    nodes: [
        { id: 'star-1', cx: 100, cy: 150, r: 3 },
        { id: 'star-2', cx: 200, cy: 100, r: 2.5 },
        { id: 'star-3', cx: 350, cy: 180, r: 3.5 },
        { id: 'star-4', cx: 150, cy: 300, r: 2 },
        { id: 'star-5', cx: 300, cy: 400, r: 3 },
        { id: 'star-6', cx: 120, cy: 450, r: 2.5 },
        { id: 'star-7', cx: 400, cy: 350, r: 2 },
    ],
    lines: [
        { from: 'star-1', to: 'star-2', len: 111 },
        { from: 'star-1', to: 'star-4', len: 158 },
        { from: 'star-2', to: 'star-3', len: 170 },
        { from: 'star-3', to: 'star-7', len: 180 },
        { from: 'star-4', to: 'star-5', len: 180 },
        { from: 'star-4', to: 'star-6', len: 153 },
        { from: 'star-5', to: 'star-6', len: 185 },
        { from: 'star-5', to: 'star-7', len: 111 },
    ]
};

const OrionPreloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress >= 100) {
                    clearInterval(timer);
                    // Add a small delay before calling onLoadingComplete to let the animation finish
                    setTimeout(onLoadingComplete, 300);
                    return 100;
                }
                return prevProgress + 1;
            });
        }, 50); 

        return () => clearInterval(timer);
    }, [onLoadingComplete]);

    const lineElements = useMemo(() => {
        const nodeMap = new Map(constellationData.nodes.map(n => [n.id, n]));
        return constellationData.lines.map((line, index) => {
            const fromNode = nodeMap.get(line.from);
            const toNode = nodeMap.get(line.to);
            if (!fromNode || !toNode) return null;
            return (
                <line
                    key={index}
                    className="star-line"
                    x1={fromNode.cx}
                    y1={fromNode.cy}
                    x2={toNode.cx}
                    y2={toNode.cy}
                    stroke="white"
                    strokeWidth="0.5"
                    strokeDasharray={line.len}
                    strokeDashoffset={line.len}
                    style={{ animationDelay: `${0.8 + index * 0.15}s` }}
                />
            );
        });
    }, []);

    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.2); opacity: 1; }
                }

                @keyframes drawLine {
                    to { stroke-dashoffset: 0; }
                }

                .preloader-container {
                    position: relative;
                    height: 100vh;
                    width: 100vw;
                    background-image: linear-gradient(to bottom right, #051d40, #042940, #005C53);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    overflow: hidden;
                }
                .content-overlay {
                    z-index: 10;
                    width: 100%;
                    max-width: 20rem; 
                    text-align: center;
                    opacity: 0;
                    animation: fadeIn 1s ease-in-out forwards;
                    animation-delay: 2.2s; /* Delay until constellation is drawn */
                }
                .background-canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                }
                .star-node {
                    opacity: 0;
                    transform-origin: center;
                    animation: fadeIn 0.5s forwards, pulse 3s infinite ease-in-out;
                }
                .star-line {
                    animation: drawLine 1s forwards ease-out;
                }
            `}</style>
            <div className="preloader-container">
                <svg className="background-canvas" viewBox="0 0 450 600" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    
                    {/* Render Lines */}
                    {lineElements}
                    
                    {/* Render Stars */}
                    {constellationData.nodes.map((node, index) => (
                        <circle
                            key={node.id}
                            id={node.id}
                            className="star-node"
                            cx={node.cx}
                            cy={node.cy}
                            r={node.r}
                            fill="white"
                            filter="url(#node-glow)"
                            style={{ animationDelay: `${index * 0.15}s, ${index * 0.2}s` }}
                        />
                    ))}
                </svg>

                <div className="content-overlay">
                    <img 
                        src="https://i.postimg.cc/TYmLPPGk/Generated-Image-October-17-2025-12-49-AM-2.png"
                        alt="Orion ERP Logo"
                        className="w-full mx-auto mb-8 drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]"
                    />
                    <div className="w-full max-w-sm bg-white/20 rounded-full h-2.5">
                        <div 
                            className="bg-white h-2.5 rounded-full shadow-[0_0_10px_white]" 
                            style={{ 
                                width: `${progress}%`,
                                transition: `width 0.15s ${progress > 1 ? 'linear' : 'ease-out'}`
                             }}
                        ></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrionPreloader;
