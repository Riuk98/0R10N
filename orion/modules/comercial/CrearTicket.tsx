import React, { useState } from 'react';

// --- ICONS ---
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const SuccessIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface CrearTicketProps {
    onClose: () => void;
}

const InputField = ({ label, placeholder, value, onChange, name }: { label: string, placeholder?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, name: string }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
        <input 
            type="text" 
            placeholder={placeholder} 
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-[var(--bg-main)] text-[var(--text-primary)] border border-transparent rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[var(--secondary-green)] focus:border-[var(--secondary-green)] outline-none transition" 
        />
    </div>
);

type ContactType = 'peticion' | 'reclamo' | 'sugerencia' | 'queja' | 'otros';

const CrearTicket: React.FC<CrearTicketProps> = ({ onClose }) => {
    const initialFormState = {
        nombre: '',
        nit: '',
        direccion: '',
        telefono: '',
        email: '',
        tipo: '' as ContactType | '',
        observaciones: ''
    };
    
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<any>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [newTicketId, setNewTicketId] = useState('');

    const contactTypes: { id: ContactType, label: string }[] = [
        { id: 'peticion', label: 'Petición' },
        { id: 'reclamo', label: 'Reclamo' },
        { id: 'queja', label: 'Queja' },
        { id: 'sugerencia', label: 'Sugerencia' },
        { id: 'otros', label: 'Otros' },
    ];
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleTypeSelect = (type: ContactType) => {
        // FIX: Correctly update the 'tipo' property in the form state.
        setFormData(prev => ({ ...prev, tipo: type }));
        if(errors.tipo) setErrors({...errors, tipo: null});
    }

    const handleClientSearch = () => {
        const nombreBusqueda = formData.nombre.trim();
        const nitBusqueda = formData.nit.trim();

        if (!nombreBusqueda && !nitBusqueda) {
            setErrors({ ...errors, search: 'Debe ingresar un Nombre/Razón Social o NIT para buscar.' });
            return;
        }

        const storedUsers = JSON.parse(localStorage.getItem('hatoGrandeClientes') || '[]');
        const foundUser = storedUsers.find((u: any) => {
            const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
            const searchName = nombreBusqueda.toLowerCase();
            const nameMatch = nombreBusqueda && fullName.includes(searchName);
            const nitMatch = nitBusqueda && u.nit === nitBusqueda;
            return nameMatch || nitMatch;
        });
        
        if (foundUser) {
            setFormData(prev => ({
                ...prev,
                nombre: `${foundUser.firstName} ${foundUser.lastName}`,
                nit: foundUser.nit || '',
                direccion: foundUser.direccion || '',
                telefono: foundUser.phone,
                email: foundUser.email,
            }));
            setErrors({});
        } else {
            setErrors({ ...errors, search: 'La información no coincide con ningún cliente existente.' });
        }
    };

    const validate = () => {
        const newErrors: any = {};
        if (!formData.nombre) newErrors.nombre = "Campo Obligatorio";
        if (!formData.email) newErrors.email = "Campo Obligatorio";
        if (!formData.telefono) newErrors.telefono = "Campo Obligatorio";
        if (!formData.tipo) newErrors.tipo = "Debe seleccionar un tipo";
        if (!formData.observaciones) newErrors.observaciones = "Las observaciones no pueden estar vacías";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) {
            return;
        }

        const existingTickets = JSON.parse(localStorage.getItem('hatoGrandeTickets') || '[]');
        const nextId = existingTickets.length + 1;
        const newTicketId = `CP-${String(nextId).padStart(5, '0')}`;
        
        const newTicket = {
            id: `TICKET-${Date.now()}`,
            timestamp: new Date().toISOString(),
            name: formData.nombre,
            email: formData.email,
            phone: formData.telefono,
            city: formData.direccion.split(',')[1]?.trim() || '', // Simple city extraction
            type: formData.tipo,
            message: formData.observaciones,
            status: 'Abierto',
        };

        existingTickets.push(newTicket);
        localStorage.setItem('hatoGrandeTickets', JSON.stringify(existingTickets));
        window.dispatchEvent(new Event("storage"));

        setNewTicketId(newTicketId);
        setIsSubmitted(true);
    };

    const handleCreateAnother = () => {
        setFormData(initialFormState);
        setErrors({});
        setIsSubmitted(false);
        setNewTicketId('');
    };
    
    if (isSubmitted) {
        return (
             <div className="p-4 bg-[var(--bg-card)] text-[var(--text-primary)] h-full flex flex-col items-center justify-center">
                 <SuccessIcon className="w-24 h-24 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-[var(--secondary-green)]">¡Ticket Creado Exitosamente!</h3>
                <p className="mt-2 text-[var(--text-primary)] text-center">
                    Se ha generado el ticket No. <strong>{newTicketId}</strong>.
                </p>
                <div className="mt-8 flex gap-4">
                    <button 
                        onClick={handleCreateAnother} 
                        className="px-6 py-2 bg-[var(--secondary-green)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
                        Crear Otro Ticket
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-[var(--bg-main)] text-[var(--text-primary)] font-semibold rounded-lg hover:opacity-80 transition-opacity border border-[var(--border-color)]">
                        Salir
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-3 h-full flex flex-col bg-[var(--bg-card)] text-[var(--text-primary)]">
            {errors.search && (
                <div className="w-full text-center p-2 bg-red-100 text-red-800 text-sm rounded-lg border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700">
                    {errors.search}
                </div>
            )}
            <div className="flex justify-between items-start">
                <div className="flex-grow p-4 border border-[var(--border-color)] rounded-2xl mr-4 bg-[var(--bg-main)]/50">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <InputField label="Nombre/Razón Social" name="nombre" value={formData.nombre} onChange={handleChange} />
                        <InputField label="NIT" name="nit" value={formData.nit} onChange={handleChange} />
                        <InputField label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} />
                        <InputField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} />
                        <InputField label="E-mail" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex flex-col space-y-2 items-center">
                    <button onClick={handleClientSearch} title="Buscar Cliente" className="p-2 rounded-full hover:bg-[var(--bg-main)] transition-colors"><SearchIcon className="w-6 h-6"/></button>
                </div>
            </div>

            <div className="p-4 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-main)]/50">
                <h3 className="text-md font-semibold text-[var(--text-primary)] mb-3">Tipo de Contacto</h3>
                <div className="grid grid-cols-3 gap-3">
                    {contactTypes.map(({ id, label }) => (
                        <button
                            key={id} type="button" onClick={() => handleTypeSelect(id)}
                            className={`p-2 text-center rounded-lg border-2 transition-all duration-300 font-semibold text-sm ${formData.tipo === id ? 'bg-[var(--color-primary)] text-[var(--color-dark)] border-[var(--color-primary)]' : 'bg-gray-100 text-[var(--text-text)] border-gray-200 hover:border-gray-400'}`}
                        >{label}</button>
                    ))}
                </div>
                 {errors.tipo && <p className="text-red-600 text-xs mt-2">{errors.tipo}</p>}
            </div>

            <div className="p-4 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-main)]/50 flex-grow flex flex-col">
                <label htmlFor="observaciones" className="text-md font-semibold text-[var(--text-primary)] mb-2">Observaciones</label>
                <textarea 
                    id="observaciones"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    rows={4}
                    className="w-full flex-grow bg-[var(--bg-main)] text-[var(--text-primary)] border border-transparent rounded-lg p-3 text-sm focus:ring-2 focus:ring-[var(--secondary-green)] outline-none transition"
                ></textarea>
                {errors.observaciones && <p className="text-red-600 text-xs mt-2">{errors.observaciones}</p>}
            </div>
            
            <div className="pt-2 flex justify-end">
                <button 
                    onClick={handleSubmit}
                    className="bg-[var(--secondary-green)] text-white font-semibold py-2 px-8 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Crear Ticket
                </button>
            </div>
        </div>
    );
};

export default CrearTicket;