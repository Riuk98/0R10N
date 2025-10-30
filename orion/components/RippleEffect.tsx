
import React, { useState, useEffect } from 'react';

// Type for a single ripple
interface Ripple {
    key: number;
    top: number;
    left: number;
}

interface RippleEffectProps {
    color?: string;
    duration?: number;
    size?: number;
    interval?: number;
}

const RippleEffect: React.FC<RippleEffectProps> = ({
    color = '#97b3e9',
    duration = 15, // in seconds
    size = 4500, // in pixels
    interval = 4000, // in milliseconds
}) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newRipple = {
                key: Date.now(),
                left: window.innerWidth / 2,
                top: window.innerHeight / 2,
            };

            setRipples(prevRipples => [...prevRipples, newRipple]);

            // Clean up the ripple from the state after the animation is done
            setTimeout(() => {
                setRipples(currentRipples => currentRipples.filter(r => r.key !== newRipple.key));
            }, duration * 1000); // Duration matches the CSS animation
        }, interval); // Create a ripple every `interval` ms

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [duration, interval]); // Re-run effect if duration or interval changes

    return (
        <>
            <style>{`
                .ripple-effect {
                    position: absolute;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation-name: ripple-animation;
                    animation-timing-function: linear;
                    /* Dynamically set from props */
                    box-shadow: 0 0 25px ${color}, inset 0 0 25px ${color};
                    animation-duration: ${duration}s;
                }

                @keyframes ripple-animation {
                    0% {
                        width: 0;
                        height: 0;
                        opacity: 0.65;
                    }
                    90% {
                        width: ${size}px;
                        height: ${size}px;
                        opacity: 0.1;
                    }
                    100% {
                        width: ${size}px;
                        height: ${size}px;
                        opacity: 0;
                    }
                }
            `}</style>
            {ripples.map(ripple => (
                <span
                    key={ripple.key}
                    className="ripple-effect"
                    style={{ left: ripple.left, top: ripple.top }}
                />
            ))}
        </>
    );
};

export default RippleEffect;
