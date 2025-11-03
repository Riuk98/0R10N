import React, { useState } from 'react';
import { useAppContext, User } from '../context/AppContext';

// Fondo artesanal: sol, colinas y grano sutil
const CountrysideBackdrop = () => (
    <div className="hg-backdrop" aria-hidden="true">
        <div className="hg-backdrop__sun" />
        <div className="hg-backdrop__hill hg-backdrop__hill--near" />
        <div className="hg-backdrop__hill hg-backdrop__hill--far" />
        <div className="hg-backdrop__grain" />
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
    <div className="hg-field">
        <label htmlFor={id} className="hg-label">{label}</label>
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`hg-input${error ? ' hg-input--error' : ''}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && (
            <p id={`${id}-error`} className="hg-error" role="alert">{error}</p>
        )}
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
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

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
        authMode === 'login' ? (
            <div className="hg-card hg-card--single hg-card--glass hg-animate-in">
                <div className="hg-card__panel hg-card__panel--brand">
                    <div className="hg-brand">
                        <div className="hg-badge">Desde 1984</div>
                        <h2 className="hg-brand__title">Bienvenido de nuevo</h2>
                        <p className="hg-brand__copy">Ingresa para seguir disfrutando de productos elaborados con dedicación artesanal.</p>
                    </div>
                </div>
                <div className="hg-card__panel hg-card__panel--forms">
                    <div className="hg-form-block">
                        <h3 className="hg-section">Clientes registrados</h3>
                        <form onSubmit={handleLoginSubmit} noValidate>
                            <Input id="email" label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" value={loginData.email} onChange={handleLoginChange} error={errors.email} />
                            <Input id="password" label="Contraseña" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={loginData.password} onChange={handleLoginChange} error={errors.password} />
                            <div className="hg-row">
                                <label className="hg-check">
                                    <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                                    <span>Mostrar contraseña</span>
                                </label>
                                <button type="button" className="hg-link" onClick={() => { setView('forgotPassword'); setErrors({}); }}>¿Olvidaste tu contraseña?</button>
                            </div>
                            {errors.form && <p className="hg-error hg-error--center">{errors.form}</p>}
                            <button type="submit" disabled={isLoading} className="hg-btn hg-btn--primary" aria-busy={isLoading}>
                                {isLoading ? 'Iniciando sesión…' : 'Iniciar sesión'}
                            </button>
                        </form>
                        <p className="hg-muted hg-center" style={{ marginTop: 10 }}>
                            ¿No tienes cuenta? <button className="hg-link" type="button" onClick={() => { setErrors({}); setAuthMode('register'); }}>Regístrate</button>
                        </p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="hg-card hg-card--single hg-card--glass hg-animate-in">
                <div className="hg-card__panel hg-card__panel--brand">
                    <div className="hg-brand">
                        <div className="hg-badge">Hecho con dedicación</div>
                        <h2 className="hg-brand__title">Crea tu cuenta</h2>
                        <p className="hg-brand__copy">Accede a beneficios, pedidos rápidos y experiencias de temporada.</p>
                    </div>
                </div>
                <div className="hg-card__panel hg-card__panel--forms">
                    <div className="hg-form-block">
                        <h3 className="hg-section">Nuevos clientes</h3>
                        <form onSubmit={handleRegisterSubmit} noValidate>
                            <div className="hg-grid-2">
                                <Input id="nombres" label="Nombres" type="text" placeholder="María" value={registerData.nombres} onChange={handleRegisterChange} error={errors.nombres} />
                                <Input id="apellidos" label="Apellidos" type="text" placeholder="González" value={registerData.apellidos} onChange={handleRegisterChange} error={errors.apellidos} />
                            </div>
                            <Input id="email" label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" value={registerData.email} onChange={handleRegisterChange} error={errors.email} />
                            <Input id="telefono" label="Teléfono de contacto" type="tel" placeholder="3101234567" value={registerData.telefono} onChange={handleRegisterChange} error={errors.telefono} />
                            <div className="hg-grid-2">
                                <Input id="password" label="Contraseña" type="password" placeholder="••••••••" value={registerData.password} onChange={handleRegisterChange} error={errors.password} />
                                <Input id="confirmPassword" label="Confirmar contraseña" type="password" placeholder="••••••••" value={registerData.confirmPassword} onChange={handleRegisterChange} error={errors.confirmPassword} />
                            </div>
                            <button type="submit" disabled={isLoading} className="hg-btn hg-btn--accent" aria-busy={isLoading}>
                                {isLoading ? 'Registrando…' : 'Regístrate'}
                            </button>
                        </form>
                        <p className="hg-muted hg-center" style={{ marginTop: 10 }}>
                            ¿Ya tienes cuenta? <button className="hg-link" type="button" onClick={() => { setErrors({}); setAuthMode('login'); }}>Inicia sesión</button>
                        </p>
                    </div>
                </div>
            </div>
        )
    );
    
    const renderForgotPasswordView = () => (
        <div className="hg-modal">
            <h2 className="hg-modal__title">Recuperar contraseña</h2>
            <p className="hg-muted hg-center">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
            <form onSubmit={handleForgotPasswordSubmit} noValidate>
                <Input id="email" label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" value={forgotPasswordEmail} onChange={(e) => setForgotPasswordEmail(e.target.value)} error={errors.email} />
                <button type="submit" className="hg-btn hg-btn--primary">Enviar correo</button>
                <button type="button" onClick={() => { setView('main'); setErrors({}); }} className="hg-link hg-link--block">Volver a iniciar sesión</button>
            </form>
        </div>
    );
    
    const renderNewPasswordView = () => (
        <div className="hg-modal">
            <h2 className="hg-modal__title">Nueva contraseña</h2>
            <form onSubmit={handleNewPasswordSubmit} noValidate>
                <Input id="newPassword" label="Nueva contraseña" type="password" placeholder="••••••••" value={newPasswordData.newPassword} onChange={(e) => setNewPasswordData({ ...newPasswordData, newPassword: e.target.value })} error={errors.newPassword} />
                <Input id="confirmNewPassword" label="Confirmar nueva contraseña" type="password" placeholder="••••••••" value={newPasswordData.confirmNewPassword} onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmNewPassword: e.target.value })} error={errors.confirmNewPassword} />
                {errors.form && <p className="hg-error hg-error--center">{errors.form}</p>}
                <button type="submit" className="hg-btn hg-btn--primary">Enviar</button>
            </form>
        </div>
    );

    return (
        <div className="hg-auth">
            <CountrysideBackdrop />
            {notification && (
                <div className="hg-toast" role="status" aria-live="polite">{notification}</div>
            )}
            <div className="hg-stage">
                {view === 'main' && renderMainView()}
                {view === 'forgotPassword' && renderForgotPasswordView()}
                {view === 'newPassword' && renderNewPasswordView()}
            </div>
            <style>{`
                .hg-auth {
                    position: relative;
                    min-height: calc(100vh - 160px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 48px 16px;
                    overflow: hidden;
                }
                .hg-stage {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    max-width: 1100px;
                    display: flex;
                    justify-content: center;
                }
                /* Backdrop */
                .hg-backdrop {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    pointer-events: none;
                }
                .hg-backdrop__sun {
                    position: absolute;
                    width: 520px;
                    height: 520px;
                    left: -120px;
                    top: -160px;
                    background: radial-gradient(circle at 60% 50%, rgba(217,184,20,0.35), rgba(217,165,11,0.15) 45%, rgba(217,165,11,0.05) 70%, transparent 75%);
                    filter: blur(2px);
                    border-radius: 50%;
                }
                .hg-backdrop__hill {
                    position: absolute;
                    left: -10%;
                    right: -10%;
                    height: 38%;
                    bottom: -8%;
                    background: linear-gradient(180deg, rgba(89,67,2,0.15), rgba(89,67,2,0.28));
                    border-top-left-radius: 50% 100%;
                    border-top-right-radius: 50% 100%;
                }
                .hg-backdrop__hill--far { transform: translateY(18px) scale(1.08); opacity: 0.65; }
                .hg-backdrop__hill--near { transform: translateY(0); opacity: 0.9; }
                .hg-backdrop__grain {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(transparent 96%, rgba(0,0,0,0.02) 100%),
                        radial-gradient(rgba(0,0,0,0.02) 1px, transparent 1px);
                    background-size: 100% 6px, 6px 6px;
                    mix-blend-mode: multiply;
                    opacity: 0.6;
                }
                /* Card */
                .hg-card {
                    display: grid;
                    grid-template-columns: 1.1fr 1.4fr;
                    gap: 0;
                    width: 100%;
                    border-radius: 18px;
                    overflow: hidden;
                    position: relative;
                }
                .hg-card--glass {
                    background: linear-gradient(135deg, rgba(255,255,255,0.42), rgba(255,255,255,0.24));
                    border: 1px solid rgba(255,255,255,0.35);
                    box-shadow: 0 20px 50px rgba(64,52,52,0.18), inset 0 1px 0 rgba(255,255,255,0.4);
                    backdrop-filter: saturate(120%) blur(14px);
                    -webkit-backdrop-filter: saturate(120%) blur(14px);
                }
                .hg-animate-in { animation: hg-pop-in 320ms cubic-bezier(.2,.7,.2,1) both; }
                @keyframes hg-pop-in {
                    0% { opacity: 0; transform: translateY(10px) scale(0.985); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .hg-card__panel { padding: 28px; }
                .hg-card__panel--brand {
                    background: linear-gradient(180deg, rgba(217,184,20,0.22), rgba(217,165,11,0.10));
                    position: relative;
                }
                .hg-card__panel--forms { background: rgba(255,255,255,0.65); }
                .hg-brand {
                    max-width: 420px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 16px;
                }
                .hg-badge {
                    display: inline-block;
                    align-self: flex-start;
                    padding: 6px 10px;
                    border-radius: 999px;
                    background: rgba(89,67,2,0.08);
                    color: var(--color-secondary);
                    font-weight: 600;
                    font-size: 12px;
                    letter-spacing: 0.4px;
                }
                .hg-brand__title {
                    margin: 0;
                    font-size: 28px;
                    line-height: 1.2;
                    color: var(--color-dark);
                    text-wrap: balance;
                }
                .hg-brand__copy { color: var(--color-text); margin: 0; opacity: 0.9; }
                .hg-brand__list { margin: 6px 0 0; padding-left: 18px; color: var(--color-secondary); }
                .hg-brand__list li { margin: 6px 0; }
                /* Forms */
                .hg-form-block { padding: 12px 8px; }
                .hg-section { margin: 0 0 12px; font-size: 20px; color: var(--color-dark); }
                .hg-muted { color: rgba(64,52,52,0.75); margin: 0 0 12px; font-size: 14px; }
                .hg-center { text-align: center; }
                .hg-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .hg-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 6px 0 12px; }
                .hg-check { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; color: var(--color-text); }
                .hg-check input { width: 16px; height: 16px; accent-color: var(--color-secondary); }
                .hg-link { background: none; border: none; color: var(--color-secondary); font-weight: 600; cursor: pointer; padding: 0; }
                .hg-link:hover { color: var(--color-accent); }
                .hg-link--block { display: block; width: 100%; text-align: center; margin-top: 10px; }
                .hg-divider { height: 1px; background: rgba(64,52,52,0.08); margin: 8px 0; }
                /* Fields */
                .hg-field { margin-bottom: 10px; }
                .hg-label { display: block; font-weight: 700; font-size: 13px; color: var(--color-dark); margin-bottom: 6px; }
                .hg-input {
                    width: 100%;
                    padding: 12px 14px;
                    border: 1px solid rgba(64,52,52,0.22);
                    border-radius: 10px;
                    background: #fff;
                    color: #424242;
                    outline: none;
                    transition: box-shadow 180ms ease, border-color 180ms ease, transform 120ms ease;
                }
                .hg-input::placeholder { color: #bcbcbc; }
                .hg-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(217,184,20,0.25); }
                .hg-input--error { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.15); }
                .hg-error { color: #b91c1c; font-size: 12px; margin: 4px 0 0; }
                .hg-error--center { text-align: center; margin-bottom: 8px; }
                /* Buttons */
                .hg-btn {
                    width: 100%;
                    padding: 12px 16px;
                    border-radius: 999px;
                    border: none;
                    font-weight: 700;
                    color: var(--color-dark);
                    cursor: pointer;
                    transition: transform 120ms ease, box-shadow 180ms ease, background 180ms ease, opacity 180ms ease;
                    box-shadow: 0 8px 16px rgba(64,52,52,0.08);
                }
                .hg-btn:active { transform: translateY(1px); }
                .hg-btn[disabled] { opacity: 0.6; cursor: progress; }
                .hg-btn--primary { background: var(--color-primary); }
                .hg-btn--primary:hover { background: var(--color-accent); }
                .hg-btn--accent { background: linear-gradient(90deg, var(--color-primary), var(--color-accent)); }
                .hg-btn--accent:hover { filter: brightness(1.02); }
                /* Modal */
                .hg-modal {
                    width: 100%;
                    max-width: 520px;
                    background: #fff;
                    border-radius: 16px;
                    padding: 26px;
                    box-shadow: 0 20px 50px rgba(64,52,52,0.18);
                }
                .hg-modal__title { margin: 0 0 6px; font-size: 22px; color: var(--color-dark); text-align: center; }
                /* Toast */
                .hg-toast {
                    position: fixed;
                    top: 18px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #effaf0;
                    color: #166534;
                    border: 1px solid #bbf7d0;
                    padding: 10px 14px;
                    border-radius: 10px;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.08);
                    z-index: 5;
                    animation: hg-fade 4800ms ease-in-out forwards;
                }
                @keyframes hg-fade {
                    0% { opacity: 0; transform: translate(-50%, -8px); }
                    10% { opacity: 1; transform: translate(-50%, 0); }
                    90% { opacity: 1; transform: translate(-50%, 0); }
                    100% { opacity: 0; transform: translate(-50%, -8px); }
                }
                /* Responsive */
                @media (max-width: 960px) {
                    .hg-card { grid-template-columns: 1fr; }
                    .hg-card__panel { padding: 22px; }
                    .hg-grid-2 { grid-template-columns: 1fr; }
                    .hg-brand { max-width: none; }
                }
            `}</style>
        </div>
    );
};

export default LoginRegister;
