
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
        <div className="min-h-screen py-12 sm:py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden">
                    {/* Left Side: Info & Map */}
                    <div className="w-full lg:w-2/5 p-8 md:p-12 text-[var(--color-dark)] bg-[#D9B814]">
                        <div className="flex flex-col h-full">
                           <div className="bg-gray-100 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-8">
                                <h2 className="text-3xl font-bold mb-4 text-[var(--color-dark)]">Estamos para ayudarte</h2>
                                <p className="mb-8 opacity-90 text-black">¿Tienes alguna pregunta, sugerencia o necesitas ayuda con un pedido? No dudes en contactarnos. Nuestro equipo está listo para atenderte.</p>
                                
                                <div className="space-y-4 text-lg">
                                    <p className="flex items-center gap-3 text-black"><Icons.Location className="w-6 h-6 text-[var(--color-secondary)]" /> Finca Hato Grande, Suesca</p>
                                    <p className="flex items-center gap-3 text-black"><Icons.Email className="w-6 h-6 text-[var(--color-secondary)]" /> ventas@hatogrande.com</p>
                                    <p className="flex items-center gap-3 text-black"><Icons.Phone className="w-6 h-6 text-[var(--color-secondary)]" /> +57 310 123 4567</p>
                                </div>
                            </div>

                            <div className="mt-auto h-48 bg-[var(--color-accent)]/50 rounded-lg flex items-center justify-center text-center p-4 border border-[var(--color-secondary)]">
                                <p className="text-sm opacity-80 text-black">Aquí iría un mapa interactivo de nuestra ubicación.</p>
                            </div>
                        </div>
                    </div>


                    {/* Right Side: Form */}
                    <div className="w-full lg:w-3/5 p-8 md:p-12">
                        {isSubmitted ? (
                             <div className="text-center flex flex-col items-center justify-center h-full">
                                <Icons.Success className="w-24 h-24 text-green-500 mb-4" />
                                <h3 className="text-2xl font-bold text-[var(--color-dark)]">¡Mensaje enviado!</h3>
                                <p className="mt-2 text-[var(--color-text)] max-w-sm">Gracias por contactarnos. Hemos recibido tu mensaje y nuestro equipo se pondrá en contacto contigo a la brevedad.</p>
                                <button
                                    onClick={resetForm}
                                    className="mt-8 w-full max-w-xs px-6 py-3 bg-[var(--color-primary)] text-[var(--color-dark)] font-bold rounded-lg hover:bg-[var(--color-accent)] transition-colors text-lg"
                                >
                                    ENVIAR OTRO MENSAJE
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-6">Tipo de Contacto</h3>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {contactTypes.map(({ id, label }) => (
                                        <button
                                            key={id} type="button" onClick={() => handleTypeSelect(id)}
                                            className={`p-3 text-center rounded-lg border-2 transition-all duration-300 font-semibold ${formData.type === id ? 'bg-[var(--color-primary)] text-[var(--color-dark)] border-[var(--color-primary)]' : 'bg-gray-100 text-[var(--color-text)] border-gray-200 hover:border-gray-400'}`}
                                        >{label}</button>
                                    ))}
                                </div>
                                {errors.type && <p className="text-red-600 text-xs -mt-4 mb-4">{errors.type}</p>}
                                
                                <div className="grid md:grid-cols-2 gap-x-6">
                                    <InputField icon={<Icons.User className="w-5 h-5"/>} name="name" placeholder="Nombre completo" value={formData.name} onChange={handleChange} error={errors.name} />
                                    <InputField icon={<Icons.Email className="w-5 h-5"/>} name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} error={errors.email} />
                                    <InputField icon={<Icons.Phone className="w-5 h-5"/>} name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} error={errors.phone} />
                                    <InputField icon={<Icons.City className="w-5 h-5"/>} name="city" placeholder="Ciudad" value={formData.city} onChange={handleChange} error={errors.city} />
                                </div>

                                <div className="relative mt-4">
                                     <textarea
                                        name="message"
                                        rows={5}
                                        placeholder="Escribe tu mensaje aquí..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`w-full p-4 bg-gray-100 border-2 rounded-lg focus:outline-none transition-colors duration-300 ${errors.message ? 'border-red-500' : 'border-gray-200 focus:border-[var(--color-secondary)]'}`}
                                    ></textarea>
                                    {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message}</p>}
                                </div>

                                <button type="submit" className="mt-6 w-full px-6 py-4 bg-[var(--color-primary)] text-[var(--color-dark)] font-bold rounded-lg hover:bg-[var(--color-accent)] transition-colors text-lg">
                                    ENVIAR MENSAJE
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
