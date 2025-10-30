

import React, { useState, useEffect } from 'react';

// --- ICONS ---
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ViewIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

interface PedidosVentaProps {
    permissions?: Record<string, boolean>;
}

const PedidosVenta: React.FC<PedidosVentaProps> = ({ permissions }) => {
    const [pedidos, setPedidos] = useState<any[]>([]);

    useEffect(() => {
        const loadPedidos = () => {
            const storedPedidos = localStorage.getItem('hatoGrandePedidos');
            if (storedPedidos) {
                const parsedPedidos = JSON.parse(storedPedidos);
                parsedPedidos.sort((a: any, b: any) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
                setPedidos(parsedPedidos);
            }
        };

        loadPedidos();

        // Listen for storage changes to update the list in real-time
        window.addEventListener('storage', loadPedidos);

        return () => {
            window.removeEventListener('storage', loadPedidos);
        };
    }, []);
    
    type Status = 'Abierto' | 'En proceso' | 'Cerrado';
    const getStatusClass = (status: Status) => {
        switch (status) {
            case 'Abierto': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
            case 'En proceso': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
            case 'Cerrado': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
        }
    };

    const handleCreatePedido = () => {
        window.dispatchEvent(new CustomEvent('createOrionWindow', {
            detail: { title: 'Crear Pedido' }
        }));
    };
    
    const formatDate = (isoString?: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleDateString('es-CO');
    };

    return (
        <>
            <div className="h-full flex flex-col p-2 space-y-2">
                <style>{`
                    .pedidos-table tbody td {
                        border-right: 1px dotted var(--border-color);
                        padding: 0.75rem 0.5rem; /* py-3 px-2 */
                    }
                    .pedidos-table tbody td:last-child {
                        border-right: none;
                    }
                    .pedidos-table thead th {
                        padding: 0.75rem 0.5rem;
                        border-right: 1px solid var(--border-color);
                    }
                    .pedidos-table thead th:last-child {
                         border-right: none;
                    }
                    .pedidos-table tbody tr:not(:last-child) {
                        border-bottom: 1px solid var(--border-color);
                    }
                `}</style>
                {/* Top Controls */}
                <div className="flex justify-between items-center flex-wrap gap-2">
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
                            placeholder="Nombre de cliente, c. pedido, telefono o correo"
                            className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-l p-1.5 text-sm w-80 focus:ring-2 focus:ring-[var(--secondary-green)] outline-none text-[var(--text-primary)]"
                        />
                        <button className="bg-[var(--bg-main)] border border-[var(--border-color)] border-l-0 rounded-r p-1.5 hover:opacity-80">
                           <SearchIcon />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-grow border border-[var(--border-color)] overflow-auto bg-[var(--bg-card)] rounded-lg">
                    <table className="w-full text-sm border-collapse pedidos-table min-w-[900px]">
                        <thead className="bg-[var(--bg-main)] text-left text-[var(--text-primary)]">
                            <tr>
                                <th className="font-bold">C. Pedido</th>
                                <th className="font-bold">F. Creacion</th>
                                <th className="font-bold">Cliente</th>
                                <th className="font-bold">Valor</th>
                                <th className="font-bold">Metodo de pago</th>
                                <th className="font-bold">Fuente</th>
                                <th className="font-bold">Estado</th>
                                <th className="font-bold">F. Cierre</th>
                            </tr>
                        </thead>
                        <tbody>
                             {pedidos.map(pedido => (
                                <tr key={pedido.id}>
                                    <td>{pedido.id}</td>
                                    <td>{formatDate(pedido.creationDate)}</td>
                                    <td>{pedido.clientName}</td>
                                    <td>${pedido.total.toLocaleString('es-CO')}</td>
                                    <td>{pedido.paymentMethod}</td>
                                    <td>{pedido.source}</td>
                                    <td className="p-0 text-center font-semibold">
                                        <div className={`py-3 ${getStatusClass(pedido.status as Status)}`}>
                                            {pedido.status}
                                        </div>
                                    </td>
                                    <td>{formatDate(pedido.closingDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Controls */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <button title="Ver" className="p-2 rounded-full hover:bg-[var(--bg-main)] transition-colors">
                            <ViewIcon />
                        </button>
                         <button 
                            title={permissions?.actualizar ? "Editar pedido" : "No tiene permisos para editar"} 
                            className="p-2 rounded-full hover:bg-[var(--bg-main)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            disabled={!permissions?.actualizar}>
                            <EditIcon />
                        </button>
                    </div>
                    <button 
                        onClick={handleCreatePedido}
                        disabled={!permissions?.crear}
                        title={permissions?.crear ? "Crear nuevo pedido" : "No tiene permisos para crear"}
                        className="bg-[var(--bg-main)] text-[var(--text-primary)] font-semibold py-2 px-6 border border-[var(--border-color)] rounded-full shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Crear Pedido
                    </button>
                </div>
            </div>
        </>
    );
};

export default PedidosVenta;