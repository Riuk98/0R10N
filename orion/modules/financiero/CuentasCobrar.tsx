import React, { useState, useEffect, useMemo } from 'react';

// --- TYPE DEFINITION ---
export interface CuentaPorCobrar {
    id: string;
    facturaId: string;
    clienteNit: string;
    clienteNombre: string;
    clienteTelefono: string;
    ciudad: string;
    fechaEmision: string;
    fechaVencimiento: string;
    valorFactura: number;
    saldo: number;
}

const CUENTAS_COBRAR_STORAGE_KEY = 'orionCuentasCobrar';

// --- MOCK DATA ---
const initialCuentasCobrar: CuentaPorCobrar[] = [
    {
        id: 'CXC-FAC-001',
        facturaId: 'FAC-001',
        clienteNit: '900.111.222-1',
        clienteNombre: 'Cliente Fiel S.A.S.',
        clienteTelefono: '3109876543',
        ciudad: 'Bogotá',
        fechaEmision: '2024-07-15',
        fechaVencimiento: '2024-08-14',
        valorFactura: 2500000,
        saldo: 2500000,
    },
    {
        id: 'CXC-FAC-002',
        facturaId: 'FAC-002',
        clienteNit: '800.333.444-5',
        clienteNombre: 'Mercado El Ahorro',
        clienteTelefono: '3201234567',
        ciudad: 'Medellín',
        fechaEmision: '2024-06-20',
        fechaVencimiento: '2024-07-20',
        valorFactura: 800000,
        saldo: 300000,
    },
    {
        id: 'CXC-FAC-003',
        facturaId: 'FAC-003',
        clienteNit: '901.234.567-9',
        clienteNombre: 'Comercializadora y Logística Integral',
        clienteTelefono: '3178889999',
        ciudad: 'Bogotá',
        fechaEmision: '2024-05-30',
        fechaVencimiento: '2024-06-29',
        valorFactura: 5200000,
        saldo: 5200000,
    },
    {
        id: 'CXC-FAC-004',
        facturaId: 'FAC-004',
        clienteNit: '800.567.890-1',
        clienteNombre: 'Servicios Generales El Progreso',
        clienteTelefono: '3190001111',
        ciudad: 'Bogotá',
        fechaEmision: '2024-08-01',
        fechaVencimiento: '2024-08-31',
        valorFactura: 1800000,
        saldo: 1800000,
    },
    {
        id: 'CXC-FAC-005',
        facturaId: 'FAC-005',
        clienteNit: '900.111.222-1',
        clienteNombre: 'Cliente Fiel S.A.S.',
        clienteTelefono: '3109876543',
        ciudad: 'Bogotá',
        fechaEmision: '2024-08-05',
        fechaVencimiento: '2024-09-04',
        valorFactura: 3200000,
        saldo: 1000000,
    },
    {
        id: 'CXC-FAC-006',
        facturaId: 'FAC-006',
        clienteNit: '800.333.444-5',
        clienteNombre: 'Mercado El Ahorro',
        clienteTelefono: '3201234567',
        ciudad: 'Medellín',
        fechaEmision: '2024-08-10',
        fechaVencimiento: '2024-09-09',
        valorFactura: 750000,
        saldo: 750000,
    },
];

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


const CuentasCobrar: React.FC = () => {
    const [cuentas, setCuentas] = useState<CuentaPorCobrar[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const loadCuentas = () => {
        try {
            const storedCuentas = localStorage.getItem(CUENTAS_COBRAR_STORAGE_KEY);
            if (storedCuentas) {
                setCuentas(JSON.parse(storedCuentas));
            } else {
                setCuentas(initialCuentasCobrar);
                localStorage.setItem(CUENTAS_COBRAR_STORAGE_KEY, JSON.stringify(initialCuentasCobrar));
            }
        } catch (error) {
            console.error("Failed to load accounts receivable:", error);
            setCuentas(initialCuentasCobrar);
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
            c.clienteNombre.toLowerCase().includes(lowercasedFilter) ||
            c.clienteNit.includes(lowercasedFilter) ||
            c.facturaId.toLowerCase().includes(lowercasedFilter)
        );
    }, [cuentas, searchTerm]);
    
    const handleViewDetails = (cuenta: CuentaPorCobrar) => {
        window.dispatchEvent(new CustomEvent('createOrionWindow', {
            detail: {
                title: 'Detalle Cuenta por Cobrar',
                props: { cuenta: cuenta }
            }
        }));
    };

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
        "NIT", "Nombre", "Teléfono", "Ciudad", "Dias Mora", "Vlr. Total Fac.", 
        "Dto. Pto. Pago", "F. Dcto.", "Saldo", "0 - 30 Dias", "31 - 60 Dias", 
        "61 - 90 Dias", "91 y más dias"
    ];

    const totals = useMemo(() => {
        return filteredCuentas.reduce((acc, cuenta) => {
            const diasMora = calculateDiasMora(cuenta.fechaVencimiento, cuenta.saldo);
            const buckets = getAgingBucket(diasMora, cuenta.saldo);
            acc.total += cuenta.valorFactura;
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
                .cxc-container {
                    padding: 1rem;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    font-family: sans-serif;
                    font-size: 0.8rem;
                    color: var(--text-primary);
                    background-color: var(--bg-card);
                }
                .cxc-filters {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }
                .cxc-left-filters {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .cxc-filter-group {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .cxc-filter-group label {
                    font-weight: 500;
                }
                .cxc-input, .cxc-date-input {
                    background-color: var(--bg-main);
                    border: 1px solid var(--border-color);
                    border-radius: 0.375rem;
                    padding: 0.25rem 0.5rem;
                    color: var(--text-primary);
                }
                 .cxc-input.with-icon {
                    padding-left: 2.25rem;
                }
                .cxc-date-input {
                    min-width: 150px;
                }
                .cxc-checkbox-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .cxc-checkbox-item {
                     display: flex;
                     align-items: center;
                     gap: 0.5rem;
                }
                .cxc-checkbox-item input[type="checkbox"] {
                     height: 1rem;
                     width: 1rem;
                     border-radius: 0.25rem;
                     border-color: var(--border-color);
                     color: var(--secondary-green);
                     background-color: var(--bg-main);
                }
                .cxc-table-container {
                    flex-grow: 1;
                    border: 1px solid var(--border-color);
                    overflow: auto;
                    border-radius: 0.5rem;
                }
                .cxc-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 1400px;
                }
                .cxc-table thead {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                .cxc-table th, .cxc-table td {
                    padding: 0.5rem;
                    border: 1px solid var(--border-color);
                    text-align: center;
                    white-space: nowrap;
                }
                .cxc-table th {
                    background-color: var(--bg-main);
                    font-weight: bold;
                }
                .cxc-table tbody tr {
                    background-color: var(--bg-card);
                }
                 .cxc-table tbody td:nth-child(2) {
                    text-align: left;
                }
                .cxc-footer {
                    flex-shrink: 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 0.5rem;
                }
                .cxc-footer-actions button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-secondary);
                }
                .cxc-footer-actions button:hover {
                    color: var(--text-primary);
                }
                .cxc-footer-summary {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 4px;
                }
                .cxc-footer-summary input {
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
                    .cxc-filters {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 1rem;
                    }
                    .cxc-left-filters {
                        flex-wrap: wrap;
                        gap: 1rem;
                        justify-content: center;
                    }
                    .cxc-footer {
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                }
            `}</style>
            <div className="cxc-container">
                {/* Filters */}
                <div className="cxc-filters">
                    <div className="cxc-left-filters">
                        <div className="cxc-filter-group">
                            <label htmlFor="desde">Desde:</label>
                            <input id="desde" type="date" className="cxc-date-input" />
                        </div>
                         <div className="cxc-filter-group">
                            <label htmlFor="hasta">Hasta:</label>
                            <input id="hasta" type="date" className="cxc-date-input" />
                        </div>
                        <div className="cxc-checkbox-group">
                            <div className="cxc-checkbox-item">
                                <input id="pendientes" type="checkbox" defaultChecked/>
                                <label htmlFor="pendientes">Pendientes</label>
                            </div>
                        </div>
                    </div>
                    
                     <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por NIT, nombre o factura..."
                            className="cxc-input with-icon"
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
                <div className="cxc-table-container">
                    <table className="cxc-table">
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
                                    <tr key={cuenta.id} onDoubleClick={() => handleViewDetails(cuenta)} className="cursor-pointer hover:bg-[var(--bg-main)]/50">
                                        <td>{cuenta.clienteNit}</td>
                                        <td>{cuenta.clienteNombre}</td>
                                        <td>{cuenta.clienteTelefono}</td>
                                        <td>{cuenta.ciudad}</td>
                                        <td className={diasMora > 0 ? 'text-red-600 font-bold' : ''}>{diasMora}</td>
                                        <td>{formatCurrency(cuenta.valorFactura)}</td>
                                        <td></td>{/* Dto. Pto. Pago */}
                                        <td></td>{/* F. Dcto. */}
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
                <div className="cxc-footer">
                    <div className="cxc-footer-actions flex items-center gap-2">
                        <button title="Descargar"><CloudDownloadIcon className="w-6 h-6" /></button>
                        <button title="Refrescar" onClick={loadCuentas}><RefreshIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="cxc-footer-summary">
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

export default CuentasCobrar;