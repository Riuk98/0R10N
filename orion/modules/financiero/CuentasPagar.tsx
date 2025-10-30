import React from 'react';

const CuentasPagar: React.FC = () => {
    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Cuentas por Pagar</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Administra y programa los pagos a tus proveedores.</p>

            <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-[var(--border-color)]">
                <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="text-xs uppercase bg-[var(--bg-main)] text-[var(--text-primary)]">
                        <tr>
                            <th scope="col" className="py-3 px-6">Factura Prov.</th>
                            <th scope="col" className="py-3 px-6">Proveedor</th>
                            <th scope="col" className="py-3 px-6">Fecha Venc.</th>
                            <th scope="col" className="py-3 px-6">Monto a Pagar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-[var(--border-color)]">
                            <td className="py-4 px-6 font-medium text-[var(--text-primary)]">FC-PROV-556</td>
                            <td className="py-4 px-6">Insumos del Campo</td>
                            <td className="py-4 px-6">25/07/2024</td>
                            <td className="py-4 px-6">$ 3.500.000</td>
                        </tr>
                         <tr className="border-b border-[var(--border-color)]">
                            <td className="py-4 px-6 font-medium text-[var(--text-primary)]">FC-PROV-557</td>
                            <td className="py-4 px-6">Empaques S.A.</td>
                            <td className="py-4 px-6">05/08/2024</td>
                            <td className="py-4 px-6">$ 1.800.000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CuentasPagar;