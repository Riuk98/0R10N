import React, { useState } from 'react';
import { useAppContext, User } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, User as UserIcon, ArrowLeft, Loader2, Globe } from 'lucide-react';

const LoginRegister: React.FC = () => {
    const { login, registerUser } = useAppContext();

    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        nombres: '', apellidos: '', email: '', telefono: '', password: '', confirmPassword: ''
    });
    
    const [errors, setErrors] = useState<any>({});
    const [notification, setNotification] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };
    
    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const showNotificationMsg = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 5000);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: any = {};
        if (!loginData.email) newErrors.email = "Campo Obligatorio";
        if (!loginData.password) newErrors.password = "Campo Obligatorio";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});
        try {
            const result = await login(loginData);
            if (!result.success) {
                setErrors({ form: result.message });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: any = {};
        Object.entries(registerData).forEach(([key, value]) => {
            if (!value && key !== 'telefono') newErrors[key] = "Campo Obligatorio";
        });
        
        if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        const newUser: User = {
            firstName: registerData.nombres,
            lastName: registerData.apellidos,
            email: registerData.email,
            phone: registerData.telefono,
            password: registerData.password,
        };

        try {
            const result = await registerUser(newUser);
            if (result.success) {
                showNotificationMsg("Su perfil se ha registrado exitosamente");
                setAuthMode('login');
            } else {
                setErrors({ form: result.message });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[var(--color-bg-main)] flex items-center justify-center p-6 md:p-12 font-sans relative">
            {notification && (
                <motion.div 
                    initial={{ opacity: 0, y: -20, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -20, x: '-50%' }}
                    className="fixed top-24 left-1/2 z-[2001] bg-[var(--color-dark)] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 text-sm font-medium tracking-wide"
                >
                    {notification}
                </motion.div>
            )}

            {/* Main Container */}
            <div className="relative w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] min-h-[650px] md:min-h-[700px] lg:min-h-[80vh] bg-white rounded-[32px] md:rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col md:flex-row transform transition-all duration-500 my-8">
                
                {/* Forms Area */}
                <div className="relative w-full flex-1 min-h-[650px] md:min-h-full">
                    
                    {/* Sign Up Section */}
                    <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full transition-all duration-700 ease-in-out ${authMode === 'register' ? 'md:translate-x-full opacity-100 z-[5] animate-[move_0.6s]' : 'opacity-0 z-[1] pointer-events-none'}`}>
                        <form onSubmit={handleRegisterSubmit} className="bg-white flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 min-h-full w-full text-center py-12">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-dark)] mb-3 leading-tight tracking-tight">Crear Cuenta</h1>
                                <div className="flex justify-center gap-4 mb-6">
                                    <button type="button" className="w-11 h-11 border border-stone-200 rounded-2xl flex items-center justify-center hover:bg-stone-50 hover:border-[var(--color-primary)] transition-all duration-300"><Mail size={18} className="text-stone-600" /></button>
                                    <button type="button" className="w-11 h-11 border border-stone-200 rounded-2xl flex items-center justify-center hover:bg-stone-50 hover:border-[var(--color-primary)] transition-all duration-300"><Globe size={18} className="text-stone-600" /></button>
                                </div>
                                <span className="text-[10px] text-stone-400 mb-6 block uppercase tracking-[0.2em] font-semibold">Regístrate con tu email</span>
                            </motion.div>
                            
                            <div className="w-full flex flex-col gap-3 max-w-sm">
                                <div className="relative group">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={16} />
                                    <input 
                                        type="text" name="nombres" placeholder="Nombre completo" 
                                        className="w-full bg-[var(--color-bg-soft)] border-2 border-transparent py-3 pl-12 pr-4 text-sm rounded-2xl focus:bg-white focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-all duration-300"
                                        value={registerData.nombres} onChange={handleRegisterChange}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input 
                                        type="tel" name="telefono" placeholder="WhatsApp" 
                                        className="bg-[var(--color-bg-soft)] border-2 border-transparent py-3 px-5 text-sm rounded-2xl focus:bg-white focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-all duration-300"
                                        value={registerData.telefono} onChange={handleRegisterChange}
                                    />
                                    <input 
                                        type="email" name="email" placeholder="Email institucional" 
                                        className="bg-[var(--color-bg-soft)] border-2 border-transparent py-3 px-5 text-sm rounded-2xl focus:bg-white focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-all duration-300"
                                        value={registerData.email} onChange={handleRegisterChange}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input 
                                        type="password" name="password" placeholder="Contraseña" 
                                        className="bg-[var(--color-bg-soft)] border-2 border-transparent py-3 px-5 text-sm rounded-2xl focus:bg-white focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-all duration-300"
                                        value={registerData.password} onChange={handleRegisterChange}
                                    />
                                    <input 
                                        type="password" name="confirmPassword" placeholder="Confirmar" 
                                        className="bg-[var(--color-bg-soft)] border-2 border-transparent py-3 px-5 text-sm rounded-2xl focus:bg-white focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-all duration-300"
                                        value={registerData.confirmPassword} onChange={handleRegisterChange}
                                    />
                                </div>
                            </div>

                            {errors.form && <p className="text-red-500 text-[11px] mt-4 font-semibold bg-red-50 py-2 px-4 rounded-lg">{errors.form}</p>}
                            
                            <button 
                                type="submit" disabled={isLoading}
                                className="w-full max-w-xs bg-[var(--color-primary)] text-[var(--color-secondary)] text-xs font-bold py-4 px-12 rounded-2xl uppercase tracking-[0.15em] mt-8 hover:bg-[var(--color-accent)] transition-all active:scale-[0.98] shadow-xl shadow-[var(--color-primary)]/20 flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                                Crear Cuenta
                            </button>
                        </form>
                    </div>

                    {/* Sign In Section */}
                    <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full transition-all duration-700 ease-in-out ${authMode === 'register' ? 'md:translate-x-full opacity-0 pointer-events-none' : 'z-[2] opacity-100'}`}>
                        <form onSubmit={handleLoginSubmit} className="bg-white flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 min-h-full w-full text-center py-12">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-dark)] mb-3 tracking-tight">Iniciar Sesión</h1>
                                <div className="flex justify-center gap-4 mb-6">
                                    <button type="button" className="w-11 h-11 border border-stone-200 rounded-2xl flex items-center justify-center hover:bg-stone-50 hover:border-[var(--color-primary)] transition-all duration-300"><Mail size={18} className="text-stone-600" /></button>
                                    <button type="button" className="w-11 h-11 border border-stone-200 rounded-2xl flex items-center justify-center hover:bg-stone-50 hover:border-[var(--color-primary)] transition-all duration-300"><Globe size={18} className="text-stone-600" /></button>
                                </div>
                                <span className="text-[10px] text-stone-400 mb-8 block uppercase tracking-[0.2em] font-semibold">Usa tus credenciales</span>
                            </motion.div>
                            
                            <div className="w-full flex flex-col gap-4 max-w-xs">
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[var(--color-secondary)] transition-colors" size={16} />
                                    <input 
                                        type="email" name="email" placeholder="Correo electrónico" 
                                        className="w-full bg-[var(--color-bg-soft)] border-2 border-transparent py-4 pl-12 pr-4 text-sm rounded-2xl focus:bg-white focus:border-[var(--color-secondary)] focus:ring-0 outline-none transition-all duration-300"
                                        value={loginData.email} onChange={handleLoginChange}
                                    />
                                </div>
                                <div className="relative group">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[var(--color-secondary)] transition-colors" size={16} />
                                    <input 
                                        type="password" name="password" placeholder="Contraseña de acceso" 
                                        className="w-full bg-[var(--color-bg-soft)] border-2 border-transparent py-4 pl-12 pr-4 text-sm rounded-2xl focus:bg-white focus:border-[var(--color-secondary)] focus:ring-0 outline-none transition-all duration-300"
                                        value={loginData.password} onChange={handleLoginChange}
                                    />
                                </div>
                            </div>
                            
                            <a href="#" className="text-stone-400 text-[11px] mt-6 hover:text-[var(--color-secondary)] transition-colors font-medium border-b border-transparent hover:border-stone-300 pb-0.5">¿Olvidaste tu contraseña?</a>

                            {errors.form && <p className="text-red-500 text-[11px] mt-4 font-semibold bg-red-50 py-2 px-4 rounded-lg">{errors.form}</p>}
                            
                            <button 
                                type="submit" disabled={isLoading}
                                className="w-full max-w-xs bg-[var(--color-secondary)] text-white text-xs font-bold py-4 px-12 rounded-2xl uppercase tracking-[0.15em] mt-8 hover:bg-[var(--color-dark)] transition-all active:scale-[0.98] shadow-xl shadow-[var(--color-secondary)]/20 flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                                Entrar Ahora
                            </button>
                        </form>
                    </div>

                </div>

                {/* Toggle Overlay Container */}
                <div className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-[100] ${authMode === 'register' ? '-translate-x-full rounded-r-[60px] md:rounded-r-[120px]' : 'rounded-l-[60px] md:rounded-l-[120px]'}`}>
                    <div className={`bg-gradient-to-br from-[var(--color-secondary)] via-[#3e2e21] to-[var(--color-dark)] text-white relative left-[-100%] h-full w-[200%] transition-all duration-700 ease-in-out ${authMode === 'register' ? 'translate-x-1/2' : 'translate-x-0'}`}>
                        {/* Grain effect overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
                        
                        <div className="absolute top-0 h-full w-full flex">
                            
                            {/* Toggle Left Panel */}
                            <div className={`absolute top-0 h-full w-1/2 flex flex-col items-center justify-center px-16 text-center transition-all duration-700 ${authMode === 'register' ? 'translate-x-0' : '-translate-x-[200%]'}`}>
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="mb-8"
                                >
                                    <img src="https://i.postimg.cc/kDrPRRWy/Gemini-Generated-Image-s055fas055fas055.png" alt="Hato Grande" className="h-32 md:h-40 transition-all duration-300" />
                                </motion.div>
                                <h1 className="text-4xl font-bold mb-6 tracking-tight">¡Bienvenido!</h1>
                                <p className="text-sm text-stone-300 leading-[1.8] mb-10 font-light max-w-xs">Ingresa con tus datos personales para acceder a todas las funciones y beneficios de nuestra tienda artesanal.</p>
                                <button 
                                    onClick={() => setAuthMode('login')}
                                    className="bg-transparent border-2 border-white/40 text-white text-[11px] font-bold py-4 px-14 rounded-2xl uppercase tracking-[0.2em] hover:bg-white hover:text-[var(--color-secondary)] hover:border-white transition-all duration-500 active:scale-95"
                                >
                                    Iniciar Sesión
                                </button>
                            </div>

                            {/* Toggle Right Panel */}
                            <div className={`absolute top-0 right-0 h-full w-1/2 flex flex-col items-center justify-center px-16 text-center transition-all duration-700 ${authMode === 'register' ? 'translate-x-[200%]' : 'translate-x-0'}`}>
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="mb-8"
                                >
                                    <img src="https://i.postimg.cc/MZVdPpF7/Generated-Image-October-20-2025-3-45-PM-1.png" alt="Hato Grande" className="h-32 md:h-40 transition-all duration-300" />
                                </motion.div>
                                <h1 className="text-4xl font-bold mb-6 tracking-tight">Crea tu Perfil</h1>
                                <p className="text-sm text-stone-300 leading-[1.8] mb-10 font-light max-w-xs">Sé parte de Hato Grande y disfruta de los lácteos más frescos del llano directamente en tu mesa.</p>
                                <button 
                                    onClick={() => setAuthMode('register')}
                                    className="bg-transparent border-2 border-white/40 text-white text-[11px] font-bold py-4 px-14 rounded-2xl uppercase tracking-[0.2em] hover:bg-white hover:text-[var(--color-secondary)] hover:border-white transition-all duration-500 active:scale-95"
                                >
                                    Registrarme
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Mobile version simple toggle button (visible only on small screens) */}
                <div className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-[101] w-full px-8">
                     <button 
                        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                        className="w-full bg-[var(--color-bg-soft)] backdrop-blur-md text-[var(--color-secondary)] text-[10px] font-bold py-4 px-6 rounded-2xl uppercase tracking-widest border border-[var(--color-secondary)]/10 shadow-lg"
                    >
                        {authMode === 'login' ? '¿Sin cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Entra aquí'}
                    </button>
                </div>

            </div>

            {/* Background Details */}
            <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-[var(--color-primary)] opacity-[0.04] rounded-full blur-[120px] translate-x-1/3 -translate-y-1/2 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 -z-10 w-[800px] h-[800px] bg-[var(--color-secondary)] opacity-[0.04] rounded-full blur-[120px] -translate-x-1/3 translate-y-1/2 pointer-events-none"></div>
        </div>
    );
};

export default LoginRegister;
