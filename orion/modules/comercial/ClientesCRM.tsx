

import React, { useState, useEffect, useMemo } from 'react';

// --- ICONS ---
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const CartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

const PrintIcon = (props: React.SVGProps<SVGSVGElement>) => (
     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
);

const CancelIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const ListIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
);


// --- TYPE DEFINITIONS ---
export interface Tercero {
    id: string; // Unique ID, can be NIT
    nombre: string;
    nit: string;
    direccion: string;
    telefono: string;
    email: string;
    tipoPago: string;
    tipo: 'Cliente' | 'Proveedor' | 'Ambos';
    status: 'Activo' | 'Inactivo';
}

interface Ticket {
    id: string; 
    fechaCreacion: string;
    cliente: string; 
    tipo: 'Queja' | 'Peticion' | 'Sugerencia' | 'Reclamacion' | 'Otros';
    area: 'Logistica' | 'Financiera' | 'Comercial';
    prioridad: 'Alta' | 'Media' | 'Baja';
    estado: 'Abierto' | 'En proceso' | 'Cerrado';
    fechaRespuesta?: string;
    message: string;
    email: string;
    phone: string;
    city: string;
    originalId: string;
}

interface FormData {
    nombre: string;
    nit: string;
    direccion: string;
    telefono: string;
    email: string;
    tipoPago: string;
    esCliente: boolean;
    esProveedor: boolean;
}

interface ClientesCRMProps {
    permissions?: Record<string, boolean>;
    terceros: Tercero[];
    onSave: (tercero: Tercero) => void;
}

const InputField = ({ label, name, value, onChange }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
        <input 
            type="text" 
            name={name}
            value={value}
            onChange={onChange}
            className="bg-[var(--bg-main)] text-[var(--text-primary)] border border-transparent rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[var(--secondary-green)] focus:border-[var(--secondary-green)] outline-none transition"
        />
    </div>
);

const ActionButton = ({ icon, title, onClick, disabled }: { icon: React.ReactNode, title: string, onClick?: () => void, disabled?: boolean }) => (
    <button 
        onClick={onClick} 
        title={disabled ? "No tiene permisos para realizar esta acción" : title} 
        disabled={disabled}
        className="w-10 h-10 bg-[var(--bg-main)] text-[var(--text-primary)] rounded-full flex items-center justify-center hover:bg-[var(--border-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {icon}
    </button>
);

// --- Modal for Listing Terceros ---
const TercerosListModal = ({ isOpen, onClose, onSelect, terceros }: { isOpen: boolean, onClose: () => void, onSelect: (tercero: Tercero) => void, terceros: Tercero[] }) => {
    if (!isOpen) return null;

    const [typeFilter, setTypeFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const filteredTerceros = useMemo(() => {
        return terceros.filter(t => {
            const typeMatch = typeFilter === 'Todos' || t.tipo === typeFilter;
            const statusMatch = statusFilter === 'Todos' || t.status === statusFilter;
            return typeMatch && statusMatch;
        });
    }, [terceros, typeFilter, statusFilter]);

    return (
        <div className="fixed inset-0 bg-black/60 z-[1050] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[var(--bg-card)] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-[var(--border-color)]">
                    <h3 className="text-lg font-bold">Listado de Terceros</h3>
                </div>
                <div className="p-4 flex flex-wrap gap-4 items-center bg-[var(--bg-main)]/50">
                    <div>
                        <label className="text-sm font-medium mr-2">Filtrar por Tipo:</label>
                        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="p-2 border rounded-md bg-[var(--bg-main)]">
                            <option>Todos</option><option>Cliente</option><option>Proveedor</option><option>Ambos</option>
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium mr-2">Filtrar por Estado:</label>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2 border rounded-md bg-[var(--bg-main)]">
                            <option>Todos</option><option>Activo</option><option>Inactivo</option>
                        </select>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                     <table className="w-full text-sm">
                        <thead className="bg-[var(--bg-main)] sticky top-0">
                            <tr>
                                <th className="p-3 text-left">NIT</th>
                                <th className="p-3 text-left">Nombre</th>
                                <th className="p-3 text-left">Tipo</th>
                                <th className="p-3 text-center">Estado</th>
                                <th className="p-3 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTerceros.map(t => (
                                <tr key={t.id} className="border-t border-[var(--border-color)] hover:bg-[var(--bg-main)]/50">
                                    <td className="p-3">{t.nit}</td>
                                    <td className="p-3">{t.nombre}</td>
                                    <td className="p-3">{t.tipo}</td>
                                    <td className="p-3 text-center">
                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${t.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => onSelect(t)} className="px-3 py-1 bg-[var(--secondary-green)] text-white text-xs font-bold rounded-md hover:opacity-80">Seleccionar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-[var(--border-color)] text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-[var(--bg-main)] rounded-md hover:opacity-80">Cerrar</button>
                </div>
            </div>
        </div>
    );
};


const ClientesCRM: React.FC<ClientesCRMProps> = ({ permissions, terceros, onSave }) => {
    const [activeTab, setActiveTab] = useState('movimientos');
    const [formData, setFormData] = useState<FormData>({
        nombre: '', nit: '', direccion: '', telefono: '', email: '', tipoPago: '',
        esCliente: true, esProveedor: false,
    });
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [allTickets, setAllTickets] = useState<Ticket[]>([]);
    const [customerTickets, setCustomerTickets] = useState<Ticket[]>([]);
    const [isListModalOpen, setIsListModalOpen] = useState(false);


    useEffect(() => {
        try {
            const storedTicketsRaw = localStorage.getItem('hatoGrandeTickets');
            if (storedTicketsRaw) {
                const storedTickets = JSON.parse(storedTicketsRaw);
                const mappedTickets: Ticket[] = storedTickets.map((t: any, index: number) => ({
                    id: `CP-${String(storedTickets.length - index).padStart(5, '0')}`,
                    fechaCreacion: new Date(t.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    cliente: t.name,
                    tipo: t.type === 'reclamo' ? 'Reclamacion' : (t.type.charAt(0).toUpperCase() + t.type.slice(1)),
                    area: 'Comercial', // Default area
                    prioridad: (t.type === 'reclamo' || t.type === 'queja') ? 'Alta' : 'Baja',
                    estado: t.status,
                    fechaRespuesta: t.status === 'Cerrado' ? new Date(new Date(t.timestamp).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES') : undefined,
                    message: t.message, email: t.email, phone: t.phone, city: t.city, originalId: t.id,
                })).sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]));
                setAllTickets(mappedTickets);
            }
        } catch (error) {
            console.error("Failed to load tickets from localStorage", error);
        }
    }, []);


    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSearch = () => {
        const { nombre, email, telefono, nit } = formData;
        if (!nombre && !email && !telefono && !nit) {
            showNotification("Ingrese un nombre, NIT, email o teléfono para buscar.", 'error');
            return;
        }

        const searchTerm = nombre.toLowerCase();
        const searchEmail = email.toLowerCase();

        const foundTercero = terceros.find(t =>
            (searchEmail && t.email && t.email.toLowerCase() === searchEmail) ||
            (telefono && t.telefono === telefono) ||
            (searchTerm && t.nombre.toLowerCase().includes(searchTerm)) ||
            (nit && t.nit === nit)
        );

        if (foundTercero) {
            setFormData({
                nombre: foundTercero.nombre,
                nit: foundTercero.nit || '',
                direccion: foundTercero.direccion || '',
                telefono: foundTercero.telefono || '',
                email: foundTercero.email || '',
                tipoPago: foundTercero.tipoPago || '',
                esCliente: foundTercero.tipo === 'Cliente' || foundTercero.tipo === 'Ambos',
                esProveedor: foundTercero.tipo === 'Proveedor' || foundTercero.tipo === 'Ambos',
            });
            showNotification("Tercero encontrado.", 'success');
            const ticketsForCustomer = allTickets.filter(
                ticket => ticket.cliente.toLowerCase() === foundTercero.nombre.toLowerCase()
            );
            setCustomerTickets(ticketsForCustomer);
        } else {
            if (window.confirm('Tercero no encontrado. ¿Desea crearlo con la información ingresada?')) {
                showNotification("Puede completar los datos y guardar el nuevo tercero.", 'success');
            } else {
                showNotification("Tercero no encontrado. Puede registrarlo o intentar una nueva búsqueda.", 'error');
            }
            setCustomerTickets([]);
        }
    };
    
    const handleRegister = () => {
        const { nombre, email, nit, esCliente, esProveedor } = formData;
        if (!nombre || (!email && !nit)) {
            showNotification("Nombre y Email o NIT son obligatorios para registrar.", 'error');
            return;
        }
        if (!esCliente && !esProveedor) {
            showNotification("Debe seleccionar si es Cliente, Proveedor o Ambos.", 'error');
            return;
        }

        const id = nit || email;
        const existingTercero = terceros.find(t => t.id === id);
        if (existingTercero) {
            showNotification("Un tercero con este NIT o Email ya existe.", 'error');
            return;
        }
        
        let tipo: Tercero['tipo'];
        if (esCliente && esProveedor) tipo = 'Ambos';
        else if (esCliente) tipo = 'Cliente';
        else tipo = 'Proveedor';

        const newTercero: Tercero = {
            id,
            nombre,
            nit,
            email,
            tipo,
            direccion: formData.direccion,
            telefono: formData.telefono,
            tipoPago: formData.tipoPago,
            status: 'Activo', // Default status
        };

        onSave(newTercero);
        showNotification("Nuevo tercero registrado con éxito.", 'success');
        handleReset();
    };
    
    const handleReset = () => {
        setFormData({
            nombre: '', nit: '', direccion: '', telefono: '', email: '', tipoPago: '',
            esCliente: true, esProveedor: false,
        });
        showNotification("Formulario limpiado.", 'success');
        setCustomerTickets([]);
    };
    
    const handleCreatePedido = () => {
        const detailPayload: { title: string, props?: any } = {
            title: 'Crear Pedido'
        };
    
        if (formData.nombre) {
            detailPayload.props = {
                clientData: {
                    nombre: formData.nombre, nit: formData.nit, direccion: formData.direccion,
                    telefono: formData.telefono, email: formData.email,
                }
            };
        }
    
        window.dispatchEvent(new CustomEvent('createOrionWindow', {
            detail: detailPayload
        }));
    };
    
    const handleSelectTerceroFromList = (tercero: Tercero) => {
        setFormData({
            nombre: tercero.nombre,
            nit: tercero.nit || '',
            direccion: tercero.direccion || '',
            telefono: tercero.telefono || '',
            email: tercero.email || '',
            tipoPago: tercero.tipoPago || '',
            esCliente: tercero.tipo === 'Cliente' || tercero.tipo === 'Ambos',
            esProveedor: tercero.tipo === 'Proveedor' || tercero.tipo === 'Ambos',
        });
        const ticketsForCustomer = allTickets.filter(
            ticket => ticket.cliente.toLowerCase() === tercero.nombre.toLowerCase()
        );
        setCustomerTickets(ticketsForCustomer);
        setIsListModalOpen(false);
        showNotification(`${tercero.nombre} seleccionado.`, 'success');
    };

    const getStatusClass = (status: Ticket['estado']) => {
        switch (status) {
            case 'Abierto': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
            case 'En proceso': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
            case 'Cerrado': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
        }
    };
    
    const tableHeaders = ['No. Ticket', 'F. Creacion', 'Tipo', 'Area', 'Prioridad', 'Estado', 'F. Respuesta'];
    
    return (
        <div className="p-2 space-y-4 h-full flex flex-col text-[var(--text-primary)]">
            <TercerosListModal isOpen={isListModalOpen} onClose={() => setIsListModalOpen(false)} onSelect={handleSelectTerceroFromList} terceros={terceros} />
            {notification && (
                 <div className={`p-2 mb-2 text-sm rounded-md text-center ${notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
                    {notification.message}
                </div>
            )}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-grow p-4 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-main)]/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <InputField label="Nombre/Razón Social" name="nombre" value={formData.nombre} onChange={handleInputChange} />
                        <InputField label="NIT" name="nit" value={formData.nit} onChange={handleInputChange} />
                        <InputField label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} />
                        <InputField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleInputChange} />
                        <InputField label="E-mail" name="email" value={formData.email} onChange={handleInputChange} />
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-[var(--text-secondary)] mb-1">Tipo de pago</label>
                            <select
                                name="tipoPago"
                                value={formData.tipoPago}
                                onChange={handleInputChange}
                                className="bg-[var(--bg-main)] text-[var(--text-primary)] border border-transparent rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[var(--secondary-green)] focus:border-[var(--secondary-green)] outline-none transition w-full h-[34px]"
                            >
                                <option value="">Seleccione...</option>
                                <option value="Contado">Contado</option>
                                <option value="Crédito">Crédito</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                             <fieldset className="border border-[var(--border-color)] rounded-lg p-2">
                                <legend className="text-sm font-medium px-1">Tipo de Tercero</legend>
                                <div className="flex gap-4 items-center p-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="esCliente" checked={formData.esCliente} onChange={handleCheckboxChange} className="h-4 w-4 rounded text-[var(--secondary-green)] focus:ring-[var(--secondary-green)]"/>
                                        Cliente
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="esProveedor" checked={formData.esProveedor} onChange={handleCheckboxChange} className="h-4 w-4 rounded text-[var(--secondary-green)] focus:ring-[var(--secondary-green)]"/>
                                        Proveedor
                                    </label>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap justify-center lg:flex-col lg:space-y-3 gap-3">
                    <ActionButton title="Listar Terceros" onClick={() => setIsListModalOpen(true)} icon={<ListIcon className="w-5 h-5" />} />
                    <ActionButton title="Buscar Tercero" onClick={handleSearch} icon={<SearchIcon className="w-5 h-5" />} />
                    <ActionButton title="Nuevo Pedido" onClick={handleCreatePedido} icon={<CartIcon className="w-5 h-5" />} disabled={!permissions?.crear} />
                    <ActionButton title="Guardar Tercero" onClick={handleRegister} icon={<DocumentIcon className="w-5 h-5" />} disabled={!permissions?.crear} />
                    <ActionButton title="Generar Reporte" icon={<PrintIcon className="w-5 h-5" />} />
                    <ActionButton title="Limpiar Formulario" onClick={handleReset} icon={<CancelIcon className="w-5 h-5" />} />
                </div>
            </div>

            <div className="flex-grow flex flex-col">
                <div className="flex space-x-2 mb-0">
                    <button onClick={() => setActiveTab('movimientos')} className={`px-5 py-2 text-sm font-semibold rounded-t-xl transition-colors ${activeTab === 'movimientos' ? 'bg-[var(--bg-card)] border-x border-t border-[var(--border-color)]' : 'bg-[var(--bg-main)] hover:opacity-80'}`}>
                        Últimos Movimientos
                    </button>
                    <button onClick={() => setActiveTab('tickets')} className={`px-5 py-2 text-sm font-semibold rounded-t-xl transition-colors ${activeTab === 'tickets' ? 'bg-[var(--bg-card)] border-x border-t border-[var(--border-color)]' : 'bg-[var(--bg-main)] hover:opacity-80'}`}>
                        Tickets
                    </button>
                </div>
                <div className="flex-grow p-4 border border-[var(--border-color)] rounded-b-2xl rounded-tr-2xl bg-[var(--bg-card)] min-h-0">
                     <style>{`
                        .ticket-table tbody td { border-right: 1px dotted var(--border-color); padding: 0.5rem; }
                        .ticket-table tbody td:last-child { border-right: none; }
                        .ticket-table thead th { padding: 0.5rem; border-right: 1px solid var(--border-color); }
                        .ticket-table thead th:last-child { border-right: none; }
                        .ticket-table tbody tr:not(:last-child) { border-bottom: 1px solid var(--border-color); }
                    `}</style>
                    {activeTab === 'movimientos' && (
                         <div className="flex flex-col h-full items-center justify-center">
                            <p className="text-[var(--text-secondary)]">No hay datos de movimientos disponibles.</p>
                        </div>
                    )}
                     {activeTab === 'tickets' && (
                        <div className="flex flex-col h-full">
                            <div className="flex-grow overflow-y-auto">
                                <table className="w-full text-sm border-collapse ticket-table min-w-[700px]">
                                    <thead className="bg-[var(--bg-main)] text-left sticky top-0">
                                        <tr>{tableHeaders.map((h) => <th key={h} className="font-bold">{h}</th>)}</tr>
                                    </thead>
                                    <tbody>
                                        {customerTickets.length > 0 ? customerTickets.map(ticket => (
                                            <tr key={ticket.id} className="hover:bg-[var(--bg-main)]">
                                                <td>{ticket.id}</td><td>{ticket.fechaCreacion}</td><td>{ticket.tipo}</td><td>{ticket.area}</td><td>{ticket.prioridad}</td>
                                                <td className="p-0 text-center font-semibold"><div className={`py-2 ${getStatusClass(ticket.estado)}`}>{ticket.estado}</div></td>
                                                <td>{ticket.fechaRespuesta || ''}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={tableHeaders.length} className="text-center p-8 text-[var(--text-secondary)]">No hay tickets asociados a este tercero.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientesCRM;
