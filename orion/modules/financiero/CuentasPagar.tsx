import React, { useState, useEffect, useMemo } from 'react';

// --- TYPE DEFINITION ---
interface CuentaPorPagar {
    id: string;
    ordenCompraId: string;
    proveedorId: string;
    proveedorNombre: string;
    fechaRecepcion: string;
    fechaVencimiento: string;
    valorTotal: number;
    saldo: number;
}

const CUENTAS_PAGAR_STORAGE_KEY = 'orionCuentasPagar';

// --- ICONS ---
const CloudDownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const RefreshIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

// MOCK DATA for initial load if localStorage is empty
const initialCuentasPagar: CuentaPorPagar[] = [
    { id: 'CXP-OC-0052', ordenCompraId: 'OC-0052', proveedorId: '860.777.888-2', proveedorNombre: 'Agroinsumos La Finca', fechaRecepcion: '2024-07-28', fechaVencimiento: '2024-08-27', valorTotal: 1200000, saldo: 1200000 },
    { id: 'CXP-OC-0053', ordenCompraId: 'OC-0053', proveedorId: '900.999.000-3', proveedorNombre: 'Envases Plásticos de Colombia', fechaRecepcion: '2024-07-30', fechaVencimiento: '2024-08-29', valorTotal: 850000, saldo: 350000 },
    { id: 'CXP-OC-0055', ordenCompraId: 'OC-0055', proveedorId: '901.234.567-8', proveedorNombre: 'Transportes Rápidos LTDA', fechaRecepcion: '2024-07-26', fechaVencimiento: '2024-08-25', valorTotal: 450000, saldo: 450000 },
];


const CuentasPagar: React.FC = () => {
    const [cuentas, setCuentas] = useState<CuentaPorPagar[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const loadCuentas = () => {
        try {
            const storedCuentas = localStorage.getItem(CUENTAS_PAGAR_STORAGE_KEY);
            if (storedCuentas) {
                setCuentas(JSON.parse(storedCuentas));
            } else {
                setCuentas(initialCuentasPagar);
                localStorage.setItem(CUENTAS_PAGAR_STORAGE_KEY, JSON.stringify(initialCuentasPagar));
            }
        } catch (error) {
            console.error("Failed to load accounts payable:", error);
            setCuentas(initialCuentasPagar);
        }
    };
    
    useEffect(() => {
        loadCuentas();
        window.addEventListener('storage', loadCuentas);
        return () => window.removeEventListener('storage', loadCuentas);
    }, []);

    const filteredCuentas = useMemo(() => {
        if (!searchTerm) return cuentas;
        const lowercasedFilter = searchTerm.toLowerCase();
        return cuentas.filter(c => 
            c.proveedorNombre.toLowerCase().includes(lowercasedFilter) ||
            c.proveedorId.includes(lowercasedFilter) ||
            c.ordenCompraId.toLowerCase().includes(lowercasedFilter)
        );
    }, [cuentas, searchTerm]);

    const calculateDiasMora = (fechaVencimiento: string, saldo: number) => {
        if (saldo <= 0) return 0;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Compare dates only, ignoring time
        const vencimiento = new Date(fechaVencimiento);
        if (hoy <= vencimiento) return 0;
        const diffTime = hoy.getTime() - vencimiento.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getAgingBucket = (diasMora: number, saldo: number) => {
        if (diasMora <= 30) return { '0-30': saldo, '31-60': 0, '61-90': 0, '91+': 0 };
        if (diasMora <= 60) return { '0-30': 0, '31-60': saldo, '61-90': 0, '91+': 0 };
        if (diasMora <= 90) return { '0-30': 0, '31-60': 0, '61-90': saldo, '91+': 0 };
        return { '0-30': 0, '31-60': 0, '61-90': 0, '91+': saldo };
    };

    const formatCurrency = (value: number) => value === 0 ? '' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

    const tableHeaders = [
        "O. Compra", "NIT", "Proveedor", "F. Recepción", "F. Vencimiento", "Días Mora", "Valor Total", 
        "Saldo", "0 - 30 Días", "31 - 60 Días", "61 - 90 Días", "91 y más días"
    ];

    const totals = useMemo(() => {
        return filteredCuentas.reduce((acc, cuenta) => {
            const diasMora = calculateDiasMora(cuenta.fechaVencimiento, cuenta.saldo);
            const buckets = getAgingBucket(diasMora, cuenta.saldo);
            acc.total += cuenta.valorTotal;
            acc.saldo += cuenta.saldo;
            acc['0-30'] += buckets['0-30'];
            acc['31-60'] += buckets['31-60'];
            acc['61-90'] += buckets['61-90'];
            acc['91+'] += buckets['91+'];
            return acc;
        }, { total: 0, saldo: 0, '0-30': 0, '31-60': 0, '61-90': 0, '91+': 0 });
    }, [filteredCuentas]);


    return (
        <>
            <style>{`
                /* Using cxp prefix to avoid conflicts with cxc styles if they are ever loaded together */
                .cxp-container {
                    padding: 1rem;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    font-family: sans-serif;
                    font-size: 0.8rem;
                    color: var(--text-primary);
                    background-color: var(--bg-card);
                }
                .cxp-filters {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }
                .cxp-left-filters {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .cxp-filter-group {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .cxp-filter-group label {
                    font-weight: 500;
                }
                .cxp-input, .cxp-date-input {
                    background-color: var(--bg-main);
                    border: 1px solid var(--border-color);
                    border-radius: 0.375rem;
                    padding: 0.25rem 0.5rem;
                    color: var(--text-primary);
                }
                 .cxp-input.with-icon {
                    padding-left: 2.25rem;
                }
                .cxp-date-input {
                    min-width: 150px;
                }
                .cxp-table-container {
                    flex-grow: 1;
                    border: 1px solid var(--border-color);
                    overflow: auto;
                    border-radius: 0.5rem;
                }
                .cxp-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 1400px;
                }
                .cxp-table thead {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                .cxp-table th, .cxp-table td {
                    padding: 0.5rem;
                    border: 1px solid var(--border-color);
                    text-align: center;
                    white-space: nowrap;
                }
                .cxp-table th {
                    background-color: var(--bg-main);
                    font-weight: bold;
                }
                .cxp-table tbody tr {
                    background-color: var(--bg-card);
                }
                 .cxp-table tbody td:nth-child(3) {
                    text-align: left;
                }
                .cxp-footer {
                    flex-shrink: 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 0.5rem;
                }
                .cxp-footer-actions button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-secondary);
                }
                .cxp-footer-actions button:hover {
                    color: var(--text-primary);
                }
                .cxp-footer-summary {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 4px;
                }
                .cxp-footer-summary input {
                    width: 90px;
                    text-align: right;
                    background-color: var(--bg-main);
                    border: 1px solid var(--border-color);
                    border-radius: 0.25rem;
                    padding: 0.25rem;
                    font-size: 0.75rem;
                    font-weight: bold;
                }
                 @media (max-width: 768px) {
                    .cxp-filters { flex-direction: column; align-items: stretch; gap: 1rem; }
                    .cxp-left-filters { flex-wrap: wrap; gap: 1rem; justify-content: center; }
                    .cxp-footer { flex-direction: column; gap: 0.5rem; }
                }
            `}</style>
            <div className="cxp-container">
                {/* Filters */}
                <div className="cxp-filters">
                    <div className="cxp-left-filters">
                        <div className="cxp-filter-group">
                            <label htmlFor="desde">Vencimiento Desde:</label>
                            <input id="desde" type="date" className="cxp-date-input" />
                        </div>
                         <div className="cxp-filter-group">
                            <label htmlFor="hasta">Hasta:</label>
                            <input id="hasta" type="date" className="cxp-date-input" />
                        </div>
                    </div>
                    
                     <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por NIT, proveedor u OC..."
                            className="cxp-input with-icon"
                            style={{ width: '250px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none">
                            <SearchIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="cxp-table-container">
                    <table className="cxp-table">
                        <thead>
                            <tr>
                                {tableHeaders.map(header => <th key={header}>{header}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCuentas.map(cuenta => {
                                const diasMora = calculateDiasMora(cuenta.fechaVencimiento, cuenta.saldo);
                                const buckets = getAgingBucket(diasMora, cuenta.saldo);
                                return (
                                    <tr key={cuenta.id}>
                                        <td>{cuenta.ordenCompraId}</td>
                                        <td>{cuenta.proveedorId}</td>
                                        <td>{cuenta.proveedorNombre}</td>
                                        <td>{new Date(cuenta.fechaRecepcion).toLocaleDateString('es-CO')}</td>
                                        <td>{new Date(cuenta.fechaVencimiento).toLocaleDateString('es-CO')}</td>
                                        <td className={diasMora > 0 ? 'text-red-600 font-bold' : ''}>{diasMora}</td>
                                        <td>{formatCurrency(cuenta.valorTotal)}</td>
                                        <td className="font-semibold">{formatCurrency(cuenta.saldo)}</td>
                                        <td>{formatCurrency(buckets['0-30'])}</td>
                                        <td>{formatCurrency(buckets['31-60'])}</td>
                                        <td>{formatCurrency(buckets['61-90'])}</td>
                                        <td>{formatCurrency(buckets['91+'])}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="cxp-footer">
                    <div className="cxp-footer-actions flex items-center gap-2">
                        <button title="Descargar"><CloudDownloadIcon className="w-6 h-6" /></button>
                        <button title="Refrescar" onClick={loadCuentas}><RefreshIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="cxp-footer-summary">
                        <input type="text" readOnly value={formatCurrency(totals['0-30'])} title="Total 0-30 Días" />
                        <input type="text" readOnly value={formatCurrency(totals['31-60'])} title="Total 31-60 Días" />
                        <input type="text" readOnly value={formatCurrency(totals['61-90'])} title="Total 61-90 Días" />
                        <input type="text" readOnly value={formatCurrency(totals['91+'])} title="Total 91+ Días" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CuentasPagar;