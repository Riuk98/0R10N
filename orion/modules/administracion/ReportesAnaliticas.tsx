import React from 'react';

const ReportesAnaliticas: React.FC = () => {
    const reports = [
        "Reporte de Ventas por Periodo",
        "Análisis de Rentabilidad por Producto",
        "Informe de Cuentas por Cobrar Vencidas",
        "Balance General",
        "Estado de Resultados (P&G)",
        "Seguimiento de Inventario y Valoración"
    ];

    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Reportes y Analíticas</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Genera informes detallados para la toma de decisiones estratégicas.</p>
            
            <ul className="space-y-3">
                {reports.map((report, index) => (
                    <li key={index} className="p-4 bg-[var(--bg-main)] rounded-md flex justify-between items-center border border-[var(--border-color)] hover:bg-[var(--accent-green-soft)] transition-colors duration-200">
                        <span className="font-medium">{report}</span>
                        <a href="#" className="text-sm text-[var(--secondary-green)] hover:opacity-80 hover:underline">Generar</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReportesAnaliticas;