
import React, { useState } from 'react';

// --- SVG Icons ---
const Icons = {
    User: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    Email: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
    Phone: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></svg>,
    City: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
    Location: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.274 1.765 11.842 11.842 0 00.757.433.57.57 0 00.281.14l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" /></svg>,
    Success: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

type ContactType = 'peticion' | 'reclamo' | 'sugerencia' | 'otros';

interface InputFieldProps {
    icon: React.ReactNode;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const InputField: React.FC<InputFieldProps> = ({ icon, name, placeholder, value, onChange, error }) => (
    <div className="relative mb-2">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
            type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full pl-10 pr-4 py-3 bg-transparent border-b-2 focus:outline-none transition-colors duration-300 ${error ? 'border-red-500' : 'border-gray-300 focus:border-[var(--color-secondary)]'}`}
        />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);


const Contact: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', city: '', type: '' as ContactType | '', message: '' });
    const [errors, setErrors] = useState<any>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const contactTypes: { id: ContactType, label: string }[] = [
        { id: 'peticion', label: 'Petición' },
        { id: 'reclamo', label: 'Reclamo o Queja' },
        { id: 'sugerencia', label: 'Sugerencia' },
        { id: 'otros', label: 'Otros' },
    ];

    const validate = () => {
        const newErrors: any = {};
        if (!formData.name) newErrors.name = 'El nombre es obligatorio';
        if (!formData.email) newErrors.email = 'El correo es obligatorio';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El correo no es válido';
        if (!formData.phone) newErrors.phone = 'El teléfono es obligatorio';
        if (!formData.city) newErrors.city = 'La ciudad es obligatoria';
        if (!formData.type) newErrors.type = 'Debes seleccionar un tipo de contacto';
        if (!formData.message) newErrors.message = 'El mensaje no puede estar vacío';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const newTicket = { id: `TICKET-${Date.now()}`, timestamp: new Date().toISOString(), ...formData, status: 'Abierto' };
            try {
                const existingTicketsRaw = localStorage.getItem('hatoGrandeTickets');
                const existingTickets = existingTicketsRaw ? JSON.parse(existingTicketsRaw) : [];
                localStorage.setItem('hatoGrandeTickets', JSON.stringify([...existingTickets, newTicket]));
            } catch (error) {
                console.error("Failed to save ticket to localStorage", error);
            }
            setIsSubmitted(true);
        }
    };
    
    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '', city: '', type: '', message: '' });
        setIsSubmitted(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleTypeSelect = (type: ContactType) => {
        setFormData({ ...formData, type });
        if(errors.type) setErrors({...errors, type: null});
    }

    return (
        <div className="hg-auth">
            <div className="hg-backdrop" aria-hidden="true">
                <div className="hg-backdrop__sun" />
                <div className="hg-backdrop__hill hg-backdrop__hill--near" />
                <div className="hg-backdrop__hill hg-backdrop__hill--far" />
                <div className="hg-backdrop__grain" />
            </div>
            <div className="hg-stage">
                <div className="hg-card hg-card--glass">
                    <div className="hg-card__panel hg-card__panel--brand">
                        <div className="hg-brand">
                            <div className="hg-badge">Atención cercana</div>
                            <h2 className="hg-brand__title">Contáctanos</h2>
                            <p className="hg-brand__copy">Estamos aquí para ayudarte con tus pedidos, sugerencias o soporte. Nuestro equipo te responderá con gusto.</p>
                            <div className="hg-contact-info">
                                <p><Icons.Location className="w-5 h-5" /> Finca Hato Grande, Suesca</p>
                                <p><Icons.Email className="w-5 h-5" /> ventas@hatogrande.com</p>
                                <p><Icons.Phone className="w-5 h-5" /> +57 310 123 4567</p>
                            </div>
                        </div>
                    </div>
                    <div className="hg-card__panel hg-card__panel--forms">
                        {isSubmitted ? (
                            <div className="hg-success">
                                <Icons.Success className="w-20 h-20" />
                                <h3>¡Mensaje enviado!</h3>
                                <p>Gracias por contactarnos. Te responderemos a la brevedad.</p>
                                <button onClick={resetForm} className="hg-btn hg-btn--primary" type="button">Enviar otro mensaje</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                <h3 className="hg-section">Tipo de contacto</h3>
                                <div className="hg-type-grid">
                                    {contactTypes.map(({ id, label }) => (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => handleTypeSelect(id)}
                                            className={`hg-type ${formData.type === id ? 'is-active' : ''}`}
                                        >{label}</button>
                                    ))}
                                </div>
                                {errors.type && <p className="hg-error">{errors.type}</p>}

                                <div className="hg-grid-2">
                                    <InputField icon={<Icons.User className="w-5 h-5"/>} name="name" placeholder="Nombre completo" value={formData.name} onChange={handleChange} error={errors.name} />
                                    <InputField icon={<Icons.Email className="w-5 h-5"/>} name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} error={errors.email} />
                                    <InputField icon={<Icons.Phone className="w-5 h-5"/>} name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} error={errors.phone} />
                                    <InputField icon={<Icons.City className="w-5 h-5"/>} name="city" placeholder="Ciudad" value={formData.city} onChange={handleChange} error={errors.city} />
                                </div>

                                <div className="hg-field">
                                    <label className="hg-label">Mensaje</label>
                                    <textarea
                                        name="message"
                                        rows={5}
                                        placeholder="Escribe tu mensaje aquí..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`hg-input${errors.message ? ' hg-input--error' : ''}`}
                                    ></textarea>
                                    {errors.message && <p className="hg-error">{errors.message}</p>}
                                </div>

                                <button type="submit" className="hg-btn hg-btn--accent">Enviar mensaje</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                .hg-auth { position: relative; min-height: calc(100vh - 160px); display: flex; align-items: center; justify-content: center; padding: 48px 16px; overflow: hidden; }
                .hg-stage { position: relative; z-index: 2; width: 100%; max-width: 1100px; display: flex; justify-content: center; }
                .hg-backdrop { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
                .hg-backdrop__sun { position: absolute; width: 520px; height: 520px; left: -120px; top: -160px; background: radial-gradient(circle at 60% 50%, rgba(217,184,20,0.35), rgba(217,165,11,0.15) 45%, rgba(217,165,11,0.05) 70%, transparent 75%); filter: blur(2px); border-radius: 50%; }
                .hg-backdrop__hill { position: absolute; left: -10%; right: -10%; height: 38%; bottom: -8%; background: linear-gradient(180deg, rgba(89,67,2,0.15), rgba(89,67,2,0.28)); border-top-left-radius: 50% 100%; border-top-right-radius: 50% 100%; }
                .hg-backdrop__hill--far { transform: translateY(18px) scale(1.08); opacity: 0.65; }
                .hg-backdrop__hill--near { transform: translateY(0); opacity: 0.9; }
                .hg-backdrop__grain { position: absolute; inset: 0; background-image: linear-gradient(transparent 96%, rgba(0,0,0,0.02) 100%), radial-gradient(rgba(0,0,0,0.02) 1px, transparent 1px); background-size: 100% 6px, 6px 6px; mix-blend-mode: multiply; opacity: 0.6; }
                .hg-card { display: grid; grid-template-columns: 1.1fr 1.4fr; width: 100%; gap: 0; border-radius: 18px; overflow: hidden; position: relative; }
                .hg-card--glass { background: linear-gradient(135deg, rgba(255,255,255,0.42), rgba(255,255,255,0.24)); border: 1px solid rgba(255,255,255,0.35); box-shadow: 0 20px 50px rgba(64,52,52,0.18), inset 0 1px 0 rgba(255,255,255,0.4); backdrop-filter: saturate(120%) blur(14px); -webkit-backdrop-filter: saturate(120%) blur(14px); }
                .hg-card__panel { padding: 28px; }
                .hg-card__panel--brand { background: linear-gradient(180deg, rgba(217,184,20,0.22), rgba(217,165,11,0.10)); }
                .hg-card__panel--forms { background: rgba(255,255,255,0.65); }
                .hg-brand { max-width: 420px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 16px; }
                .hg-badge { display: inline-block; align-self: flex-start; padding: 6px 10px; border-radius: 999px; background: rgba(89,67,2,0.08); color: var(--color-secondary); font-weight: 600; font-size: 12px; letter-spacing: 0.4px; }
                .hg-brand__title { margin: 0; font-size: 28px; line-height: 1.2; color: var(--color-dark); }
                .hg-brand__copy { color: var(--color-text); margin: 0; opacity: 0.9; }
                .hg-contact-info { margin-top: 6px; color: var(--color-secondary); }
                .hg-contact-info p { display: flex; align-items: center; gap: 8px; margin: 6px 0; }
                .hg-section { margin: 0 0 12px; font-size: 20px; color: var(--color-dark); }
                .hg-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .hg-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
                .hg-type { padding: 10px 12px; border-radius: 10px; border: 2px solid rgba(64,52,52,0.18); background: rgba(255,255,255,0.6); font-weight: 700; color: var(--color-text); cursor: pointer; }
                .hg-type.is-active { background: var(--color-primary); color: var(--color-dark); border-color: var(--color-primary); }
                .hg-field { margin: 10px 0; }
                .hg-label { display: block; font-weight: 700; font-size: 13px; color: var(--color-dark); margin-bottom: 6px; }
                .hg-input { width: 100%; padding: 12px 14px; border: 1px solid rgba(64,52,52,0.22); border-radius: 10px; background: #fff; color: #424242; outline: none; transition: box-shadow 180ms ease, border-color 180ms ease; }
                .hg-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(217,184,20,0.25); }
                .hg-input--error { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.15); }
                .hg-error { color: #b91c1c; font-size: 12px; margin: 4px 0 0; }
                .hg-btn { width: 100%; padding: 12px 16px; border-radius: 999px; border: none; font-weight: 700; color: var(--color-dark); cursor: pointer; transition: transform 120ms ease, box-shadow 180ms ease, background 180ms ease; box-shadow: 0 8px 16px rgba(64,52,52,0.08); margin-top: 12px; }
                .hg-btn--primary { background: var(--color-primary); }
                .hg-btn--primary:hover { background: var(--color-accent); }
                .hg-btn--accent { background: linear-gradient(90deg, var(--color-primary), var(--color-accent)); }
                .hg-btn--accent:hover { filter: brightness(1.02); }
                .hg-success { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
                @media (max-width: 960px) { .hg-card { grid-template-columns: 1fr; } .hg-grid-2, .hg-type-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default Contact;
