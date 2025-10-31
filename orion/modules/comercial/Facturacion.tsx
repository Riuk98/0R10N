import React from 'react';

// --- ICONS ---
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const CancelIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);

interface FacturacionProps {
    order?: any; // The order data passed from CrearPedido
    onClose?: () => void;
}

const Facturacion: React.FC<FacturacionProps> = ({ order, onClose }) => {
    
    const formatDate = (isoString?: string) => {
        if (!isoString) return new Date().toLocaleDateString('es-CO');
        return new Date(isoString).toLocaleDateString('es-CO');
    };

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
                    <h2 className="text-xl font-bold">Factura No. {order?.id?.replace('CO', 'FAC') || 'XXX-000'}</h2>
                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-gray-600 rounded-full hover:bg-gray-700 transition-colors"><SearchIcon /></button>
                        <button className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"><CancelIcon /></button>
                        <button className="p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors"><CheckIcon /></button>
                    </div>
                </div>

                {/* Client Info */}
                <div className="p-4 border-b border-x border-gray-300 dark:border-gray-600">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-3">
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

                        <div className="col-span-2">
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

                        <div className="flex items-center gap-4">
                             <label className="font-semibold">Tipo de pago:</label>
                             <label className="flex items-center gap-1"><input type="checkbox" checked={order?.paymentMethod?.toLowerCase().includes('crédito')} readOnly /> Crédito</label>
                             <label className="flex items-center gap-1"><input type="checkbox" checked={!order?.paymentMethod?.toLowerCase().includes('crédito')} readOnly /> Contado</label>
                        </div>
                         <div className="col-span-2">
                            <label className="font-semibold block mb-1">Orden de Pedido:</label>
                            <input type="text" readOnly value={order?.id || ''} className="factura-input w-full" />
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="flex-grow overflow-auto border-x border-gray-300 dark:border-gray-600">
                    <table className="w-full factura-table">
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

                {/* Footer and Totals */}
                <div className="p-4 border-t border-x border-b border-gray-300 dark:border-gray-600 rounded-b-lg">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold">ID Vendedor:</label>
                                    <input type="text" readOnly value={order?.sellerId || ''} className="factura-input w-full mt-1" />
                                </div>
                                <div>
                                    <label className="font-semibold">Nombre Vendedor:</label>
                                    <input type="text" readOnly value={order?.sellerName || ''} className="factura-input w-full mt-1" />
                                </div>
                                <div className="col-span-2">
                                    <label className="font-semibold">Observaciones:</label>
                                    <input type="text" readOnly value={order?.observations || ''} className="factura-input w-full mt-1" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="factura-totals-label">Subtotal</span>
                                <input type="text" readOnly value={`$ ${order?.subtotal.toLocaleString('es-CO') || '0'}`} className="factura-input w-40 text-right" />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="factura-totals-label">Descuento</span>
                                <input type="text" readOnly value={`$ ${order?.discount.toLocaleString('es-CO') || '0'}`} className="factura-input w-40 text-right" />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="factura-totals-label">IVA</span>
                                <input type="text" readOnly value="$ 0" className="factura-input w-40 text-right" />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="factura-totals-label">Retención</span>
                                <input type="text" readOnly value="$ 0" className="factura-input w-40 text-right" />
                            </div>
                             <div className="flex justify-between items-center border-t pt-2 mt-1 border-gray-400">
                                <span className="factura-totals-label text-lg">Total</span>
                                <input type="text" readOnly value={`$ ${order?.total.toLocaleString('es-CO') || '0'}`} className="factura-input w-40 text-right font-bold text-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Facturacion;