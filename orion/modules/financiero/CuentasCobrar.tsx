import React from 'react';

const CuentasCobrar: React.FC = () => {
    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Cuentas por Cobrar</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Seguimiento de las facturas pendientes de pago por parte de los clientes.</p>

            <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-[var(--border-color)]">
                <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="text-xs uppercase bg-[var(--bg-main)] text-[var(--text-primary)]">
                        <tr>
                            <th scope="col" className="py-3 px-6">Factura</th>
                            <th scope="col" className="py-3 px-6">Cliente</th>
                            <th scope="col" className="py-3 px-6">Fecha Venc.</th>
                            <th scope="col" className="py-3 px-6">Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-[var(--border-color)]">
                            <td className="py-4 px-6 font-medium text-[var(--text-primary)]">FV-0789</td>
                            <td className="py-4 px-6">Empresa ABC</td>
                            <td className="py-4 px-6 text-red-500 dark:text-red-400">15/07/2024 (Vencida)</td>
                            <td className="py-4 px-6">$ 1.200.000</td>
                        </tr>
                         <tr className="border-b border-[var(--border-color)]">
                            <td className="py-4 px-6 font-medium text-[var(--text-primary)]">FV-0790</td>
                            <td className="py-4 px-6">Servicios XYZ</td>
                            <td className="py-4 px-6">30/07/2024</td>
                            <td className="py-4 px-6">$ 500.000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CuentasCobrar;