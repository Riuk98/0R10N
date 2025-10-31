import React, { useState, useEffect } from 'react';

// --- TYPE DEFINITIONS ---
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

// --- SVG ICONS ---
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const SoportePQR: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState<string | null>(null);

    // Load and map tickets from localStorage on component mount
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

                setTickets(mappedTickets);
                setFilteredTickets(mappedTickets);
            }
        } catch (error) {
            console.error("Failed to load tickets from localStorage", error);
        }
    }, []);
    
     // Handle search filtering
    useEffect(() => {
        if (!searchTerm) {
            setFilteredTickets(tickets);
            return;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        const filtered = tickets.filter(item => {
            return (
                item.cliente.toLowerCase().includes(lowercasedFilter) ||
                item.id.toLowerCase().includes(lowercasedFilter) ||
                item.phone.includes(lowercasedFilter)
            );
        });
        setFilteredTickets(filtered);
    }, [searchTerm, tickets]);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 4000);
    };

    const handleUpdateTicketStatus = (ticketId: string, newStatus: 'En proceso' | 'Cerrado') => {
        let originalTicketId: string | undefined;

        const updatedTickets = tickets.map(t => {
            if (t.id === ticketId) {
                originalTicketId = t.originalId;
                const updatedTicket = { ...t, estado: newStatus };
                if (newStatus === 'Cerrado' && !t.fechaRespuesta) {
                    updatedTicket.fechaRespuesta = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                }
                setSelectedTicket(updatedTicket);
                return updatedTicket;
            }
            return t;
        });
        setTickets(updatedTickets);

        if (originalTicketId) {
            try {
                const storedTicketsRaw = localStorage.getItem('hatoGrandeTickets');
                if (storedTicketsRaw) {
                    let storedTickets = JSON.parse(storedTicketsRaw);
                    const updatedStoredTickets = storedTickets.map((st: any) =>
                        st.id === originalTicketId ? { ...st, status: newStatus } : st
                    );
                    localStorage.setItem('hatoGrandeTickets', JSON.stringify(updatedStoredTickets));
                }
            } catch (error) {
                console.error("Failed to update ticket status in localStorage", error);
            }
        }
        
        showNotification(`El estado del ticket ${ticketId} se ha actualizado a "${newStatus}".`);
    };


    const getStatusClass = (status: Ticket['estado']) => {
        switch (status) {
            case 'Abierto': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
            case 'En proceso': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
            case 'Cerrado': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
        }
    };
    
    const tableHeaders = ['No. Ticket', 'F. Creacion', 'Cliente', 'Tipo', 'Area', 'Prioridad', 'Estado', 'F. Respuesta'];

    const handleGenerateTicket = () => {
        window.dispatchEvent(new CustomEvent('createOrionWindow', {
            detail: { title: 'Generar Ticket' }
        }));
    };

    return (
        <>
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
            <div className="bg-transparent p-2 h-full flex flex-col font-sans text-[var(--text-primary)]">
                {/* Notification */}
                {notification && (
                    <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-400 text-blue-800 dark:text-blue-200 px-4 py-2 rounded relative mb-3 text-sm" role="alert">
                        <span className="block sm:inline">{notification}</span>
                    </div>
                )}
                
                {/* Top Controls */}
                <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <span>Mostrar</span>
                        <select className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded p-1 focus:ring-2 focus:ring-[var(--secondary-green)] outline-none">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <span>Registros</span>
                    </div>
                    <div className="flex items-center">
                        <input 
                            type="text" 
                            placeholder="Nombre de cliente, numero de ticket, telefono de contacto"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-l p-1.5 text-sm w-80 focus:ring-2 focus:ring-[var(--secondary-green)] outline-none text-[var(--text-primary)]"
                        />
                        <button className="bg-[var(--bg-main)] border border-[var(--border-color)] border-l-0 rounded-r p-1.5 hover:opacity-80">
                           <SearchIcon />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-grow border border-[var(--border-color)] overflow-auto bg-[var(--bg-card)] rounded-lg">
                    <table className="w-full text-sm border-collapse ticket-table min-w-[800px]">
                        <thead className="bg-[var(--bg-main)] text-left text-[var(--text-primary)]">
                            <tr>
                                {tableHeaders.map((header) => (
                                     <th key={header} className="font-bold">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                             {filteredTickets.map(ticket => (
                                <tr 
                                    key={ticket.id} 
                                    onClick={() => setSelectedTicket(ticket)} 
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedTicket(ticket); }}
                                    className="cursor-pointer hover:bg-[var(--bg-main)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-green)]"
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Ver detalles del ticket ${ticket.id}`}
                                >
                                    <td>{ticket.id}</td>
                                    <td>{ticket.fechaCreacion}</td>
                                    <td>{ticket.cliente}</td>
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Button */}
                <div className="flex justify-end mt-2">
                    <button 
                        onClick={handleGenerateTicket}
                        className="bg-[var(--bg-main)] text-[var(--text-primary)] font-semibold py-2 px-6 border border-[var(--border-color)] rounded-full shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:opacity-80 transition-colors">
                        Genera Ticket
                    </button>
                </div>
            </div>

            {/* Detailed View Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTicket(null)}>
                    <div className="bg-[var(--bg-card)] rounded-lg shadow-xl p-8 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Detalle del Ticket: {selectedTicket.id}</h3>
                             <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(selectedTicket.estado)}`}>
                                {selectedTicket.estado}
                            </span>
                        </div>
                        
                        <div className="border-t border-[var(--border-color)] my-4"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-[var(--text-secondary)]">
                            <div><strong>Fecha Creación:</strong> {selectedTicket.fechaCreacion}</div>
                            <div><strong>Cliente:</strong> {selectedTicket.cliente}</div>
                            <div><strong>Email:</strong> {selectedTicket.email}</div>
                            <div><strong>Teléfono:</strong> {selectedTicket.phone}</div>
                            <div><strong>Ciudad:</strong> {selectedTicket.city}</div>
                            <div><strong>Tipo:</strong> {selectedTicket.tipo}</div>
                            <div><strong>Área:</strong> {selectedTicket.area}</div>
                            <div><strong>Prioridad:</strong> {selectedTicket.prioridad}</div>
                            <div><strong>ID Original:</strong> {selectedTicket.originalId}</div>
                            {selectedTicket.fechaRespuesta && <div><strong>Fecha Respuesta:</strong> {selectedTicket.fechaRespuesta}</div>}
                            <div className="col-span-2 mt-2">
                                <strong className="block mb-1 text-[var(--text-primary)]">Mensaje:</strong>
                                <p className="mt-1 p-3 bg-[var(--bg-main)] rounded border border-[var(--border-color)] text-[var(--text-primary)] whitespace-pre-wrap max-h-40 overflow-y-auto">{selectedTicket.message}</p>
                            </div>
                        </div>

                        <div className="flex justify-end items-center mt-6 gap-3">
                            {selectedTicket.estado !== 'Cerrado' && (
                                <>
                                    <button
                                        onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'En proceso')}
                                        className="px-5 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-md hover:bg-yellow-500 transition-colors"
                                    >
                                        En progreso
                                    </button>
                                    <button
                                        onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'Cerrado')}
                                        className="px-5 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
                                    >
                                        Cerrado
                                    </button>
                                </>
                            )}
                            <button onClick={() => setSelectedTicket(null)} className="px-5 py-2 bg-[var(--bg-main)] text-[var(--text-primary)] rounded-md hover:opacity-80">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SoportePQR;