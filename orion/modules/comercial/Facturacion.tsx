

import React, { useState, useEffect } from 'react';
import { OrionUser } from '../../data/internalUsers';
import { UnifiedProduct } from '../../data/inventoryData';

// --- ICONS ---
const CancelIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
const SpinnerIcon = () => (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);

interface FacturacionProps {
    order?: any; // The order data passed from CrearPedido
    onClose?: () => void;
    onUpdateProductStock: (productId: string, quantityChange: number) => void;
}

const HATO_GRANDE_PEDIDOS_KEY = 'hatoGrandePedidos';
const CUENTAS_COBRAR_STORAGE_KEY = 'orionCuentasCobrar';
const FACTURAS_STORAGE_KEY = 'orionFacturas';
const FACTURA_CONSECUTIVO_KEY = 'orionFacturaConsecutivo';
const TERCEROS_MOVIMIENTOS_KEY = 'orionTercerosMovimientos';


const getNewFacturaId = () => {
    let lastId = parseInt(localStorage.getItem(FACTURA_CONSECUTIVO_KEY) || '0', 10);
    lastId++;
    localStorage.setItem(FACTURA_CONSECUTIVO_KEY, lastId.toString());
    return `FAC-${String(lastId).padStart(3, '0')}`;
};

const Facturacion: React.FC<FacturacionProps> = ({ order, onClose = () => {}, onUpdateProductStock }) => {
    const [facturaId, setFacturaId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [descuento, setDescuento] = useState({ percentage: 0, value: 0 });
    const [iva, setIva] = useState({ percentage: 0, value: 0 });
    const [retencion, setRetencion] = useState({ percentage: 0, value: 0 });
    const [total, setTotal] = useState(0);

    const subtotal = order?.subtotal || 0;

    useEffect(() => {
        if (order) {
            setFacturaId(getNewFacturaId());
            const initialDiscountValue = order.discount || 0;
            const initialDiscountPercentage = subtotal > 0 ? parseFloat(((initialDiscountValue / subtotal) * 100).toFixed(2)) : 0;
            setDescuento({ percentage: initialDiscountPercentage, value: initialDiscountValue });
        }
    }, [order, subtotal]);

    useEffect(() => {
        const descuentoValue = subtotal * (descuento.percentage / 100);
        const ivaValue = subtotal * (iva.percentage / 100);
        const retencionValue = subtotal * (retencion.percentage / 100);

        setDescuento(d => ({ ...d, value: descuentoValue }));
        setIva(i => ({ ...i, value: ivaValue }));
        setRetencion(r => ({ ...r, value: retencionValue }));

        setTotal(subtotal - descuentoValue + ivaValue - retencionValue);
    }, [descuento.percentage, iva.percentage, retencion.percentage, subtotal]);

    const handlePercentageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<{ percentage: number; value: number }>>
    ) => {
        const percentage = parseFloat(e.target.value) || 0;
        setter(prev => ({ ...prev, percentage }));
    };

    const handleCancel = () => {
        // Find the order and update its status back to "En Proceso"
        try {
            const storedPedidos = JSON.parse(localStorage.getItem(HATO_GRANDE_PEDIDOS_KEY) || '[]');
            const updatedPedidos = storedPedidos.map((p: any) => {
                if (p.id === order.id) {
                    return { ...p, status: 'En Proceso' };
                }
                return p;
            });
            localStorage.setItem(HATO_GRANDE_PEDIDOS_KEY, JSON.stringify(updatedPedidos));
            window.dispatchEvent(new Event("storage"));
        } catch (error) {
            console.error("Failed to update order status on cancel", error);
        }
        onClose();
    };
    
    const handleConfirm = () => {
        if (!order) return;
        setIsProcessing(true);

        setTimeout(() => { // Simulate async operations
            try {
                // 1. Update Order Status
                const storedPedidos = JSON.parse(localStorage.getItem(HATO_GRANDE_PEDIDOS_KEY) || '[]');
                const updatedPedidos = storedPedidos.map((p: any) => p.id === order.id ? { ...p, status: 'Facturado' } : p);
                localStorage.setItem(HATO_GRANDE_PEDIDOS_KEY, JSON.stringify(updatedPedidos));

                // 2. Update Inventory by calling the central handler
                order.items.forEach((item: any) => {
                    // productID in the order is a string like "QCP-500"
                    onUpdateProductStock(item.productId, -item.quantity);
                });

                const facturaData = {
                    id: facturaId,
                    orderId: order.id,
                    fecha: new Date().toISOString(),
                    clienteNombre: order.clientName,
                    clienteNit: order.clientNit,
                    items: order.items,
                    subtotal: subtotal,
                    descuento: descuento.value,
                    iva: iva.value,
                    retencion: retencion.value,
                    total: total,
                };

                // 3. Create Invoice Record
                const storedFacturas = JSON.parse(localStorage.getItem(FACTURAS_STORAGE_KEY) || '[]');
                storedFacturas.push(facturaData);
                localStorage.setItem(FACTURAS_STORAGE_KEY, JSON.stringify(storedFacturas));

                // 4. Update Accounts Receivable if credit
                if (order.paymentMethod === 'Crédito') {
                    const storedCuentasCobrar = JSON.parse(localStorage.getItem(CUENTAS_COBRAR_STORAGE_KEY) || '[]');
                    const fechaEmision = new Date();
                    const fechaVencimiento = new Date(fechaEmision);
                    const creditDays = order.creditTermDays || 30; // Use term from order, fallback to 30
                    fechaVencimiento.setDate(fechaVencimiento.getDate() + creditDays);

                    const newCuenta = {
                        id: `CXC-${facturaId}`,
                        facturaId: facturaId,
                        clienteNit: order.clientNit,
                        clienteNombre: order.clientName,
                        clienteTelefono: order.clientPhone,
                        ciudad: order.clientAddress.split(',')[1]?.trim() || 'N/A',
                        fechaEmision: fechaEmision.toISOString(),
                        fechaVencimiento: fechaVencimiento.toISOString(),
                        valorFactura: total,
                        saldo: total,
                    };
                    storedCuentasCobrar.push(newCuenta);
                    localStorage.setItem(CUENTAS_COBRAR_STORAGE_KEY, JSON.stringify(storedCuentasCobrar));
                }

                // 5. Update Terceros movements
                const storedMovimientos = JSON.parse(localStorage.getItem(TERCEROS_MOVIMIENTOS_KEY) || '[]');
                const newMovimiento = {
                    id: `MOV-${Date.now()}`,
                    terceroId: order.clientNit, // Assuming NIT is the unique ID for a client
                    fecha: new Date().toISOString(),
                    tipo: 'Factura',
                    documentoId: facturaId,
                    monto: total,
                };
                storedMovimientos.push(newMovimiento);
                localStorage.setItem(TERCEROS_MOVIMIENTOS_KEY, JSON.stringify(storedMovimientos));

                // Notify all modules
                window.dispatchEvent(new Event("storage"));
                
            } catch(error) {
                console.error("Error confirming invoice:", error);
                alert("Ocurrió un error al procesar la factura.");
            } finally {
                setIsProcessing(false);
                setIsSuccess(true);
            }
        }, 1500); // Simulate network delay
    };


    const formatDate = (isoString?: string) => {
        if (!isoString) return new Date().toLocaleDateString('es-CO');
        return new Date(isoString).toLocaleDateString('es-CO');
    };
    
    if (isSuccess) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[var(--bg-card)] text-[var(--text-primary)]">
                <CheckIcon className="w-20 h-20 text-green-500 mb-4" strokeWidth={1.5} />
                <h2 className="text-2xl font-bold">Factura {facturaId} Confirmada</h2>
                <p className="mt-2">La factura se ha procesado exitosamente y los módulos correspondientes han sido actualizados.</p>
                <button onClick={onClose} className="mt-6 px-6 py-2 bg-[var(--bg-main)] font-semibold rounded-lg hover:opacity-80 border border-[var(--border-color)]">Cerrar</button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-[var(--bg-card)] text-[var(--text-primary)] p-4 font-sans text-sm">
            <style>{`
                .factura-container { background-color: #f8f9fa; border: 1px solid #dee2e6; color: #212529; }
                body.dark-mode .factura-container { background-color: #343a40; border-color: #495057; color: #e9ecef; }
                .factura-header { background-color: #042940; color: white; }
                .factura-input { background-color: #ffffff; border: 1px solid #ced4da; border-radius: 0.25rem; padding: 0.375rem 0.75rem; transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out; }
                body.dark-mode .factura-input { background-color: #495057; border-color: #6c757d; color: #ced4da; }
                .factura-table th, .factura-table td { padding: 0.5rem; border: 1px solid #dee2e6; }
                body.dark-mode .factura-table th, body.dark-mode .factura-table td { border-color: #495057; }
                .factura-table th { background-color: #e9ecef; }
                body.dark-mode .factura-table th { background-color: #495057; }
                .factura-totals-label { font-weight: bold; }
            `}</style>
            
            <div className="factura-container rounded-lg shadow-lg p-5 flex-grow flex flex-col">
                {/* Header */}
                <div className="factura-header flex justify-between items-center p-3 rounded-t-lg">
                    <h2 className="text-xl font-bold">Factura No. {facturaId}</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={handleCancel} disabled={isProcessing} className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50" title="Cancelar Factura"><CancelIcon /></button>
                        <button onClick={handleConfirm} disabled={isProcessing} className="p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors w-10 h-10 flex items-center justify-center disabled:opacity-50" title="Confirmar Factura">
                            {isProcessing ? <SpinnerIcon/> : <CheckIcon />}
                        </button>
                    </div>
                </div>

                {/* Client Info */}
                <div className="p-4 border-b border-x border-gray-300 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
                        <div className="flex items-center gap-2">
                            <label className="font-semibold w-32 shrink-0">Fecha de emisión:</label>
                            <input type="text" readOnly value={formatDate()} className="factura-input flex-grow" />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="font-semibold w-36 shrink-0">Fecha de vencimiento:</label>
                            <input type="text" readOnly value={formatDate(order?.deliveryDate)} className="factura-input flex-grow" />
                        </div>
                         <div className="flex items-center gap-2">
                            <label className="font-semibold w-36 shrink-0">Fecha de verificación:</label>
                            <input type="text" readOnly value={formatDate()} className="factura-input flex-grow" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="font-semibold block mb-1">Nombre/Razón Social:</label>
                            <input type="text" readOnly value={order?.clientName || ''} className="factura-input w-full" />
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">NIT:</label>
                            <input type="text" readOnly value={order?.clientNit || ''} className="factura-input w-full" />
                        </div>

                        <div>
                            <label className="font-semibold block mb-1">Dirección:</label>
                            <input type="text" readOnly value={order?.clientAddress || ''} className="factura-input w-full" />
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">Teléfono:</label>
                            <input type="text" readOnly value={order?.clientPhone || ''} className="factura-input w-full" />
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">E-mail:</label>
                            <input type="text" readOnly value={order?.clientEmail || ''} className="factura-input w-full" />
                        </div>

                        <div className="flex items-center gap-4 md:col-span-1">
                             <label className="font-semibold">Tipo de pago:</label>
                             <label className="flex items-center gap-1"><input type="checkbox" checked={order?.paymentMethod?.toLowerCase() === 'crédito'} readOnly /> Crédito</label>
                             <label className="flex items-center gap-1"><input type="checkbox" checked={order?.paymentMethod?.toLowerCase() === 'contado'} readOnly /> Contado</label>
                             {order?.paymentMethod?.toLowerCase() === 'crédito' && (
                                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {order.creditTermDays || 30} DÍAS
                                </span>
                            )}
                        </div>
                         <div className="md:col-span-2">
                            <label className="font-semibold block mb-1">Orden de Pedido:</label>
                            <input type="text" readOnly value={order?.id || ''} className="factura-input w-full" />
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="flex-grow overflow-auto border-x border-gray-300 dark:border-gray-600">
                    <div className="overflow-x-auto">
                        <table className="w-full factura-table min-w-[800px]">
                            <thead>
                                <tr>
                                    <th className="w-16">Sec.</th>
                                    <th>Producto</th>
                                    <th>Descripción</th>
                                    <th className="w-20">Cant.</th>
                                    <th className="w-32">Valor Unitario</th>
                                    <th className="w-32">Valor Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order?.items.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td className="text-center">{index + 1}</td>
                                        <td>{item.productId}</td>
                                        <td>{item.productName}</td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-right">${item.unitPrice.toLocaleString('es-CO')}</td>
                                        <td className="text-right">${item.totalPrice.toLocaleString('es-CO')}</td>
                                    </tr>
                                ))}
                                {/* Add empty rows to fill space */}
                                {Array.from({ length: Math.max(0, 5 - (order?.items?.length || 0)) }).map((_, i) => (
                                    <tr key={`empty-${i}`}><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer and Totals */}
                <div className="p-4 border-t border-x border-b border-gray-300 dark:border-gray-600 rounded-b-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold">ID Vendedor:</label>
                                    <input type="text" readOnly value={order?.sellerId || ''} className="factura-input w-full mt-1" />
                                </div>
                                <div>
                                    <label className="font-semibold">Nombre Vendedor:</label>
                                    <input type="text" readOnly value={order?.sellerName || ''} className="factura-input w-full mt-1" />
                                </div>
                                <div className="col-span-1 sm:col-span-2">
                                    <label className="font-semibold">Observaciones:</label>
                                    <input type="text" readOnly value={order?.observations || ''} className="factura-input w-full mt-1" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="factura-totals-label">Subtotal</span>
                                <input type="text" readOnly value={`$ ${subtotal.toLocaleString('es-CO')}`} className="factura-input w-40 text-right font-semibold" />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <label htmlFor="descuento-perc" className="factura-totals-label flex-1">Descuento</label>
                                <div className="flex items-center gap-1">
                                    <input id="descuento-perc" type="number" value={descuento.percentage} onChange={(e) => handlePercentageChange(e, setDescuento)} className="factura-input w-16 text-right" placeholder="%" step="0.01" />
                                    <span className="font-semibold w-4 text-left">%</span>
                                </div>
                                <input type="text" readOnly value={`$ ${descuento.value.toLocaleString('es-CO')}`} className="factura-input w-32 text-right" />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <label htmlFor="iva-perc" className="factura-totals-label flex-1">IVA</label>
                                <div className="flex items-center gap-1">
                                    <input id="iva-perc" type="number" value={iva.percentage} onChange={(e) => handlePercentageChange(e, setIva)} className="factura-input w-16 text-right" placeholder="%" />
                                    <span className="font-semibold w-4 text-left">%</span>
                                </div>
                                <input type="text" readOnly value={`$ ${iva.value.toLocaleString('es-CO')}`} className="factura-input w-32 text-right" />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <label htmlFor="retencion-perc" className="factura-totals-label flex-1">Retención</label>
                                <div className="flex items-center gap-1">
                                    <input id="retencion-perc" type="number" value={retencion.percentage} onChange={(e) => handlePercentageChange(e, setRetencion)} className="factura-input w-16 text-right" placeholder="%" />
                                    <span className="font-semibold w-4 text-left">%</span>
                                </div>
                                <input type="text" readOnly value={`$ ${retencion.value.toLocaleString('es-CO')}`} className="factura-input w-32 text-right" />
                            </div>
                            <div className="flex justify-between items-center border-t pt-2 mt-1 border-gray-400">
                                <span className="factura-totals-label text-lg">Total</span>
                                <input type="text" readOnly value={`$ ${total.toLocaleString('es-CO')}`} className="factura-input w-40 text-right font-bold text-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Facturacion;