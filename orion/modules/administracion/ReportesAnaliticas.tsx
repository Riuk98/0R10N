import React from 'react';

// --- SVG ICONS ---
const DollarSignIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

const ActivityIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
);

const TargetIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
    </svg>
);

// --- COMPONENTS ---

interface KpiCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, isPositive, icon }) => (
    <div className="bg-[var(--bg-main)] p-4 rounded-lg shadow-sm border border-[var(--border-color)] flex items-center gap-4">
        <div className="p-3 rounded-full bg-[var(--accent-green-soft)] text-[var(--secondary-green)]">
            {icon}
        </div>
        <div>
            <p className="text-sm text-[var(--text-secondary)]">{title}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
            <p className={`text-xs font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {change}
            </p>
        </div>
    </div>
);

const SalesChart = () => {
    const salesData = [
        { month: 'Feb', sales: 65 }, { month: 'Mar', sales: 59 }, { month: 'Abr', sales: 80 },
        { month: 'May', sales: 81 }, { month: 'Jun', sales: 56 }, { month: 'Jul', sales: 95 }
    ];
    const maxSales = 100;

    return (
        <div className="bg-[var(--bg-main)] p-4 rounded-lg shadow-sm border border-[var(--border-color)]">
            <h4 className="font-bold mb-4 text-[var(--text-primary)]">Ventas Últimos 6 Meses</h4>
            <div className="flex justify-around items-end h-48">
                {salesData.map(data => (
                    <div key={data.month} className="flex flex-col items-center w-1/6">
                        <div 
                            className="w-8 bg-[var(--secondary-green)] rounded-t-sm hover:opacity-80 transition-opacity" 
                            style={{ height: `${(data.sales / maxSales) * 100}%` }}
                            title={`$${(data.sales * 1000000).toLocaleString('es-CO')}`}
                        ></div>
                        <p className="text-xs mt-2 font-semibold text-[var(--text-secondary)]">{data.month}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CategoryChart = () => {
    const categories = [
        { name: 'Quesos', percentage: 45, color: 'var(--secondary-green)' },
        { name: 'Yogures', percentage: 25, color: '#18bedb' },
        { name: 'Postres', percentage: 18, color: '#A9DFBF' },
        { name: 'Otros', percentage: 12, color: 'var(--text-secondary)' },
    ];

    let cumulativePercentage = 0;
    const circumference = 2 * Math.PI * 45; // 2 * pi * radius

    return (
        <div className="bg-[var(--bg-main)] p-4 rounded-lg shadow-sm border border-[var(--border-color)]">
            <h4 className="font-bold mb-4 text-[var(--text-primary)]">Ventas por Categoría</h4>
            <div className="flex items-center gap-6">
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        {categories.map(cat => {
                            const offset = (cumulativePercentage / 100) * circumference;
                            const dash = (cat.percentage / 100) * circumference;
                            cumulativePercentage += cat.percentage;
                            return (
                                <circle
                                    key={cat.name}
                                    cx="50" cy="50" r="45"
                                    fill="transparent"
                                    stroke={cat.color}
                                    strokeWidth="10"
                                    strokeDasharray={`${dash} ${circumference - dash}`}
                                    strokeDashoffset={-offset}
                                    transform="rotate(-90 50 50)"
                                />
                            );
                        })}
                    </svg>
                </div>
                <div className="space-y-2">
                    {categories.map(cat => (
                         <div key={cat.name} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                            <span className="text-sm font-medium">{cat.name} ({cat.percentage}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


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
        <div className="p-4 space-y-6">
            <div>
                <h3 className="text-lg font-bold">Dashboard de Analíticas</h3>
                <p className="text-sm text-[var(--text-secondary)]">Visualiza el rendimiento de tu negocio con métricas clave.</p>
            </div>
            
            {/* --- DASHBOARD SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <KpiCard 
                        title="Ventas del Mes" 
                        value="$95.0M" 
                        change="+12.5% vs mes anterior" 
                        isPositive={true} 
                        icon={<DollarSignIcon />}
                    />
                     <KpiCard 
                        title="Pedidos Nuevos" 
                        value="1,240" 
                        change="+8.1% vs mes anterior" 
                        isPositive={true} 
                        icon={<ShoppingCartIcon />}
                    />
                     <KpiCard 
                        title="Ticket Promedio" 
                        value="$76,612" 
                        change="-1.2% vs mes anterior" 
                        isPositive={false} 
                        icon={<ActivityIcon />}
                    />
                     <KpiCard 
                        title="Tasa de Conversión" 
                        value="3.4%" 
                        change="+0.5% vs mes anterior" 
                        isPositive={true} 
                        icon={<TargetIcon />}
                    />
                </div>
                <div className="space-y-4">
                    <SalesChart />
                </div>
                 <div className="lg:col-span-2">
                    <CategoryChart />
                </div>
            </div>

            {/* --- REPORTS LIST SECTION --- */}
            <div>
                 <h3 className="text-lg font-bold mb-4">Generar Reportes Específicos</h3>
                <ul className="space-y-3">
                    {reports.map((report, index) => (
                        <li key={index} className="p-4 bg-[var(--bg-main)] rounded-md flex justify-between items-center border border-[var(--border-color)] hover:shadow-md transition-shadow duration-200">
                            <span className="font-medium">{report}</span>
                            <a href="#" className="text-sm text-[var(--secondary-green)] hover:opacity-80 hover:underline font-semibold">Generar</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ReportesAnaliticas;
