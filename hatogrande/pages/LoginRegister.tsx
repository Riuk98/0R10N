import React, { useState } from 'react';
import { useAppContext, User } from '../context/AppContext';

// Helper component for animated background squares
const AnimatedSquares = () => (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
        {[...Array(5)].map((_, i) => {
            const size = Math.floor(Math.random() * 150) + 50;
            const duration = Math.floor(Math.random() * 20) + 15;
            const delay = Math.floor(Math.random() * 10);
            const left = Math.floor(Math.random() * 100);
            
            return (
                <div
                    key={i}
                    className="absolute bg-[var(--color-primary)] opacity-10"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${left}%`,
                        animation: `moveUpDown ${duration}s linear ${delay}s infinite`,
                    }}
                ></div>
            );
        })}
        <style>{`
            @keyframes moveUpDown {
                0% { top: -200px; transform: rotate(0deg); }
                100% { top: 110%; transform: rotate(360deg); }
            }
        `}</style>
    </div>
);


// Reusable Input Component
interface InputProps {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const Input: React.FC<InputProps> = ({ id, label, type, placeholder, value, onChange, error }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-bold text-[var(--color-dark)] mb-2">
            {label}
        </label>
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-[#DEDEDE] text-gray-700 ${
                error ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-[var(--color-primary)]'
            }`}
        />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);

// Main Component
const LoginRegister: React.FC = () => {
    const { login, registerUser } = useAppContext();

    // State for different views
    const [view, setView] = useState<'main' | 'forgotPassword' | 'newPassword'>('main');
    
    // Form States
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        nombres: '', apellidos: '', email: '', telefono: '', password: '', confirmPassword: ''
    });
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [newPasswordData, setNewPasswordData] = useState({ newPassword: '', confirmNewPassword: '' });

    // UI States
    const [errors, setErrors] = useState<any>({});
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Handlers for input changes
    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };
    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    // Generic notification handler
    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 5000);
    };
    
    // Form Submission Handlers
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
                showNotification("Su perfil se ha registrado exitosamente");
            } else {
                setErrors({ email: result.message });
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleForgotPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotPasswordEmail) {
            setErrors({ email: "Campo Obligatorio" });
            return;
        }
        setErrors({});
        // Mock check - in a real app, you'd check against your user database
        const isRegistered = true; // Replace with actual check
        if (isRegistered) {
            showNotification("Te enviaremos un correo electronico para que puedas recuperar tu contraseña");
            setTimeout(() => setView('newPassword'), 1000);
        } else {
            showNotification("Este correo no esta registrado, verifica tus datos o registrate para continuar.");
        }
    };

    const handleNewPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: any = {};
        if (!newPasswordData.newPassword) newErrors.newPassword = "Campo Obligatorio";
        if (!newPasswordData.confirmNewPassword) newErrors.confirmNewPassword = "Campo Obligatorio";
        
        if (newPasswordData.newPassword && newPasswordData.newPassword !== newPasswordData.confirmNewPassword) {
            newErrors.form = "Las contraseñas no coinciden, por favor intentelo nuevamente.";
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setErrors({});
        showNotification("Su contraseña se ha actualizado correctamente");
        setTimeout(() => setView('main'), 1000);
    };
    
    // View Renderers
    const renderMainView = () => (
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 shadow-2xl rounded-lg overflow-hidden bg-white">
            {/* Left side: Login */}
            <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-center text-[var(--color-dark)] mb-8">Clientes Registrados</h2>
                <form onSubmit={handleLoginSubmit} noValidate>
                    <Input id="email" label="Correo electrónico" type="email" placeholder="correo electrónico" value={loginData.email} onChange={handleLoginChange} error={errors.email} />
                    <div className="relative">
                       <Input id="password" label="Contraseña" type={showPassword ? 'text' : 'password'} placeholder="contraseña" value={loginData.password} onChange={handleLoginChange} error={errors.password} />
                    </div>
                    <div className="flex items-center justify-between mb-6 text-sm flex-wrap gap-2">
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="mr-2 h-4 w-4 rounded border-gray-300 text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]" />
                            Mostrar contraseña
                        </label>
                         <button type="button" onClick={() => { setView('forgotPassword'); setErrors({}); }} className="font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)]">
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                    {errors.form && <p className="text-red-600 text-sm text-center mb-4">{errors.form}</p>}
                    <button type="submit" disabled={isLoading} className="w-full py-3 px-4 font-bold rounded-lg text-[var(--color-dark)] bg-[var(--color-primary)] hover:bg-[var(--color-accent)] transition-colors disabled:opacity-50 disabled:cursor-wait">
                        {isLoading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
                    </button>
                </form>
            </div>
            {/* Right side: Register */}
            <div className="p-8 md:p-12 bg-gray-50 border-l border-gray-200">
                 <h2 className="text-3xl font-bold text-center text-[var(--color-dark)] mb-4">Nuevos Clientes</h2>
                 <p className="text-center text-sm text-[var(--color-text)] mb-6">Llena el siguiente formulario para crear un perfil y aprovechar de ventajas increíbles:</p>
                 <form onSubmit={handleRegisterSubmit} noValidate>
                    <div className="grid sm:grid-cols-2 gap-x-4">
                        <Input id="nombres" label="Nombres" type="text" placeholder="Nombres" value={registerData.nombres} onChange={handleRegisterChange} error={errors.nombres} />
                        <Input id="apellidos" label="Apellidos" type="text" placeholder="Apellidos" value={registerData.apellidos} onChange={handleRegisterChange} error={errors.apellidos} />
                    </div>
                    <Input id="email" label="Correo electronico" type="email" placeholder="correo@ejemplo.com" value={registerData.email} onChange={handleRegisterChange} error={errors.email} />
                    <Input id="telefono" label="Telefono de contacto" type="tel" placeholder="3101234567" value={registerData.telefono} onChange={handleRegisterChange} error={errors.telefono} />
                    <Input id="password" label="Contraseña" type="password" placeholder="contraseña" value={registerData.password} onChange={handleRegisterChange} error={errors.password} />
                    <Input id="confirmPassword" label="Confirmar contraseña" type="password" placeholder="contraseña" value={registerData.confirmPassword} onChange={handleRegisterChange} error={errors.confirmPassword} />
                    
                    <button type="submit" disabled={isLoading} className="w-full py-3 mt-2 px-4 font-bold rounded-lg text-[var(--color-dark)] bg-[var(--color-primary)] hover:bg-[var(--color-accent)] transition-colors disabled:opacity-50 disabled:cursor-wait">
                         {isLoading ? 'REGISTRANDO...' : 'REGISTRATE'}
                    </button>
                 </form>
            </div>
        </div>
    );
    
    const renderForgotPasswordView = () => (
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg">
            <h2 className="text-center text-2xl font-bold text-[var(--color-dark)]">Recuperar contraseña</h2>
            <p className="mt-2 text-center text-sm text-[var(--color-text)] mb-6">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            <form onSubmit={handleForgotPasswordSubmit} noValidate>
                 <Input id="email" label="Correo electrónico" type="email" placeholder="correo electrónico" value={forgotPasswordEmail} onChange={(e) => setForgotPasswordEmail(e.target.value)} error={errors.email} />
                 <button type="submit" className="w-full py-3 mt-2 px-4 font-bold rounded-lg text-[var(--color-dark)] bg-[var(--color-primary)] hover:bg-[var(--color-accent)] transition-colors">
                    Enviar correo
                </button>
                <button type="button" onClick={() => { setView('main'); setErrors({}); }} className="mt-4 w-full text-center text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)]">
                    Volver a Iniciar Sesión
                </button>
            </form>
        </div>
    );
    
    const renderNewPasswordView = () => (
         <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg">
            <h2 className="text-center text-2xl font-bold text-[var(--color-dark)] mb-6">Nueva contraseña</h2>
            <form onSubmit={handleNewPasswordSubmit} noValidate>
                 <Input id="newPassword" label="Nueva contraseña" type="password" placeholder="contraseña" value={newPasswordData.newPassword} onChange={(e) => setNewPasswordData({...newPasswordData, newPassword: e.target.value})} error={errors.newPassword} />
                 <Input id="confirmNewPassword" label="Confirmar nueva contraseña" type="password" placeholder="contraseña" value={newPasswordData.confirmNewPassword} onChange={(e) => setNewPasswordData({...newPasswordData, confirmNewPassword: e.target.value})} error={errors.confirmNewPassword} />
                 
                 {errors.form && <p className="text-red-600 text-sm text-center mb-4">{errors.form}</p>}
                 
                 <button type="submit" className="w-full py-3 mt-2 px-4 font-bold rounded-lg text-[var(--color-dark)] bg-[var(--color-primary)] hover:bg-[var(--color-accent)] transition-colors">
                    Enviar
                </button>
            </form>
        </div>
    );

    return (
        <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <AnimatedSquares />
            
            {notification && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-20 animate-fadeInOut" role="alert">
                    <span className="block sm:inline">{notification}</span>
                     <style>{`
                        @keyframes fadeInOut {
                            0% { opacity: 0; transform: translate(-50%, -20px); }
                            10% { opacity: 1; transform: translate(-50%, 0); }
                            90% { opacity: 1; transform: translate(-50%, 0); }
                            100% { opacity: 0; transform: translate(-50%, -20px); }
                        }
                        .animate-fadeInOut {
                            animation: fadeInOut 5s ease-in-out forwards;
                        }
                    `}</style>
                </div>
            )}
            
            <div className="relative z-10 w-full flex justify-center">
                 {view === 'main' && renderMainView()}
                 {view === 'forgotPassword' && renderForgotPasswordView()}
                 {view === 'newPassword' && renderNewPasswordView()}
            </div>
        </div>
    );
};

export default LoginRegister;
