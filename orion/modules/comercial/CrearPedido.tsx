

import React, { useState, useEffect, useCallback } from 'react';
import { products as productList } from '../../../hatogrande/data';

// --- ICONS ---
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const RefreshIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const SaveIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);


interface CrearPedidoProps {
    onClose: () => void;
    permissions?: Record<string, boolean>;
}

interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    totalPrice: number;
}

const getNewOrderId = () => {
    let lastId = parseInt(localStorage.getItem('lastOrderId') || '0', 10);
    lastId++;
    localStorage.setItem('lastOrderId', lastId.toString());
    return `CO-${String(lastId).padStart(6, '0')}`;
};

const InputField = ({ label, placeholder, className = '', value, onChange, name }: { label: string, placeholder?: string, className?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, name: string }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
        <input 
            type="text" 
            placeholder={placeholder} 
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full bg-[var(--bg-main)] text-[var(--text-primary)] border border-transparent rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[var(--secondary-green)] focus:border-[var(--secondary-green)] outline-none transition ${className}`} 
        />
    </div>
);

const ActionButton = ({ icon, title, onClick, disabled }: { icon: React.ReactNode, title: string, onClick?: () => void, disabled?: boolean }) => (
    <button 
        onClick={onClick} 
        title={disabled ? "No tiene permisos para realizar esta acción" : title} 
        disabled={disabled}
        className="p-2 rounded-full hover:bg-[var(--bg-main)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {icon}
    </button>
);

const CrearPedido: React.FC<CrearPedidoProps> = ({ onClose, permissions }) => {
    const [orderId, setOrderId] = useState('');
    const [client, setClient] = useState({ nombre: '', nit: '', direccion: '', telefono: '', email: '' });
    const [searchError, setSearchError] = useState<string | null>(null);
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    
    const [items, setItems] = useState<OrderItem[]>([]);
    const [currentItem, setCurrentItem] = useState({ id: '', name: '', quantity: 1, unitPrice: 0, discount: 0, totalPrice: 0 });
    
    const [totals, setTotals] = useState({ bruto: 0, descuento: 0, neto: 0 });
    
    const [seller, setSeller] = useState({ id: '001', name: 'Martha Milena' });
    const [observations, setObservations] = useState('');

    const resetForm = useCallback(() => {
        setClient({ nombre: '', nit: '', direccion: '', telefono: '', email: '' });
        setSearchError(null);
        setOrderDate(new Date().toISOString().split('T')[0]);
        setDeliveryDate('');
        setPaymentMethod('');
        setItems([]);
        setCurrentItem({ id: '', name: '', quantity: 0, unitPrice: 0, discount: 0, totalPrice: 0 });
        setObservations('');
        setOrderId(getNewOrderId());
    }, []);

    useEffect(() => {
        setOrderId(getNewOrderId());
    }, []);

    useEffect(() => {
        const bruto = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const descuento = items.reduce((sum, item) => sum + (item.discount * item.quantity), 0);
        setTotals({ bruto, descuento, neto: bruto - descuento });
    }, [items]);

    const handleClientSearch = () => {
        const nombreBusqueda = client.nombre.trim();
        const nitBusqueda = client.nit.trim();

        if (!nombreBusqueda && !nitBusqueda) {
            setSearchError('Debe ingresar un Nombre/Razón Social o NIT para buscar.');
            return;
        }

        const storedUsers = JSON.parse(localStorage.getItem('hatoGrandeClientes') || '[]');
        const foundUser = storedUsers.find((u: any) => {
            const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
            const searchName = nombreBusqueda.toLowerCase();
            
            const nameMatch = nombreBusqueda && fullName.includes(searchName);
            const nitMatch = nitBusqueda && u.nit === nitBusqueda;

            return nameMatch || nitMatch;
        });
        
        if (foundUser) {
            setClient({
                nombre: `${foundUser.firstName} ${foundUser.lastName}`,
                nit: foundUser.nit || '',
                direccion: foundUser.direccion || '',
                telefono: foundUser.phone,
                email: foundUser.email,
            });
            setSearchError(null);
        } else {
            setSearchError('La información no coincide con ningún cliente existente.');
        }
    };

    const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClient(c => ({...c, [name]: value}));
        if (searchError && (name === 'nombre' || name === 'nit')) {
            setSearchError(null);
        }
    };

    const handleProductSearch = (productId: string) => {
        const product = productList.find(p => p.id.toString() === productId);
        if (product) {
            setCurrentItem(prev => ({
                ...prev,
                id: productId,
                name: product.name,
                unitPrice: product.price,
                totalPrice: product.price * prev.quantity * (1 - prev.discount / 100),
            }));
        } else {
             setCurrentItem(prev => ({ ...prev, id: productId, name: 'Producto no encontrado', unitPrice: 0, totalPrice: 0 }));
        }
    };
    
    const handleCurrentItemChange = (field: string, value: string | number) => {
        const newValues = { ...currentItem, [field]: value };
        
        if (typeof value === 'string') {
           if (field === 'id') handleProductSearch(value);
        } else { // It's a number
            const quantity = field === 'quantity' ? value : newValues.quantity;
            const unitPrice = newValues.unitPrice;
            const discount = field === 'discount' ? value : newValues.discount;
            newValues.totalPrice = quantity * unitPrice * (1 - discount / 100);
        }
        
        setCurrentItem(newValues);
    };

    const handleAddItem = () => {
        if (!currentItem.id || !currentItem.name || currentItem.quantity <= 0 || currentItem.unitPrice <= 0) {
            alert("Por favor, complete los datos del producto.");
            return;
        }
        setItems(prev => [...prev, {
            ...currentItem,
            id: Date.now(),
            productId: parseInt(currentItem.id),
            productName: currentItem.name,
        }]);
        setCurrentItem({ id: '', name: '', quantity: 1, unitPrice: 0, discount: 0, totalPrice: 0 });
    };
    
    const handleRemoveItem = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleSaveOrder = () => {
        if (!client.nombre || items.length === 0) {
            alert("Debe seleccionar un cliente y agregar al menos un producto.");
            return;
        }

        const newOrder = {
            id: orderId,
            creationDate: new Date(orderDate).toISOString(),
            clientName: client.nombre,
            clientNit: client.nit,
            clientAddress: client.direccion,
            clientPhone: client.telefono,
            clientEmail: client.email,
            deliveryDate: deliveryDate ? new Date(deliveryDate).toISOString() : undefined,
            paymentMethod: paymentMethod,
            items: items.map(i => ({
                productId: i.productId,
                productName: i.productName,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                totalPrice: i.totalPrice,
                options: {},
            })),
            subtotal: totals.bruto,
            discount: totals.descuento,
            total: totals.neto,
            sellerId: seller.id,
            sellerName: seller.name,
            observations: observations,
            source: 'CRM',
            status: 'Abierto',
        };

        const storedPedidos = JSON.parse(localStorage.getItem('hatoGrandePedidos') || '[]');
        storedPedidos.push(newOrder);
        localStorage.setItem('hatoGrandePedidos', JSON.stringify(storedPedidos));
        window.dispatchEvent(new Event("storage"));
        
        alert(`Pedido ${orderId} guardado exitosamente.`);
        resetForm();
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-card)] text-[var(--text-primary)]">
            <div className="p-4 space-y-3 overflow-y-auto flex-grow">
                 {searchError && (
                    <div className="w-full text-center p-3 bg-red-100 text-red-800 text-sm rounded-lg border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700">
                        {searchError}
                    </div>
                )}
                <div className="flex justify-between items-start">
                    <div className="flex-grow p-4 border border-[var(--border-color)] rounded-2xl mr-4 bg-[var(--bg-main)]/50">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <InputField label="Fecha" name="orderDate" value={orderDate} onChange={(e) => setOrderDate(e.target.value)}/>
                            <InputField label="Fecha de entrega" name="deliveryDate" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                            <InputField label="Nombre/Razón Social" name="nombre" value={client.nombre} onChange={handleClientChange} className="col-span-2" />
                            <InputField label="NIT" name="nit" value={client.nit} onChange={handleClientChange} />
                            <InputField label="Dirección" name="direccion" value={client.direccion} onChange={(e) => setClient(c => ({...c, direccion: e.target.value}))} />
                            <InputField label="Teléfono" name="telefono" value={client.telefono} onChange={(e) => setClient(c => ({...c, telefono: e.target.value}))} />
                            <InputField label="E-mail" name="email" value={client.email} onChange={(e) => setClient(c => ({...c, email: e.target.value}))} />
                            <InputField label="Tipo de pago" name="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 items-center">
                         <div className="px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-lg font-bold">
                            {orderId}
                        </div>
                        <ActionButton icon={<SearchIcon className="w-6 h-6" />} title="Buscar Cliente" onClick={handleClientSearch}/>
                        <ActionButton icon={<RefreshIcon className="w-6 h-6" />} title="Limpiar Formulario" onClick={resetForm}/>
                    </div>
                </div>

                <div className="flex items-end gap-4 p-4 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-main)]/50">
                    <InputField label="Cod. Producto" className="flex-1 min-w-0" name="id" value={currentItem.id} onChange={(e) => handleCurrentItemChange('id', e.target.value)} />
                    <InputField label="Descripción" className="flex-[2] min-w-0" name="name" value={currentItem.name} onChange={(e) => handleCurrentItemChange('name', e.target.value)} />
                    <InputField label="Cantidad" className="w-20" name="quantity" value={String(currentItem.quantity)} onChange={(e) => handleCurrentItemChange('quantity', parseInt(e.target.value) || 0)} />
                    <InputField label="Valor Unitario" className="w-28" name="unitPrice" value={String(currentItem.unitPrice)} onChange={(e) => handleCurrentItemChange('unitPrice', parseFloat(e.target.value) || 0)} />
                    <InputField label="Descuento" className="w-24" name="discount" value={String(currentItem.discount)} onChange={(e) => handleCurrentItemChange('discount', parseFloat(e.target.value) || 0)} />
                    <InputField label="Valor Total" className="w-28" name="totalPrice" value={`$ ${currentItem.totalPrice.toLocaleString('es-CO')}`} onChange={() => {}} />
                    <button onClick={handleAddItem} className="p-2 bg-[var(--bg-main)] rounded-full hover:opacity-80 transition-colors"><PlusIcon className="w-5 h-5"/></button>
                </div>

                <div className="h-48 border border-[var(--border-color)] overflow-auto rounded-lg">
                     <table className="w-full text-sm border-collapse">
                        <thead className="bg-[var(--bg-main)] text-left sticky top-0">
                            <tr>
                                {['Cod.', 'Descripción', 'Cant.', 'Vlr. Unit.', 'Desc.', 'Vlr. Total', 'Acción'].map(h => 
                                    <th key={h} className="p-2 font-bold border-b border-[var(--border-color)]">{h}</th>
                                )}
                            </tr>
                        </thead>
                         <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan={8} className="text-center p-8 text-[var(--text-secondary)]">Añade productos al pedido</td></tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.id}>
                                        <td className="p-2 border-b border-dashed border-[var(--border-color)]/50">{item.productId}</td>
                                        <td className="p-2 border-b border-dashed border-[var(--border-color)]/50">{item.productName}</td>
                                        <td className="p-2 border-b border-dashed border-[var(--border-color)]/50">{item.quantity}</td>
                                        <td className="p-2 border-b border-dashed border-[var(--border-color)]/50">${item.unitPrice.toLocaleString('es-CO')}</td>
                                        <td className="p-2 border-b border-dashed border-[var(--border-color)]/50">${item.discount.toLocaleString('es-CO')}</td>
                                        <td className="p-2 border-b border-dashed border-[var(--border-color)]/50">${item.totalPrice.toLocaleString('es-CO')}</td>
                                        <td className="p-2 border-b border-dashed border-[var(--border-color)]/50">
                                            <button onClick={() => handleRemoveItem(item.id)}><TrashIcon className="w-4 h-4 text-red-500" /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                         <div className="flex gap-4">
                            <InputField label="ID Vendedor" className="flex-1" name="sellerId" value={seller.id} onChange={(e) => setSeller(s => ({...s, id: e.target.value}))} />
                            <InputField label="Nombre Vendedor" className="flex-[2]" name="sellerName" value={seller.name} onChange={(e) => setSeller(s => ({...s, name: e.target.value}))} />
                         </div>
                         <InputField label="Observaciones" name="observations" value={observations} onChange={(e) => setObservations(e.target.value)} />
                    </div>
                     <div className="space-y-1 text-right">
                         <div className="flex items-center justify-end gap-2">
                             <label className="font-bold text-sm">Total Bruto</label>
                             <input type="text" readOnly value={`$ ${totals.bruto.toLocaleString('es-CO')}`} className="w-36 p-1.5 text-right bg-[var(--bg-main)] text-[var(--text-primary)] rounded-lg border-transparent focus:ring-0 outline-none" />
                         </div>
                         <div className="flex items-center justify-end gap-2">
                            <label className="font-bold text-sm">Total Descuento</label>
                            <input type="text" readOnly value={`$ ${totals.descuento.toLocaleString('es-CO')}`} className="w-36 p-1.5 text-right bg-[var(--bg-main)] text-[var(--text-primary)] rounded-lg border-transparent focus:ring-0 outline-none" />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <label className="font-bold text-sm">Total Neto</label>
                            <input type="text" readOnly value={`$ ${totals.neto.toLocaleString('es-CO')}`} className="w-36 p-1.5 text-right bg-[var(--bg-main)] text-[var(--text-primary)] rounded-lg border-transparent focus:ring-0 outline-none" />
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--border-color)] flex justify-end items-center">
                    <div className="flex items-center gap-2">
                        <ActionButton icon={<SaveIcon className="w-5 h-5"/>} title="Guardar" onClick={handleSaveOrder} disabled={!permissions?.crear} />
                        <ActionButton icon={<TrashIcon className="w-5 h-5"/>} title="Eliminar" disabled={!permissions?.eliminar} />
                        <ActionButton icon={<EditIcon className="w-5 h-5"/>} title="Editar" disabled={!permissions?.actualizar} />
                        <ActionButton icon={<CheckIcon className="w-5 h-5 text-green-600"/>} title="Confirmar" onClick={handleSaveOrder} disabled={!permissions?.crear} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrearPedido;