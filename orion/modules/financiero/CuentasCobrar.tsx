
import React from 'react';

// --- ICONS ---
const CloudDownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const RefreshIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    const tableHeaders = [
        "NIT", "Nombre", "Teléfono", "Ciudad", "Dias Mora", "Vlr. Total Fac.", 
        "Dto. Pto. Pago", "F. Dcto.", "Saldo", "0 - 30 Dias", "31 - 60 Dias", 
        "61 - 90 Dias", "91 y más dias"
    ];

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
                }
                .cxc-table thead {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                .cxc-table th {
                    background-color: var(--bg-main);
                    padding: 0.5rem;
                    border: 1px solid var(--border-color);
                    font-weight: bold;
                    text-align: center;
                    white-space: nowrap;
                }
                .cxc-table tbody tr {
                    background-color: var(--bg-card);
                }
                .cxc-table tbody td {
                     border: 1px solid var(--border-color);
                     height: 1.5rem; /* For empty cells */
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
                .cxc-footer-summary input {
                    width: 80px;
                    text-align: right;
                    background-color: var(--bg-main);
                    border: 1px solid var(--border-color);
                    border-radius: 0.25rem;
                    padding: 0.25rem;
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
                                <input id="pendientes" type="checkbox" />
                                <label htmlFor="pendientes">Pendientes</label>
                            </div>
                        </div>
                    </div>
                    
                     <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="cxc-input with-icon"
                            style={{ width: '250px' }}
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
                            {/* Empty body to match screenshot */}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="cxc-footer">
                    <div className="cxc-footer-actions flex items-center gap-2">
                        <button title="Descargar"><CloudDownloadIcon className="w-6 h-6" /></button>
                        <button title="Refrescar"><RefreshIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="cxc-footer-summary flex items-center gap-1">
                        <input type="text" disabled />
                        <input type="text" disabled />
                        <input type="text" disabled />
                        <input type="text" disabled />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CuentasCobrar;
