
import React, { useState, useEffect } from 'react';

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

const ViewIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

// --- TYPE DEFINITIONS ---
interface Customer {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;
    nit?: string;
    direccion?: string;
    tipoPago?: string;
}

interface Supplier {
    id: number;
    nombre: string;
    nit: string;
    direccion: string;
    telefono: string;
    email: string;
    tipoPago: string;
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
    // Original data for detail view
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

const ActionButton = ({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick?: () => void }) => (
    <button onClick={onClick} title={title} className="w-10 h-10 bg-[var(--bg-main)] text-[var(--text-primary)] rounded-full flex items-center justify-center hover:bg-[var(--border-color)] transition-colors">
        {icon}
    </button>
);

const ClientesCRM: React.FC = () => {
    const USER_STORAGE_KEY = 'hatoGrandeClientes';
    const SUPPLIER_STORAGE_KEY = 'orionProveedores';
    const [activeTab, setActiveTab] = useState('movimientos');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        nit: '',
        direccion: '',
        telefono: '',
        email: '',
        tipoPago: '',
    });
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [allTickets, setAllTickets] = useState<Ticket[]>([]);
    const [customerTickets, setCustomerTickets] = useState<Ticket[]>([]);


    // Load customers from Hato Grande's localStorage
    useEffect(() => {
        try {
            const storedUsers = localStorage.getItem(USER_STORAGE_KEY);
            setCustomers(storedUsers ? JSON.parse(storedUsers) : []);
        } catch (error) {
            console.error("Failed to parse users from localStorage", error);
        }
    }, []);

     // Load suppliers from localStorage or create initial data
    useEffect(() => {
        try {
            const storedSuppliers = localStorage.getItem(SUPPLIER_STORAGE_KEY);
            if (storedSuppliers) {
                setSuppliers(JSON.parse(storedSuppliers));
            } else {
                const initialSuppliers: Supplier[] = [
                    { id: 1, nombre: 'Insumos del Campo SAS', nit: '900.123.456-7', direccion: 'Calle Falsa 123, Bogotá', telefono: '3159876543', email: 'compras@insumoscampo.co', tipoPago: 'Crédito 30 días' },
                    { id: 2, nombre: 'Empaques S.A.', nit: '800.789.123-4', direccion: 'Carrera Real 456, Medellín', telefono: '3104567890', email: 'ventas@empaques.sa', tipoPago: 'Contado' },
                    { id: 3, nombre: 'Transportes Rápidos LTDA', nit: '901.234.567-8', direccion: 'Avenida Siempre Viva 742, Cali', telefono: '3201112233', email: 'logistica@transrapidos.com', tipoPago: 'Crédito 60 días' }
                ];
                localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(initialSuppliers));
                setSuppliers(initialSuppliers);
            }
        } catch (error) {
            console.error("Failed to load/create suppliers in localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            const storedTicketsRaw = localStorage.getItem('hatoGrandeTickets');
            if (storedTicketsRaw) {
                const storedTickets = JSON.parse(storedTicketsRaw);
                
                const mappedTickets: Ticket[] = storedTickets.map((t: any, index: number) => {
                    const ticketId = `CP-${String(storedTickets.length - index).padStart(5, '0')}`;
                    
                    let tipo: Ticket['tipo'] = 'Sugerencia';
                    if (t.type === 'reclamo') tipo = 'Reclamacion';
                    else if (t.type === 'queja') tipo = 'Queja';
                    else if (t.type === 'peticion') tipo = 'Peticion';
                    else if (t.type === 'otros') tipo = 'Otros';
                    
                    let area: Ticket['area'] = 'Comercial';
                    let prioridad: Ticket['prioridad'] = 'Baja';

                    // Fallback logic, can be overridden by AI
                    if (tipo === 'Reclamacion' || tipo === 'Queja') {
                        prioridad = 'Alta';
                        area = 'Logistica';
                    } else if (tipo === 'Peticion') {
                        prioridad = 'Media';
                        area = 'Financiera';
                    }
                    
                    let fechaRespuesta: string | undefined = undefined;
                    if (t.status === 'Cerrado') {
                         const creationDate = new Date(t.timestamp);
                         creationDate.setDate(creationDate.getDate() + Math.floor(Math.random() * 5) + 2); // Add 2-7 days
                         fechaRespuesta = creationDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    }

                    return {
                        id: ticketId,
                        fechaCreacion: new Date(t.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                        cliente: t.name,
                        tipo: tipo,
                        area: area,
                        prioridad: prioridad,
                        estado: t.status,
                        fechaRespuesta: fechaRespuesta,
                        message: t.message,
                        email: t.email,
                        phone: t.phone,
                        city: t.city,
                        originalId: t.id,
                    };
                }).sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]));

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        const { nombre, email, telefono, nit } = formData;
        if (!nombre && !email && !telefono && !nit) {
            showNotification("Ingrese un nombre, NIT, email o teléfono para buscar.", 'error');
            return;
        }

        const searchTerm = nombre.toLowerCase();
        const searchEmail = email.toLowerCase();

        // 1. Search for a Client
        const foundCustomer = customers.find(c =>
            (searchEmail && c.email && c.email.toLowerCase() === searchEmail) ||
            (telefono && c.phone === telefono) ||
            (searchTerm && (c.firstName + ' ' + c.lastName).toLowerCase().includes(searchTerm)) ||
            (nit && c.nit === nit)
        );

        if (foundCustomer) {
            const customerFullName = `${foundCustomer.firstName} ${foundCustomer.lastName}`.trim();
            setFormData({
                nombre: customerFullName,
                nit: foundCustomer.nit || '',
                direccion: foundCustomer.direccion || '',
                telefono: foundCustomer.phone || '',
                email: foundCustomer.email || '',
                tipoPago: foundCustomer.tipoPago || '',
            });
            showNotification("Cliente encontrado.", 'success');
            const ticketsForCustomer = allTickets.filter(
                ticket => ticket.cliente.toLowerCase() === customerFullName.toLowerCase()
            );
            setCustomerTickets(ticketsForCustomer);
            return; // Exit after finding a client
        }

        // 2. If no client found, search for a Supplier
        const foundSupplier = suppliers.find(s =>
             (searchEmail && s.email && s.email.toLowerCase() === searchEmail) ||
             (telefono && s.telefono === telefono) ||
             (searchTerm && s.nombre.toLowerCase().includes(searchTerm)) ||
             (nit && s.nit === nit)
        );

        if (foundSupplier) {
            setFormData({
                nombre: foundSupplier.nombre,
                nit: foundSupplier.nit || '',
                direccion: foundSupplier.direccion || '',
                telefono: foundSupplier.telefono || '',
                email: foundSupplier.email || '',
                tipoPago: foundSupplier.tipoPago || '',
            });
            showNotification("Proveedor encontrado. Los datos se han cargado.", 'success');
            setCustomerTickets([]); // Clear tickets as it's a supplier
            return; // Exit after finding a supplier
        }

        // 3. If nothing is found
        showNotification("Cliente o Proveedor no encontrado.", 'error');
        setCustomerTickets([]);
    };
    
    const handleRegister = () => {
        const { nombre, email } = formData;
        if (!nombre || !email) {
            showNotification("Nombre y Email son obligatorios para registrar.", 'error');
            return;
        }

        const existingCustomer = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
        if (existingCustomer) {
            showNotification("Un cliente con este email ya existe.", 'error');
            return;
        }
        
        const nameParts = nombre.split(' ');
        const firstName = nameParts.shift() || '';
        const lastName = nameParts.join(' ');

        const newCustomer: Customer = {
            firstName,
            lastName,
            email: formData.email,
            phone: formData.telefono,
            password: `temp_${Date.now()}`, // Hato Grande app needs a password
            nit: formData.nit,
            direccion: formData.direccion,
            tipoPago: formData.tipoPago,
        };

        const updatedCustomers = [...customers, newCustomer];
        setCustomers(updatedCustomers);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedCustomers));
        showNotification("Nuevo cliente registrado con éxito.", 'success');
        handleReset(); // Clear form after successful registration
    };
    
    const handleReset = () => {
        setFormData({
            nombre: '',
            nit: '',
            direccion: '',
            telefono: '',
            email: '',
            tipoPago: '',
        });
        showNotification("Formulario limpiado.", 'success');
        setCustomerTickets([]);
    };
    
    const handleCreatePedido = () => {
        window.dispatchEvent(new CustomEvent('createOrionWindow', {
            detail: { title: 'Crear Pedido' }
        }));
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
            {/* Notification Area */}
            {notification && (
                 <div className={`p-2 mb-2 text-sm rounded-md text-center ${notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
                    {notification.message}
                </div>
            )}
            {/* Top section: Client Info + Actions */}
            <div className="flex gap-4">
                {/* Info Form */}
                <div className="flex-grow p-4 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-main)]/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <InputField label="Nombre/Razón Social" name="nombre" value={formData.nombre} onChange={handleInputChange} />
                        <InputField label="NIT" name="nit" value={formData.nit} onChange={handleInputChange} />
                        <InputField label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} />
                        <InputField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleInputChange} />
                        <InputField label="E-mail" name="email" value={formData.email} onChange={handleInputChange} />
                        <InputField label="Tipo de pago" name="tipoPago" value={formData.tipoPago} onChange={handleInputChange} />
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                    <ActionButton title="Buscar Cliente" onClick={handleSearch} icon={<SearchIcon className="w-5 h-5" />} />
                    <ActionButton title="Nuevo Pedido" onClick={handleCreatePedido} icon={<CartIcon className="w-5 h-5" />} />
                    <ActionButton title="Registrar Cliente" onClick={handleRegister} icon={<DocumentIcon className="w-5 h-5" />} />
                    <ActionButton title="Generar Reporte" icon={<PrintIcon className="w-5 h-5" />} />
                    <ActionButton title="Limpiar Formulario" onClick={handleReset} icon={<CancelIcon className="w-5 h-5" />} />
                </div>
            </div>

            {/* Bottom Section: Tabs and Table */}
            <div className="flex-grow flex flex-col">
                {/* Tabs */}
                <div className="flex space-x-2 mb-0">
                    <button
                        onClick={() => setActiveTab('movimientos')}
                        className={`px-5 py-2 text-sm font-semibold rounded-t-xl transition-colors ${activeTab === 'movimientos' ? 'bg-[var(--bg-card)] border-x border-t border-[var(--border-color)] text-[var(--text-primary)]' : 'bg-[var(--bg-main)] hover:opacity-80 text-[var(--text-secondary)]'}`}
                    >
                        Últimos Movimientos
                    </button>
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`px-5 py-2 text-sm font-semibold rounded-t-xl transition-colors ${activeTab === 'tickets' ? 'bg-[var(--bg-card)] border-x border-t border-[var(--border-color)] text-[var(--text-primary)]' : 'bg-[var(--bg-main)] hover:opacity-80 text-[var(--text-secondary)]'}`}
                    >
                        Tickets
                    </button>
                </div>
                {/* Table Area */}
                <div className="flex-grow p-4 border border-[var(--border-color)] rounded-b-2xl rounded-tr-2xl bg-[var(--bg-card)] min-h-0">
                     <style>{`
                        .ticket-table tbody td {
                            border-right: 1px dotted var(--border-color);
                            padding: 0.5rem;
                        }
                        .ticket-table tbody td:last-child {
                            border-right: none;
                        }
                        .ticket-table thead th {
                            padding: 0.5rem;
                            border-right: 1px solid var(--border-color);
                        }
                        .ticket-table thead th:last-child {
                            border-right: none;
                        }
                        .ticket-table tbody tr:not(:last-child) {
                            border-bottom: 1px solid var(--border-color);
                        }
                    `}</style>
                    {activeTab === 'movimientos' && (
                         <div className="flex flex-col h-full">
                            {/* Table Header */}
                             <div className="grid grid-cols-[1fr,1.5fr,1fr,1fr,1fr,1fr] gap-x-4 pb-2 border-b-2 border-[var(--border-color)] font-bold text-sm text-left flex-shrink-0">
                                <div className="px-2">Fecha</div>
                                <div className="px-2">Num. Comprobante</div>
                                <div className="px-2">Valor</div>
                                <div className="px-2">Saldo</div>
                                <div className="px-2">Estado</div>
                                <div className="px-2 text-center">Acciones</div>
                            </div>
                             {/* Table Body */}
                            <div className="flex-grow overflow-y-auto flex items-center justify-center">
                                <p className="text-[var(--text-secondary)]">No hay datos de movimientos disponibles.</p>
                            </div>
                        </div>
                    )}
                     {activeTab === 'tickets' && (
                        <div className="flex flex-col h-full">
                            <div className="flex-grow overflow-y-auto">
                                <table className="w-full text-sm border-collapse ticket-table min-w-[700px]">
                                    <thead className="bg-[var(--bg-main)] text-left sticky top-0">
                                        <tr>
                                            {tableHeaders.map((header) => (
                                                 <th key={header} className="font-bold">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerTickets.length > 0 ? customerTickets.map(ticket => (
                                            <tr key={ticket.id} className="hover:bg-[var(--bg-main)]">
                                                <td>{ticket.id}</td>
                                                <td>{ticket.fechaCreacion}</td>
                                                <td>{ticket.tipo}</td>
                                                <td>{ticket.area}</td>
                                                <td>{ticket.prioridad}</td>
                                                <td className="p-0 text-center font-semibold">
                                                    <div className={`py-2 ${getStatusClass(ticket.estado)}`}>
                                                        {ticket.estado}
                                                    </div>
                                                </td>
                                                <td>{ticket.fechaRespuesta || ''}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={tableHeaders.length} className="text-center p-8 text-[var(--text-secondary)]">
                                                    No hay tickets asociados a este cliente o no se ha realizado una búsqueda.
                                                </td>
                                            </tr>
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
