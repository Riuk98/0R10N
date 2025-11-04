

import React, { useState, useEffect, useMemo } from 'react';
import { products as hatoGrandeProducts } from '../../../hatogrande/data';
import { OrionProduct } from '../operaciones/Inventario';

// --- TYPE DEFINITIONS ---
interface KpiData {
    ventasTotales: number;
    pedidosNuevos: number;
    ticketPromedio: number;
}
interface SalesByCategory {
    name: string;
    percentage: number;
    color: string;
}
interface OrionOrder {
    id: string;
    creationDate: string;
    total: number;
    items: {
        productId: number;
        totalPrice: number;
    }[];
}
interface Ticket {
    id: string; 
    estado: 'Abierto' | 'En proceso' | 'Cerrado';
    tipo: 'Queja' | 'Peticion' | 'Sugerencia' | 'Reclamacion' | 'Otros';
    // FIX: Add creationDate property to match the data structure created during data loading.
    creationDate: string;
}

// --- ICONS ---
const DollarSignIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>);
const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>);
const ActivityIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>);

// --- HELPER FUNCTIONS ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

// --- CHART COMPONENTS ---

// Initial Dashboard Charts
const InitialSalesTrendChart: React.FC<{ data: { day: string, sales: number }[] }> = ({ data }) => {
    const maxSales = Math.max(...data.map(d => d.sales), 1);
    return (
        <div className="bg-[var(--bg-main)] p-4 rounded-lg shadow-sm border border-[var(--border-color)] h-full">
            <h4 className="font-bold mb-4 text-[var(--text-primary)]">Tendencia de Ventas (Últimos 15 Días)</h4>
            <div className="h-48 relative">
                 {/* Line */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <path
                        d={data.map((d, i) =>
                            `${i === 0 ? 'M' : 'L'} ${(i / (data.length - 1)) * 100}% ${100 - (d.sales / maxSales) * 100}%`
                        ).join(' ')}
                        fill="none"
                        stroke="var(--secondary-green)"
                        strokeWidth="2"
                    />
                </svg>
                 {/* Points */}
                <div className="absolute inset-0 flex justify-around">
                    {data.map((d, i) => (
                        <div key={i} className="relative h-full w-px">
                            <div
                                className="absolute w-2 h-2 bg-[var(--secondary-green)] rounded-full -translate-x-1/2"
                                style={{ bottom: `calc(${(d.sales / maxSales) * 100}% - 4px)` }}
                                title={`${d.day}: ${formatCurrency(d.sales)}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DoughnutChart: React.FC<{ data: { label: string, value: number, color: string }[], title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return (
        <div className="bg-[var(--bg-main)] p-4 rounded-lg shadow-sm border border-[var(--border-color)] h-full">
            <h4 className="font-bold mb-4 text-[var(--text-primary)]">{title}</h4>
            <p className="text-center text-[var(--text-secondary)] py-10">No hay datos disponibles.</p>
        </div>
    );

    let cumulativePercentage = 0;
    const circumference = 2 * Math.PI * 45;

    return (
        <div className="bg-[var(--bg-main)] p-4 rounded-lg shadow-sm border border-[var(--border-color)] h-full">
            <h4 className="font-bold mb-4 text-[var(--text-primary)]">{title}</h4>
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        {data.map(item => {
                            const percentage = (item.value / total) * 100;
                            const offset = (cumulativePercentage / 100) * circumference;
                            const dash = (percentage / 100) * circumference;
                            cumulativePercentage += percentage;
                            return (
                                <circle key={item.label} cx="50" cy="50" r="45" fill="transparent" stroke={item.color} strokeWidth="10" strokeDasharray={`${dash} ${circumference - dash}`} strokeDashoffset={-offset} transform="rotate(-90 50 50)" />
                            );
                        })}
                    </svg>
                </div>
                <div className="space-y-2">
                    {data.map(item => (
                         <div key={item.label} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span className="text-sm font-medium">{item.label} ({item.value})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BarChart: React.FC<{ data: { label: string, value: number, color: string }[], title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="bg-[var(--bg-main)] p-4 rounded-lg shadow-sm border border-[var(--border-color)] h-full">
            <h4 className="font-bold mb-4 text-[var(--text-primary)]">{title}</h4>
             <div className="flex justify-around items-end h-48">
                {data.map(d => (
                    <div key={d.label} className="flex flex-col items-center w-1/6">
                        <div 
                            className="w-8 rounded-t-sm hover:opacity-80 transition-opacity" 
                            style={{ height: `${(d.value / maxValue) * 100}%`, backgroundColor: d.color }}
                            title={`${d.label}: ${d.value}`}
                        ></div>
                        <p className="text-xs mt-2 font-semibold text-[var(--text-secondary)]">{d.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Report-specific View Components
const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-[var(--bg-main)] p-4 rounded-lg shadow-sm border border-[var(--border-color)] flex items-center gap-4">
        <div className="p-3 rounded-full bg-[var(--accent-green-soft)] text-[var(--secondary-green)]">{icon}</div>
        <div>
            <p className="text-sm text-[var(--text-secondary)]">{title}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
    </div>
);

const VentasReportView: React.FC<{ data: { kpis: KpiData, byCategory: SalesByCategory[] } }> = ({ data }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <KpiCard title="Ventas Totales" value={formatCurrency(data.kpis.ventasTotales)} icon={<DollarSignIcon />} />
            <KpiCard title="Pedidos Nuevos" value={data.kpis.pedidosNuevos.toLocaleString('es-CO')} icon={<ShoppingCartIcon />} />
            <KpiCard title="Ticket Promedio" value={formatCurrency(data.kpis.ticketPromedio)} icon={<ActivityIcon />} />
        </div>
        <DoughnutChart data={data.byCategory.map(c => ({ label: c.name, value: c.percentage, color: c.color }))} title="Ventas por Categoría (Rango Seleccionado)" />
    </div>
);

const PqrReportView: React.FC<{ data: { byStatus: any[], byType: any[] } }> = ({ data }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart data={data.byStatus} title="Tickets PQR por Estado" />
        <DoughnutChart data={data.byType} title="Tickets PQR por Tipo" />
    </div>
);

const PlaceholderReportView: React.FC<{ reportName: string }> = ({ reportName }) => (
    <div className="text-center p-10 bg-[var(--bg-main)] rounded-lg border border-dashed border-[var(--border-color)]">
        <h3 className="text-xl font-bold">Reporte: {reportName}</h3>
        <p className="mt-2 text-[var(--text-secondary)]">Las gráficas correspondientes para este reporte aparecerán aquí.</p>
    </div>
);

// --- MAIN COMPONENT ---
const ReportesAnaliticas: React.FC = () => {
    const [allOrders, setAllOrders] = useState<OrionOrder[]>([]);
    const [allProducts, setAllProducts] = useState<OrionProduct[]>([]);
    const [allTickets, setAllTickets] = useState<Ticket[]>([]);
    
    const [selectedModule, setSelectedModule] = useState('');
    const [selectedReport, setSelectedReport] = useState('');

    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    // --- DATA LOADING ---
    useEffect(() => {
        const loadData = () => {
            setAllOrders(JSON.parse(localStorage.getItem('hatoGrandePedidos') || '[]'));
            setAllProducts(JSON.parse(localStorage.getItem('orionProducts') || '[]'));
            setAllTickets(JSON.parse(localStorage.getItem('hatoGrandeTickets') || '[]').map((t: any) => ({
                id: t.id,
                creationDate: t.timestamp,
                estado: t.status,
                tipo: t.type
            })));
        };
        loadData();
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []);

    // --- DATA PROCESSING ---

    // Initial Dashboard Data (last 15 days)
    const initialDashboardData = useMemo(() => {
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        fifteenDaysAgo.setHours(0,0,0,0);

        // Sales Trend
        const recentOrders = allOrders.filter(o => new Date(o.creationDate) >= fifteenDaysAgo);
        const salesByDay: { [day: string]: number } = {};
        for (let i = 0; i < 15; i++) {
            const d = new Date(fifteenDaysAgo);
            d.setDate(d.getDate() + i);
            salesByDay[d.toISOString().split('T')[0]] = 0;
        }
        recentOrders.forEach(o => {
            const day = new Date(o.creationDate).toISOString().split('T')[0];
            if(salesByDay[day] !== undefined) salesByDay[day] += o.total;
        });
        const salesTrend = Object.entries(salesByDay).map(([day, sales]) => ({ day, sales }));
        
        // Inventory Status
        const inventoryStatus = { low: 0, ok: 0, over: 0 };
        allProducts.forEach(p => {
            if (p.cantidad < p.stockMin) inventoryStatus.low++;
            else if (p.stockMax > 0 && p.cantidad > p.stockMax) inventoryStatus.over++;
            else inventoryStatus.ok++;
        });
        const inventoryChartData = [
            { label: 'Stock Bajo', value: inventoryStatus.low, color: '#d9534f' },
            { label: 'Stock Óptimo', value: inventoryStatus.ok, color: 'var(--secondary-green)' },
            { label: 'Sobre Stock', value: inventoryStatus.over, color: '#f0ad4e' },
        ];

        // Production Status (Mock data as it's not stored)
        const productionStatusData = [
            { label: 'Planeada', value: 2, color: '#5bc0de' },
            { label: 'En Proceso', value: 1, color: '#f0ad4e' },
            { label: 'Finalizada', value: 5, color: 'var(--secondary-green)' },
        ];

        return { salesTrend, inventoryChartData, productionStatusData };
    }, [allOrders, allProducts]);

    // Report-Specific Data
    const reportData = useMemo(() => {
        if (!selectedReport) return null;
        
        const startDate = new Date(dateRange.start);
        startDate.setHours(0,0,0,0);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23,59,59,999);
        
        if (selectedReport === 'Reporte de Ventas') {
            const filteredOrders = allOrders.filter(o => new Date(o.creationDate) >= startDate && new Date(o.creationDate) <= endDate);
            const ventasTotales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
            const pedidosNuevos = filteredOrders.length;
            const kpis = {
                ventasTotales,
                pedidosNuevos,
                ticketPromedio: pedidosNuevos > 0 ? ventasTotales / pedidosNuevos : 0
            };
            const categorySales: { [key: string]: number } = {};
            filteredOrders.forEach(order => {
                order.items.forEach(item => {
                    const productInfo = hatoGrandeProducts.find(p => p.id === item.productId);
                    if (productInfo) {
                        if (!categorySales[productInfo.category]) categorySales[productInfo.category] = 0;
                        categorySales[productInfo.category] += item.totalPrice;
                    }
                });
            });
            const totalCategorySales = Object.values(categorySales).reduce((sum, val) => sum + val, 0);
            const categoryColors: { [key: string]: string } = { quesos: 'var(--secondary-green)', yogures: '#18bedb', postres: '#A9DFBF', otros: 'var(--text-secondary)' };
            const byCategory = Object.entries(categorySales).map(([name, value]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                percentage: totalCategorySales > 0 ? parseFloat(((value / totalCategorySales) * 100).toFixed(1)) : 0,
                color: categoryColors[name] || '#8884d8'
            })).sort((a,b) => b.percentage - a.percentage);

            return { kpis, byCategory };
        }
        
        if (selectedReport === 'Reporte de PQR') {
            const filteredTickets = allTickets.filter(t => new Date(t.creationDate) >= startDate && new Date(t.creationDate) <= endDate);
            const byStatusMap = filteredTickets.reduce((acc, ticket) => {
                acc[ticket.estado] = (acc[ticket.estado] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
             const byStatus = [
                { label: 'Abierto', value: byStatusMap['Abierto'] || 0, color: '#d9534f' },
                { label: 'En Proceso', value: byStatusMap['En proceso'] || 0, color: '#f0ad4e' },
                { label: 'Cerrado', value: byStatusMap['Cerrado'] || 0, color: 'var(--secondary-green)' },
            ];

            const byTypeMap = filteredTickets.reduce((acc, ticket) => {
                acc[ticket.tipo] = (acc[ticket.tipo] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            const byType = [
                { label: 'Petición', value: byTypeMap['peticion'] || 0, color: '#5bc0de' },
                { label: 'Queja/Reclamo', value: (byTypeMap['reclamo'] || 0) + (byTypeMap['queja'] || 0), color: '#d9534f' },
                { label: 'Sugerencia', value: byTypeMap['sugerencia'] || 0, color: 'var(--secondary-green)' },
                { label: 'Otros', value: byTypeMap['otros'] || 0, color: 'var(--text-secondary)' },
            ];

            return { byStatus, byType };
        }

        return null;
    }, [selectedReport, dateRange, allOrders, allTickets]);

    // --- UI LOGIC ---
    const reportOptions: Record<string, string[]> = {
        'Comercial': ['Reporte de Ventas', 'Reporte de PQR'],
        'Financiero': ['Reporte de Contabilidad'],
        'Operaciones': ['Movimiento de Inventario', 'Compras', 'Producción'],
    };

    const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModule(e.target.value);
        setSelectedReport(''); // Reset report when module changes
    };
    
    const handleGenerateReport = () => {
        if (selectedReport === "Reporte de Ventas") {
            // Logic to generate and download sales CSV
            const startDate = new Date(dateRange.start);
            startDate.setHours(0,0,0,0);
            const endDate = new Date(dateRange.end);
            endDate.setHours(23,59,59,999);
            const filteredOrders = allOrders.filter(order => {
                const orderDate = new Date(order.creationDate);
                return orderDate >= startDate && orderDate <= endDate;
            });
            if (filteredOrders.length === 0) {
                alert("No hay datos para generar el reporte en el rango de fechas seleccionado.");
                return;
            }
            const headers = ["ID Pedido", "Fecha", "Cliente", "Total", "Estado"];
            const csvRows = [headers.join(',')];
            filteredOrders.forEach(order => {
                const row = [order.id, new Date(order.creationDate).toLocaleDateString('es-CO'), `"${(order as any).clientName.replace(/"/g, '""')}"`, order.total, (order as any).status];
                csvRows.push(row.join(','));
            });
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.setAttribute('href', URL.createObjectURL(blob));
            link.setAttribute('download', `Reporte_Ventas_${dateRange.start}_a_${dateRange.end}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert(`La generación de reportes para "${selectedReport}" no está implementada.`);
        }
    };

    const renderDashboardContent = () => {
        if (!selectedReport) {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <InitialSalesTrendChart data={initialDashboardData.salesTrend} />
                    <div className="space-y-6">
                        <DoughnutChart data={initialDashboardData.inventoryChartData} title="Estado del Inventario" />
                        <BarChart data={initialDashboardData.productionStatusData} title="Estado de Producción" />
                    </div>
                </div>
            );
        }
        
        switch (selectedReport) {
            case 'Reporte de Ventas':
                return <VentasReportView data={reportData as any} />;
            case 'Reporte de PQR':
                return <PqrReportView data={reportData as any} />;
            case 'Reporte de Contabilidad':
            case 'Movimiento de Inventario':
            case 'Compras':
            case 'Producción':
                return <PlaceholderReportView reportName={selectedReport} />;
            default:
                return null;
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div>
                <h3 className="text-lg font-bold">Reportes y Analíticas</h3>
                <p className="text-sm text-[var(--text-secondary)]">Selecciona filtros para visualizar y generar reportes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end p-4 bg-[var(--bg-main)] rounded-lg border border-[var(--border-color)]">
                <div>
                    <label className="text-sm font-semibold block mb-1">Rango de Fechas</label>
                    <div className="flex items-center gap-2">
                        <input type="date" value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} className="bg-transparent text-sm border-b-2 border-[var(--border-color)] focus:outline-none focus:border-[var(--secondary-green)] w-full"/>
                        <span>-</span>
                        <input type="date" value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} className="bg-transparent text-sm border-b-2 border-[var(--border-color)] focus:outline-none focus:border-[var(--secondary-green)] w-full"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="module-select" className="text-sm font-semibold block mb-1">Módulo de Reporte</label>
                    <select id="module-select" value={selectedModule} onChange={handleModuleChange} className="w-full p-2 text-sm border rounded-md bg-transparent border-[var(--border-color)] focus:outline-none focus:border-[var(--secondary-green)]">
                        <option value="">Seleccione un Módulo...</option>
                        {Object.keys(reportOptions).map(mod => <option key={mod} value={mod}>{mod}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="report-select" className="text-sm font-semibold block mb-1">Nombre del Reporte</label>
                    <select id="report-select" value={selectedReport} onChange={e => setSelectedReport(e.target.value)} disabled={!selectedModule} className="w-full p-2 text-sm border rounded-md bg-transparent border-[var(--border-color)] focus:outline-none focus:border-[var(--secondary-green)]">
                        <option value="">Seleccione un Reporte...</option>
                        {selectedModule && reportOptions[selectedModule]?.map(rep => <option key={rep} value={rep}>{rep}</option>)}
                    </select>
                </div>
                <button onClick={handleGenerateReport} disabled={!selectedReport} className="w-full text-white bg-[var(--secondary-green)] hover:opacity-80 font-semibold px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                    Generar Reporte
                </button>
            </div>
            
            <div className="mt-4">
                {renderDashboardContent()}
            </div>
        </div>
    );
};

export default ReportesAnaliticas;