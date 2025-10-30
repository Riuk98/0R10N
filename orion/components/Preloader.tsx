
import React, { useState, useEffect, useMemo } from 'react';

interface PreloaderProps {
    onLoadingComplete: () => void;
}

interface Point {
    x: number;
    y: number;
}

interface PathSegment {
    d: string;
    length: number;
}

// --- Constellation Data ---
// Coordinates extracted from the user-provided image.
const constellationPoints: Point[] = [
    { x: 111, y: 31 }, { x: 149, y: 31 }, { x: 127, y: 91 },
    { x: 109, y: 153 }, { x: 93, y: 241 }, { x: 187, y: 215 },
    { x: 117, y: 325 }, { x: 223, y: 311 }, { x: 103, y: 443 },
    { x: 183, y: 417 }, { x: 225, y: 487 }, { x: 143, y: 531 },
    { x: 219, y: 551 }, { x: 339, y: 199 }, { x: 365, y: 217 },
    { x: 373, y: 247 }, { x: 353, y: 279 }, { x: 333, y: 301 },
];

// Defines which points (by index) are connected by lines to form the constellation.
const constellationLines: number[][] = [
    [0, 2], [1, 2], [2, 3], [3, 4], [4, 6], [4, 5], [5, 7],
    [6, 7], [6, 9], [6, 8], [7, 9], [7, 10], [8, 11], [9, 10],
    [10, 12], [11, 12], [5, 13], [13, 14], [14, 15], [15, 16], [16, 17]
];


const OrionPreloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress >= 100) {
                    clearInterval(timer);
                    onLoadingComplete();
                    return 100;
                }
                return prevProgress + 1;
            });
        }, 60); 

        return () => clearInterval(timer);
    }, [onLoadingComplete]);


    // Memoize path calculations to avoid re-computing on every render.
    const { pathSegments, totalPathString } = useMemo(() => {
        const segments: PathSegment[] = [];
        let totalPath = ''; // Path for the light beam animation

        constellationLines.forEach((line) => {
            const p1 = constellationPoints[line[0]];
            const p2 = constellationPoints[line[1]];
            if (!p1 || !p2) return;

            const d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
            const length = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
            segments.push({ d, length });
            
            // Append segment to the total path for the light beam.
            // Using a move 'M' command makes the beam "jump" to the start of the next segment.
            totalPath += ` M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
        });
        
        return { pathSegments: segments, totalPathString: totalPath.trim() };
    }, []);
    
    const animationDuration = 0.15; // seconds per segment
    const totalAnimationTime = pathSegments.length * animationDuration;

    return (
        <>
            <style>{`
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
                    max-width: 20rem; /* Corresponds to max-w-xs */
                    text-align: center;
                }
                .background-canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                }
                .node-point {
                    fill: #143e88;
                    filter: url(#node-glow);
                }
                .line-segment {
                    stroke: rgba(20, 62, 136, 0.8);
                    stroke-width: 1;
                    stroke-linecap: round;
                    animation: draw-line ${animationDuration}s linear forwards;
                }
                @keyframes draw-line {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                .light-beam {
                    fill: #18bedb;
                    stroke: #18bedb;
                    stroke-width: 1;
                    filter: url(#beam-glow);
                    animation: beam-fade-in 0.5s linear forwards;
                    animation-delay: ${totalAnimationTime}s;
                    opacity: 0;
                }
                 @keyframes beam-fade-in {
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
            <div className="preloader-container">
                <svg className="background-canvas" viewBox="0 0 450 600" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
                            <feFlood flood-color="#18bedb" flood-opacity="1" result="flood"/>
                            <feComposite in="flood" in2="blur" operator="in" result="glow"/>
                            <feMerge>
                                <feMergeNode in="glow"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                         <filter id="beam-glow" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur"/>
                            <feFlood flood-color="#18bedb" flood-opacity="1" result="flood"/>
                            <feComposite in="flood" in2="blur" operator="in" result="glow"/>
                            <feMerge>
                                <feMergeNode in="glow"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <g transform="translate(20, 20)">
                        {/* Lines with sequential drawing animation */}
                        {pathSegments.map((segment, index) => (
                            <path
                                key={index}
                                className="line-segment"
                                d={segment.d}
                                strokeDasharray={segment.length}
                                strokeDashoffset={segment.length}
                                style={{ animationDelay: `${index * animationDuration}s` }}
                            />
                        ))}

                        {/* Nodes (Stars) */}
                        {constellationPoints.map((p, i) => (
                            <circle key={i} cx={p.x} cy={p.y} r="4" className="node-point" />
                        ))}
                        
                        {/* Light Beam Animation */}
                        {totalPathString && (
                            <circle cx="0" cy="0" r="5" className="light-beam">
                                <animateMotion
                                    dur={`${totalAnimationTime + 2}s`}
                                    begin={`${totalAnimationTime}s`}
                                    repeatCount="indefinite"
                                    path={totalPathString}
                                />
                            </circle>
                        )}
                    </g>
                </svg>

                <div className="content-overlay">
                    <img 
                        src="https://i.postimg.cc/TYmLPPGk/Generated-Image-October-17-2025-12-49-AM-2.png"
                        alt="Orion ERP Logo"
                        className="w-full mx-auto mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(20,62,136,0.7)]"
                    />
                    <div className="w-full max-w-sm bg-gray-400/50 rounded-full h-2.5">
                        <div 
                            className="bg-[#143e88] h-2.5 rounded-full transition-all duration-150 ease-linear" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrionPreloader;
