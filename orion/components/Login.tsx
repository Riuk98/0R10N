

import React, { useState, useEffect } from 'react';
// Refactored Login Component
import { INTERNAL_USERS, OrionUser } from '../data/internalUsers';
import { ShieldAlert, User, Lock, ArrowRight, ShieldCheck, Database, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [registeredUsers, setRegisteredUsers] = useState<OrionUser[]>([]);

    useEffect(() => {
        const ORION_USERS_STORAGE_KEY = 'orionInternalUsers';
        try {
            const storedUsers = localStorage.getItem(ORION_USERS_STORAGE_KEY);
            if (storedUsers) {
                setRegisteredUsers(JSON.parse(storedUsers));
            } else {
                setRegisteredUsers(INTERNAL_USERS);
            }
        } catch (error) {
            console.error("Failed to load Orion users", error);
            setRegisteredUsers(INTERNAL_USERS);
        }
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            const foundUser = registeredUsers.find(
                user => user.username === username && user.password === password
            );

            if (foundUser) {
                sessionStorage.setItem('orionCurrentUser', JSON.stringify(foundUser));
                onLoginSuccess();
            } else {
                setError('Credenciales de acceso inválidas. Revisa tu usuario y contraseña.');
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex bg-slate-50 font-sans">
            {/* Left Panel: Branding & ERP Info */}
            <div className="hidden lg:flex w-1/2 bg-[#051d40] relative overflow-hidden flex-col justify-between p-16">
                {/* Flat Geometric Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-[40px] border-[#18bedb]"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 border-[20px] border-[#143e88] rotate-45"></div>
                    {/* Grid Pattern */}
                     <div 
                        className="absolute inset-0 z-0" 
                        style={{
                            backgroundImage: 'radial-gradient(#143e88 1.5px, transparent 1.5px)',
                            backgroundSize: '32px 32px'
                        }}
                    ></div>
                </div>

                <div className="relative z-10">
                    <img 
                        src="https://i.postimg.cc/TYmLPPGk/Generated-Image-October-17-2025-12-49-AM-2.png"
                        alt="Orion ERP Logo"
                        className="w-48 mb-12 drop-shadow-2xl brightness-0 invert" 
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
                            Gestión Inteligente <br />
                            <span className="text-[#18bedb]">Resultados Precisos.</span>
                        </h1>
                        <p className="text-blue-100 text-lg max-w-md font-light leading-relaxed">
                            Orion ERP centraliza tus operaciones, desde finanzas hasta control de inventario, en una plataforma unificada, rápida y segura.
                        </p>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative z-10 flex gap-8 border-t border-blue-800/50 pt-8"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#143e88] rounded-lg text-[#18bedb]">
                            <Database size={20} />
                        </div>
                        <span className="text-blue-200 text-sm font-medium">Datos Unificados</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#143e88] rounded-lg text-[#18bedb]">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-blue-200 text-sm font-medium">Acceso Seguro</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#143e88] rounded-lg text-[#18bedb]">
                            <LayoutDashboard size={20} />
                        </div>
                        <span className="text-blue-200 text-sm font-medium">Control Total</span>
                    </div>
                </motion.div>
            </div>

            {/* Right Panel: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10 lg:hidden text-center">
                        <div className="bg-[#051d40] p-4 rounded-2xl inline-block mb-6 shadow-xl">
                            <img 
                                src="https://i.postimg.cc/GmV0YBtQ/Diseno-sin-titulo.png"
                                alt="Orion ERP Logo"
                                className="h-12 brightness-0 invert" 
                            />
                        </div>
                        <h2 className="text-3xl font-extrabold text-[#051d40] tracking-tight">Acceso Seguro</h2>
                    </div>

                    <div className="mb-10 hidden lg:block">
                        <h2 className="text-4xl font-extrabold text-[#051d40] tracking-tight mb-2">Bienvenido</h2>
                        <p className="text-slate-500 font-medium">Inicia sesión en tu panel corporativo.</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 rounded-r-lg">
                                    <ShieldAlert className="text-red-500 shrink-0" size={20} />
                                    <p className="text-sm font-bold text-red-800">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#051d40] tracking-wide uppercase" htmlFor="username">
                                Código de Usuario
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <User size={18} />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-[#051d40] placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-[#18bedb] transition-colors font-medium"
                                    placeholder="ej. 1098824484"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#051d40] tracking-wide uppercase" htmlFor="password">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-[#051d40] placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-[#18bedb] transition-colors font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-[#143e88] hover:bg-[#051d40] text-white py-4 px-8 rounded-xl font-bold tracking-wide transition-all active:scale-[0.98] disabled:opacity-80 disabled:cursor-wait group mt-8 shadow-xl shadow-blue-900/10"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Accediendo al Sistema...</span>
                                </>
                            ) : (
                                <>
                                    <span>Ingresar al Portal</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-12 pt-6 border-t border-slate-200 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-2">
                            <ShieldCheck size={14} /> Protegido por Orion Security &reg;
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;