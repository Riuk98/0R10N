import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Mail, Phone, Send, CheckCircle2, User, Landmark, MessageSquare, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

type ContactType = 'peticion' | 'reclamo' | 'sugerencia' | 'otros';

interface InputFieldProps {
    icon: React.ReactNode;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ icon, name, placeholder, value, onChange, error, type = 'text' }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                {icon}
            </span>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all shadow-sm ${error ? 'border-red-500' : ''}`}
            />
        </div>
        {error && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider ml-1">{error}</p>}
    </div>
);

const Contact: React.FC = () => {
    const { navigateTo } = useAppContext();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', city: '', type: '' as ContactType | '', message: '' });
    const [errors, setErrors] = useState<any>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const contactTypes: { id: ContactType, label: string }[] = [
        { id: 'peticion', label: 'Petición' },
        { id: 'reclamo', label: 'Reclamo' },
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
        if (!formData.type) newErrors.type = 'Selecciona un motivo';
        if (!formData.message) newErrors.message = 'Escribe tu mensaje';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const newTicket = { 
                id: `TICKET-${Date.now()}`, 
                timestamp: new Date().toISOString(), 
                ...formData, 
                status: 'Abierto' 
            };
            try {
                const existingTicketsRaw = localStorage.getItem('hatoGrandeTickets');
                const existingTickets = existingTicketsRaw ? JSON.parse(existingTicketsRaw) : [];
                localStorage.setItem('hatoGrandeTickets', JSON.stringify([...existingTickets, newTicket]));
            } catch (error) {
                console.error("Failed to save ticket", error);
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
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };
    
    return (
        <div 
            className="min-h-screen font-sans text-[#403434] overflow-x-hidden"
            style={{ 
                backgroundImage: `linear-gradient(rgba(255, 254, 249, 0.95), rgba(255, 254, 249, 0.95)), url('https://i.postimg.cc/YCdXmj2h/front-view-delicious-fresh-cheese.jpg')`,
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Content Section */}
            <section className="py-16 md:py-24 px-6 sm:px-12 lg:px-24 w-full">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Left Side: Info */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-10">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 mb-6"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Atención Directa</span>
                            </motion.div>
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-bold text-[var(--color-dark)] leading-tight tracking-tight mb-6"
                            >
                                Estamos aquí <br /> para escucharte
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-500 text-lg font-light leading-relaxed"
                            >
                                ¿Tienes dudas sobre nuestros productos o un pedido en curso? Nuestro equipo está listo para brindarte el mejor soporte.
                            </motion.p>
                        </div>

                        <div className="flex flex-col gap-6">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-start gap-5 group"
                            >
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform text-[var(--color-secondary)]">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--color-dark)] mb-1">Ubicación</h4>
                                    <p className="text-gray-500 font-light italic">Finca Hato Grande, Suesca - Cundinamarca</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-start gap-5 group"
                            >
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform text-[var(--color-secondary)]">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--color-dark)] mb-1">Correo Electrónico</h4>
                                    <p className="text-gray-500 font-light italic">contacto@hatogrande.com</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-start gap-5 group"
                            >
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform text-[var(--color-secondary)]">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--color-dark)] mb-1">WhatsApp Soporte</h4>
                                    <p className="text-gray-500 font-light italic">+57 310 123 4567</p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 italic text-gray-400 text-sm">
                            Horario de atención: Lunes a Viernes de 8:00 AM a 6:00 PM.
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="w-full lg:w-2/3">
                        <AnimatePresence mode="wait">
                            {isSubmitted ? (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="bg-white p-12 md:p-20 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center flex flex-col items-center gap-8"
                                >
                                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4 animate-pulse">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-dark)] mb-4 tracking-tight">¡Mensaje Recibido!</h2>
                                        <p className="text-gray-500 text-lg font-light leading-relaxed">
                                            Hemos registrado tu solicitud correctamente. Un miembro de nuestro equipo se pondrá en contacto contigo en las próximas 24 horas.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={resetForm}
                                        className="flex items-center gap-3 bg-[var(--color-dark)] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl"
                                    >
                                        Enviar otro mensaje
                                        <ArrowRight size={18} />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form 
                                    key="form"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onSubmit={handleSubmit}
                                    noValidate
                                    className="bg-white/70 backdrop-blur-md p-8 md:p-14 rounded-[2.5rem] shadow-2xl border border-white flex flex-col gap-10"
                                >
                                    {/* Type Selection */}
                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-dark)]">¿Cuál es el motivo de tu contacto?</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {contactTypes.map(({ id, label }) => (
                                                <button
                                                    key={id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, type: id })}
                                                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                                                        formData.type === id 
                                                            ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-dark)] shadow-lg shadow-[var(--color-primary)]/30' 
                                                            : 'bg-white/50 border-gray-100 text-gray-400 hover:border-gray-200'
                                                    }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.type && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider">{errors.type}</p>}
                                    </div>

                                    {/* Grid Inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField 
                                            icon={<User size={18} />} 
                                            name="name" 
                                            placeholder="Nombre completo" 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            error={errors.name} 
                                        />
                                        <InputField 
                                            icon={<Mail size={18} />} 
                                            name="email" 
                                            type="email"
                                            placeholder="Correo electrónico" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            error={errors.email} 
                                        />
                                        <InputField 
                                            icon={<Phone size={18} />} 
                                            name="phone" 
                                            type="tel"
                                            placeholder="Teléfono móvil" 
                                            value={formData.phone} 
                                            onChange={handleChange} 
                                            error={errors.phone} 
                                        />
                                        <InputField 
                                            icon={<Landmark size={18} />} 
                                            name="city" 
                                            placeholder="Ciudad de residencia" 
                                            value={formData.city} 
                                            onChange={handleChange} 
                                            error={errors.city} 
                                        />
                                    </div>

                                    {/* Message Area */}
                                    <div className="flex flex-col gap-1.5">
                                        <div className="relative">
                                            <span className="absolute left-4 top-5 text-gray-400">
                                                <MessageSquare size={18} />
                                            </span>
                                            <textarea
                                                name="message"
                                                rows={5}
                                                placeholder="¿En qué podemos ayudarte? Describe detalladamente tu solicitud..."
                                                value={formData.message}
                                                onChange={handleChange}
                                                className={`w-full pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all shadow-sm ${errors.message ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        {errors.message && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider ml-1">{errors.message}</p>}
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="group relative flex items-center justify-center gap-3 bg-[var(--color-dark)] text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-black transition-all shadow-2xl active:scale-95"
                                    >
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        Enviar Solicitud
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
