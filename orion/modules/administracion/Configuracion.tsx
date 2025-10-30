import React from 'react';

interface ConfiguracionProps {
}

const Configuracion: React.FC<ConfiguracionProps> = ({}) => {

    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Configuración del Sistema</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Ajusta los parámetros generales de la aplicación.</p>

            <div className="space-y-6">
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-[var(--text-primary)]">Nombre de la Empresa</label>
                    <input type="text" id="companyName" defaultValue="Hato Grande" className="mt-1 block w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--secondary-green)] focus:border-[var(--secondary-green)] sm:text-sm text-[var(--text-primary)]" />
                </div>
                <div>
                    <label htmlFor="defaultCurrency" className="block text-sm font-medium text-[var(--text-primary)]">Moneda por Defecto</label>
                    <select id="defaultCurrency" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-green)] focus:border-[var(--secondary-green)] sm:text-sm rounded-md bg-[var(--bg-main)] text-[var(--text-primary)]">
                        <option>COP - Peso Colombiano</option>
                        <option>USD - Dólar Americano</option>
                    </select>
                </div>
                <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                        <input id="maintenanceMode" type="checkbox" className="focus:ring-[var(--secondary-green)] h-4 w-4 text-[var(--secondary-green)] border-[var(--border-color)] rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="maintenanceMode" className="font-medium text-[var(--text-primary)]">Activar Modo Mantenimiento</label>
                        <p className="text-[var(--text-secondary)]">Los usuarios no podrán acceder al sistema.</p>
                    </div>
                </div>
                <button type="button" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--secondary-green)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary-green)]">
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
};

export default Configuracion;