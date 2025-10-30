import React from 'react';

const Produccion: React.FC = () => {
    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Control de Producción</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Planifica y sigue el progreso de las órdenes de producción.</p>
            
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-[var(--border-color)]">
                <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="text-xs uppercase bg-[var(--bg-main)] text-[var(--text-primary)]">
                        <tr>
                            <th scope="col" className="py-3 px-6"># OP</th>
                            <th scope="col" className="py-3 px-6">Producto a Fabricar</th>
                            <th scope="col" className="py-3 px-6">Cantidad</th>
                            <th scope="col" className="py-3 px-6">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-[var(--border-color)]">
                            <td className="py-4 px-6 font-medium text-[var(--text-primary)]">OP-0234</td>
                            <td className="py-4 px-6">Queso Campesino 500g</td>
                            <td className="py-4 px-6">500 unidades</td>
                            <td className="py-4 px-6"><span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">En Proceso</span></td>
                        </tr>
                        <tr className="border-b border-[var(--border-color)]">
                            <td className="py-4 px-6 font-medium text-[var(--text-primary)]">OP-0235</td>
                            <td className="py-4 px-6">Yogur de Fresa 1L</td>
                            <td className="py-4 px-6">300 unidades</td>
                            <td className="py-4 px-6"><span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Planeada</span></td>
                        </tr>
                         <tr className="border-b border-[var(--border-color)]">
                            <td className="py-4 px-6 font-medium text-[var(--text-primary)]">OP-0233</td>
                            <td className="py-4 px-6">Arequipe 450g</td>
                            <td className="py-4 px-6">400 unidades</td>
                             <td className="py-4 px-6"><span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Finalizada</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Produccion;