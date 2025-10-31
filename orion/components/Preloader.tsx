
import React, { useState, useEffect, useMemo } from 'react';

interface PreloaderProps {
    onLoadingComplete: () => void;
}

// Main Orion constellation stars, positioned to fill more of the screen
const constellationData = {
    nodes: [
        { id: 'betelgeuse', cx: 100, cy: 100, r: 4 }, // Top-left shoulder
        { id: 'bellatrix', cx: 350, cy: 130, r: 4 }, // Top-right shoulder
        { id: 'alnitak', cx: 200, cy: 300, r: 4 },   // Left belt star
        { id: 'alnilam', cx: 250, cy: 320, r: 4 },     // Middle belt star
        { id: 'mintaka', cx: 300, cy: 340, r: 4 },   // Right belt star
        { id: 'saiph', cx: 120, cy: 500, r: 4 },       // Bottom-left knee
        { id: 'rigel', cx: 380, cy: 520, r: 4 },       // Bottom-right knee
    ],
    lines: [
        { from: 'betelgeuse', to: 'alnitak', len: 223 },
        { from: 'bellatrix', to: 'mintaka', len: 216 },
        { from: 'alnitak', to: 'alnilam', len: 54 },
        { from: 'alnilam', to: 'mintaka', len: 54 },
        { from: 'alnitak', to: 'saiph', len: 215 },
        { from: 'mintaka', to: 'rigel', len: 197 },
        { from: 'betelgeuse', to: 'bellatrix', len: 251 },
    ]
};

// Additional background stars for a fuller starfield effect
const backgroundStars = {
    nodes: [
        { id: 'bg-1', cx: 50, cy: 200, r: 2 },
        { id: 'bg-2', cx: 400, cy: 50, r: 2 },
        { id: 'bg-3', cx: 250, cy: 50, r: 2 },
        { id: 'bg-4', cx: 20, cy: 400, r: 2 },
        { id: 'bg-5', cx: 430, cy: 250, r: 2 },
        { id: 'bg-6', cx: 150, cy: 400, r: 2 },
        { id: 'bg-7', cx: 300, cy: 580, r: 2 },
        { id: 'bg-8', cx: 180, cy: 200, r: 2 },
        { id: 'bg-9', cx: 380, cy: 400, r: 2 },
        { id: 'bg-10', cx: 80, cy: 20, r: 2 },
        { id: 'bg-11', cx: 20, cy: 580, r: 2 },
        { id: 'bg-12', cx: 440, cy: 590, r: 2 },
    ],
    lines: [
        { from: 'bg-1', to: 'bg-4', len: 202 },
        { from: 'bg-2', to: 'bg-3', len: 150 },
        { from: 'bg-5', to: 'bellatrix', len: 144 },
        { from: 'bg-6', to: 'saiph', len: 104 },
        { from: 'bg-7', to: 'rigel', len: 100 },
        { from: 'bg-8', to: 'alnitak', len: 102 },
        { from: 'bg-9', to: 'bg-5', len: 158 },
        { from: 'bg-10', to: 'betelgeuse', len: 82 },
        { from: 'bg-11', to: 'bg-6', len: 194 },
        { from: 'bg-12', to: 'bg-7', len: 140 },
    ]
};


const GearIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const OrionPreloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress >= 100) {
                    clearInterval(timer);
                    setTimeout(onLoadingComplete, 300);
                    return 100;
                }
                return prevProgress + 1;
            });
        }, 50); 

        return () => clearInterval(timer);
    }, [onLoadingComplete]);

    const lineElements = useMemo(() => {
        const allNodes = [...constellationData.nodes, ...backgroundStars.nodes];
        const allLines = [...constellationData.lines, ...backgroundStars.lines];
        
        const nodeMap = new Map(allNodes.map(n => [n.id, n]));

        return {
            mainLines: constellationData.lines.map((line, index) => {
                const fromNode = nodeMap.get(line.from);
                const toNode = nodeMap.get(line.to);
                if (!fromNode || !toNode) return null;
                return (
                    <line
                        key={`main-${index}`}
                        className="star-line"
                        x1={fromNode.cx}
                        y1={fromNode.cy}
                        x2={toNode.cx}
                        y2={toNode.cy}
                        stroke="#042940"
                        strokeWidth="0.5"
                        strokeDasharray={line.len}
                        strokeDashoffset={line.len}
                        style={{ animationDelay: `${0.5 + index * 0.15}s` }}
                    />
                );
            }),
            backgroundLines: backgroundStars.lines.map((line, index) => {
                 const fromNode = nodeMap.get(line.from);
                const toNode = nodeMap.get(line.to);
                if (!fromNode || !toNode) return null;
                return (
                     <line
                        key={`bg-${index}`}
                        className="star-line-bg"
                        x1={fromNode.cx}
                        y1={fromNode.cy}
                        x2={toNode.cx}
                        y2={toNode.cy}
                        stroke="#042940"
                        strokeWidth="0.5"
                        strokeDasharray={line.len}
                        strokeDashoffset={line.len}
                        style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                    />
                );
            })
        };
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
                    50% { transform: scale(1.1); opacity: 1; }
                }
                 @keyframes pulse-bg {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }

                @keyframes drawLine {
                    to { stroke-dashoffset: 0; }
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .animate-spin {
                    animation: spin 1s linear infinite;
                }

                .preloader-container {
                    position: relative;
                    height: 100vh;
                    width: 100vw;
                    background-image: linear-gradient(to bottom right, #fffafa, #a7d9f2);
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
                    animation-delay: 2.5s;
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
                .star-node-bg {
                    opacity: 0;
                    transform-origin: center;
                    animation: fadeIn 0.8s forwards, pulse-bg 5s infinite ease-in-out;
                }
                .star-line {
                    animation: drawLine 1s forwards ease-out;
                }
                 .star-line-bg {
                    animation: drawLine 1.5s forwards ease-out;
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
                    {lineElements.mainLines}
                    {lineElements.backgroundLines}
                    
                    {/* Render Stars */}
                    {constellationData.nodes.map((node, index) => (
                        <circle
                            key={node.id}
                            id={node.id}
                            className="star-node"
                            cx={node.cx}
                            cy={node.cy}
                            r={node.r}
                            fill="#042940"
                            filter="url(#node-glow)"
                            style={{ animationDelay: `${index * 0.15}s, ${index * 0.2}s` }}
                        />
                    ))}
                     {backgroundStars.nodes.map((node, index) => (
                        <circle
                            key={node.id}
                            id={node.id}
                            className="star-node-bg"
                            cx={node.cx}
                            cy={node.cy}
                            r={node.r}
                            fill="#042940"
                            style={{ animationDelay: `${1.0 + index * 0.1}s, ${1.0 + index * 0.3}s` }}
                        />
                    ))}
                </svg>

                <div className="content-overlay">
                    <img 
                        src="https://i.postimg.cc/TYmLPPGk/Generated-Image-October-17-2025-12-49-AM-2.png"
                        alt="Orion ERP Logo"
                        className="w-full mx-auto mb-8 drop-shadow-[0_0_25px_rgba(4,41,64,0.6)]"
                    />
                    <div className="flex items-center justify-center gap-4 text-[#042940]">
                        <GearIcon className="w-10 h-10 animate-spin" style={{ animationDuration: '3s' }}/>
                        <span className="text-3xl font-bold tabular-nums">{progress}%</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrionPreloader;
