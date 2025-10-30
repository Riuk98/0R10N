import React from 'react';

const Compras: React.FC = () => {
    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Gestión de Compras</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Crea y gestiona las órdenes de compra a proveedores.</p>
            
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-[var(--border-color)]">
                <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="text-xs uppercase bg-[var(--bg-main)] text-[var(--text-primary)]">
                        <tr>
                            <th scope="col" className="py-3 px-6"># OC</th>
                            <th scope="col" className="py-3 px-6">Proveedor</th>
                            <th scope="col" className="py-3 px-6">Fecha Esperada</th>
                            <th scope="col" className="py-3 px-6">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-[var(--border-color)]">
                            <td className="py-4 px-6 font-medium text-[var(--text-primary)]">OC-0051</td>
                            <td className="py-4 px-6">Insumos del Campo</td>
                            <td className="py-4 px-6">28/07/2024</td>
                            <td className="py-4 px-6"><span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Enviada</span></td>
                        </tr>
                        <tr className="border-b border-[var(--border-color)]">
                            <td className="py-4 px-6 font-medium text-[var(--text-primary)]">OC-0050</td>
                            <td className="py-4 px-6">Empaques S.A.</td>
                            <td className="py-4 px-6">20/07/2024</td>
                             <td className="py-4 px-6"><span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Recibida</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Compras;