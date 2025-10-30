import React, { useState, useEffect } from 'react';

interface LoginProps {
    onLoginSuccess: () => void;
}

// Type for a single ripple
interface Ripple {
    key: number;
    top: number;
    left: number;
}

const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
            }, 15000); // Duration matches the CSS animation
        }, 3000); // Create a ripple every 1 second

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // The empty dependency array ensures this effect runs only once


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulating validation with a 2-second delay for UX
        setTimeout(() => {
            if (username === 'admin' && password === 'admin') {
                onLoginSuccess();
            } else {
                setError('Usuario o contraseña incorrectos.');
            }
            setIsLoading(false);
        }, 2000);
    };

     return (
        <>
            <style>{`
                .ripple-effect {
                    position: absolute;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: ripple-animation 15s linear;
                    box-shadow: 0 0 8px #97b3e9, inset 0 0 8px #97b3e9;
                }

                @keyframes ripple-animation {
                    0% {
                        width: 0;
                        height: 0;
                        opacity: 0.65;
                    }
                    90% {
                        width: 4500px;
                        height: 4500px;
                        opacity: 0.1;
                    }
                    100% {
                        width: 4500px;
                        height: 4500px;
                        opacity: 0;
                    }
                }
            `}</style>
            <div
                className="h-screen w-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#fffafa] to-[#a7d9f2] relative overflow-hidden"
            >
                 {ripples.map(ripple => (
                    <span
                        key={ripple.key}
                        className="ripple-effect"
                        style={{ left: ripple.left, top: ripple.top }}
                    />
                ))}

                <div className="w-full max-w-xs z-10" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white/20 backdrop-blur-[10px] rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] pt-3 px-6 pb-6 space-y-4 border border-white/30">
                        <div className="text-center">
                            <img 
                                src="https://i.postimg.cc/TYmLPPGk/Generated-Image-October-17-2025-12-49-AM-2.png"
                                alt="Orion ERP Logo"
                                className="w-full mx-auto mb-3"
                            />
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-[#143e88] block mb-2" htmlFor="username">
                                    Usuario
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#fffafa] text-[#143e88] placeholder-gray-400 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#18bedb] focus:border-[#18bedb] outline-none transition"
                                    placeholder="p. ej. admin"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[#143e88] block mb-2" htmlFor="password">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#fffafa] text-[#143e88] placeholder-gray-400 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#18bedb] focus:border-[#18bedb] outline-none transition"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            
                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#18bedb] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#14a3c2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18bedb] focus:ring-offset-gray-900 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait"
                            >
                                {isLoading ? (
                                    <>
                                        <SpinnerIcon />
                                        <span>Validando...</span>
                                    </>
                                ) : (
                                    'Iniciar sesión'
                                )}
                            </button>
                        </form>

                        
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;