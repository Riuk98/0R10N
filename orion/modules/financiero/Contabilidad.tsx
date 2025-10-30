import React from 'react';

const Contabilidad: React.FC = () => {
    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Contabilidad</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Registro y consulta de asientos contables y estados financieros.</p>
            
             <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-[var(--border-color)]">
                <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="text-xs uppercase bg-[var(--bg-main)] text-[var(--text-primary)]">
                        <tr>
                            <th scope="col" className="py-3 px-6">Fecha</th>
                            <th scope="col" className="py-3 px-6">Cuenta</th>
                            <th scope="col" className="py-3 px-6">Descripción</th>
                            <th scope="col" className="py-3 px-6">Débito</th>
                            <th scope="col" className="py-3 px-6">Crédito</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-[var(--border-color)]">
                            <td className="py-4 px-6">23/07/2024</td>
                            <td className="py-4 px-6 font-medium text-[var(--text-primary)]">110505 - Caja General</td>
                            <td className="py-4 px-6">Venta de contado</td>
                            <td className="py-4 px-6">$ 500.000</td>
                            <td className="py-4 px-6"></td>
                        </tr>
                        <tr className="border-b border-[var(--border-color)]">
                             <td className="py-4 px-6">23/07/2024</td>
                             <td className="py-4 px-6 font-medium text-[var(--text-primary)]">4135 - Ingresos por Venta</td>
                             <td className="py-4 px-6">Venta de contado</td>
                             <td className="py-4 px-6"></td>
                             <td className="py-4 px-6">$ 500.000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Contabilidad;