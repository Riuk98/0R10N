
import React, { useState, useEffect, useMemo } from 'react';

interface PreloaderProps {
    onLoadingComplete: () => void;
}

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
        }, 150); 

        return () => clearInterval(timer);
    }, [onLoadingComplete]);

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
            `}</style>
            <div className="preloader-container">
                <svg className="background-canvas" viewBox="0 0 450 600" preserveAspectRatio="xMidYMid meet">
                    {/* Constellation elements have been removed */}
                </svg>

                <div className="content-overlay">
                    <img 
                        src="https://i.postimg.cc/TYmLPPGk/Generated-Image-October-17-2025-12-49-AM-2.png"
                        alt="Orion ERP Logo"
                        className="w-full mx-auto mb-8 animate-pulse drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]"
                    />
                    <div className="w-full max-w-sm bg-gray-400/50 rounded-full h-2.5">
                        <div 
                            className="bg-white h-2.5 rounded-full transition-all duration-150 ease-linear" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrionPreloader;