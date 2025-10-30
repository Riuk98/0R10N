import React, { useState } from 'react';

// --- ICONS ---
const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-[var(--text-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);


const Inventario: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'productos' | 'insumos'>('productos');
    const [isSearching, setIsSearching] = useState(false);

    const headersProductos = [
        "Codigo", "Nombre", "Cantidad", "Valor u.", "Categoria", 
        "F. Lote", "F. Vencimiento", "Stock Min.", "Stock Max."
    ];

    const headersInsumos = [
        "Codigo", "Nombre", "Cantidad", "Categoria", "F. Compra", 
        "F. Vencimiento", "Factura", "Stock Min.", "Stock Max."
    ];

    const headers = activeTab === 'productos' ? headersProductos : headersInsumos;

    const handleSearch = () => {
        setIsSearching(true);
        setTimeout(() => {
            setIsSearching(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-card)] text-[var(--text-primary)]">
            <style>{`
                .inventario-tab {
                    padding: 8px 16px;
                    cursor: pointer;
                    border: 1px solid var(--border-color);
                    border-bottom: none;
                    background-color: var(--bg-main);
                    color: var(--text-secondary);
                    position: relative;
                    bottom: -1px;
                    border-radius: 10px 10px 0 0;
                    margin-right: 4px;
                    outline: none;
                    transition: background-color 0.3s, color 0.3s;
                }
                .inventario-tab.active {
                    background-color: var(--bg-card);
                    border-bottom-color: var(--bg-card);
                    color: var(--text-primary);
                    z-index: 10;
                    font-weight: 500;
                }
                 .inventario-table-container {
                    border: 1px solid var(--border-color);
                    background-color: var(--bg-card);
                    transition: background-color 0.3s, border-color 0.3s;
                 }
                .inventario-table thead th {
                    background-color: var(--bg-main);
                    border: 1px solid var(--border-color);
                    padding: 6px 10px;
                    font-weight: bold;
                    text-align: left;
                    font-size: 0.9rem;
                    color: var(--text-primary);
                    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
                }
                .inventario-table tbody {
                     background-color: var(--bg-card);
                     transition: background-color 0.3s;
                }
                .action-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background-color: var(--bg-main);
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    border: 2px solid var(--border-color);
                    transition: background-color 0.2s, color 0.2s, border-color 0.2s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .action-btn:hover {
                    background-color: var(--border-color);
                }
                 .action-btn:active {
                    transform: translateY(1px);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                }
            `}</style>

            {/* Combined Header for alignment */}
            <div className="px-4 pt-2 flex justify-between items-start">
                {/* Tabs */}
                <div className="flex">
                    <button 
                        onClick={() => setActiveTab('productos')}
                        className={`inventario-tab ${activeTab === 'productos' ? 'active' : ''}`}
                    >
                        Productos
                    </button>
                    <button 
                        onClick={() => setActiveTab('insumos')}
                        className={`inventario-tab ${activeTab === 'insumos' ? 'active' : ''}`}
                    >
                        Insumos
                    </button>
                </div>
                
                {/* Search Bar */}
                <div className="flex items-center">
                    <input 
                        type="text" 
                        placeholder="Nombre de cliente, c. pedido, telefono o correo"
                        className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-l p-1.5 text-sm w-80 focus:ring-2 focus:ring-[var(--secondary-green)] outline-none text-[var(--text-primary)]"
                    />
                    <button 
                        onClick={handleSearch}
                        className="bg-[var(--bg-main)] border border-[var(--border-color)] border-l-0 rounded-r p-1.5 hover:opacity-80"
                    >
                       {isSearching ? <SpinnerIcon /> : <SearchIcon />}
                    </button>
                </div>
            </div>

            {/* Table container */}
            <div className="flex-grow mx-4 mb-2 flex flex-col">
                <div className="flex-grow inventario-table-container overflow-hidden flex flex-col">
                    <div className="overflow-auto flex-grow">
                         <table className="w-full border-collapse inventario-table min-w-[900px]">
                            <thead>
                                <tr>
                                    {headers.map(header => (
                                        <th key={header}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="h-full">
                                {/* Empty state to match the image */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-2 flex items-center gap-4">
                <button className="action-btn" title="Añadir">
                    <PlusIcon />
                </button>
                <button className="action-btn" title="Editar">
                    <EditIcon />
                </button>
                 <button className="action-btn" title="Eliminar">
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

export default Inventario;