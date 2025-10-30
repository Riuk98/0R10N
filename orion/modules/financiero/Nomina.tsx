import React from 'react';

const Nomina: React.FC = () => {
    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Nómina</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Calcula y gestiona el pago de salarios y prestaciones de tus empleados.</p>
            
            <div className="text-center p-4 mb-4 border border-dashed border-[var(--border-color)] rounded-lg">
                <p>Próximo período de pago: <strong>1 - 15 de Agosto de 2024</strong></p>
                <button className="mt-2 px-4 py-2 text-sm font-medium text-white bg-[var(--secondary-green)] rounded-md hover:opacity-90">
                    Liquidar Nómina
                </button>
            </div>

             <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-[var(--border-color)]">
                <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="text-xs uppercase bg-[var(--bg-main)] text-[var(--text-primary)]">
                        <tr>
                            <th scope="col" className="py-3 px-6">Empleado</th>
                            <th scope="col" className="py-3 px-6">Cargo</th>
                            <th scope="col" className="py-3 px-6">Salario Base</th>
                            <th scope="col" className="py-3 px-6">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-[var(--border-color)]">
                            <td className="py-4 px-6 font-medium text-[var(--text-primary)]">Ana María Rojas</td>
                            <td className="py-4 px-6">Jefe de Producción</td>
                            <td className="py-4 px-6">$ 2.800.000</td>
                            <td className="py-4 px-6 text-green-500 dark:text-green-400">Activo</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Nomina;