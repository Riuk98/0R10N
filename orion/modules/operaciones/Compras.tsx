

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { OrionUser } from '../../data/internalUsers';
import { OrionInsumo } from './Inventario';
import { Tercero } from '../comercial/ClientesCRM';


// --- DATA STRUCTURES & MOCKS ---
export interface ItemOrdenCompra {
    id: number;
    insumoId: string;
    insumoNombre: string;
    cantidad: number;
    valorUnitario: number;
    valorTotal: number;
}

export interface OrdenCompra {
    id: string; // e.g., 'OC-0052'
    proveedorId: string;
    proveedorNombre: string;
    fechaEmision: string; // 'YYYY-MM-DD'
    fechaEsperada: string; // 'YYYY-MM-DD'
    items: ItemOrdenCompra[];
    total: number;
    estado: 'Borrador' | 'En Proceso' | 'Enviada' | 'Recibida';
    observaciones?: string;
    creadoPor: string;
}

const COMPRAS_STORAGE_KEY = 'orionOrdenesCompra';
const OC_CONSECUTIVO_KEY = 'orionOCConsecutivo';

// --- ICONS ---
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>);
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>);
const SaveIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>);
const ViewIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const PdfIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;

// --- HELPER FUNCTIONS ---
const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

const getNextOCId = () => {
    let lastId = parseInt(localStorage.getItem(OC_CONSECUTIVO_KEY) || '55', 10);
    lastId++;
    localStorage.setItem(OC_CONSECUTIVO_KEY, lastId.toString());
    return `OC-${String(lastId).padStart(4, '0')}`;
};

// --- MODAL COMPONENT ---
interface OrdenCompraFormProps {
    onClose: () => void;
    ordenToEdit: OrdenCompra | null;
    allInsumos: OrionInsumo[];
    proveedores: Tercero[];
}

export const OrdenCompraForm: React.FC<OrdenCompraFormProps> = ({ onClose, ordenToEdit, allInsumos, proveedores }) => {
    const isEditMode = !!ordenToEdit;
    const initialOrdenState = {
        proveedorId: '',
        proveedorNombre: '',
        fechaEmision: new Date().toISOString().split('T')[0],
        fechaEsperada: '',
        items: [] as ItemOrdenCompra[],
        estado: 'Borrador' as OrdenCompra['estado'],
        observaciones: '',
        creadoPor: ''
    };
    const [orden, setOrden] = useState(initialOrdenState);
    const [ordenId, setOrdenId] = useState('');
    const [proveedorSearch, setProveedorSearch] = useState('');
    const [currentItem, setCurrentItem] = useState({ insumoId: '', insumoNombre: '', cantidad: 1, valorUnitario: 0 });

    useEffect(() => {
        if (isEditMode && ordenToEdit) {
            setOrdenId(ordenToEdit.id);
            setOrden({
                proveedorId: ordenToEdit.proveedorId,
                proveedorNombre: ordenToEdit.proveedorNombre,
                fechaEmision: ordenToEdit.fechaEmision,
                fechaEsperada: ordenToEdit.fechaEsperada,
                items: ordenToEdit.items,
                estado: ordenToEdit.estado,
                observaciones: ordenToEdit.observaciones || '',
                creadoPor: ordenToEdit.creadoPor,
            });
            setProveedorSearch(ordenToEdit.proveedorNombre);
        } else {
            setOrdenId(getNextOCId());
        }
    }, [isEditMode, ordenToEdit]);

    const handleProveedorSearch = () => {
        const found = proveedores.find(p => p.nombre.toLowerCase().includes(proveedorSearch.toLowerCase()) || p.nit.includes(proveedorSearch));
        if (found) {
            setOrden(prev => ({ ...prev, proveedorId: found.id, proveedorNombre: found.nombre }));
        } else {
            alert('Proveedor no encontrado.');
        }
    };

    const handleInsumoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const found = allInsumos.find(i => i.id === selectedId);
        if (found) {
            setCurrentItem(prev => ({ ...prev, insumoId: found.id, insumoNombre: found.nombre, valorUnitario: found.costoUnitario }));
        } else {
            setCurrentItem(prev => ({ ...prev, insumoId: '', insumoNombre: '', valorUnitario: 0 }));
        }
    };

    const handleAddItem = () => {
        if (!currentItem.insumoId || currentItem.cantidad <= 0 || currentItem.valorUnitario < 0) {
            alert("Información del ítem incompleta o inválida.");
            return;
        }
        const newItem: ItemOrdenCompra = {
            id: Date.now(),
            ...currentItem,
            valorTotal: currentItem.cantidad * currentItem.valorUnitario,
        };
        setOrden(prev => ({ ...prev, items: [...prev.items, newItem] }));
        setCurrentItem({ insumoId: '', insumoNombre: '', cantidad: 1, valorUnitario: 0 }); // Reset
    };

    const handleRemoveItem = (id: number) => {
        setOrden(prev => ({...prev, items: prev.items.filter(i => i.id !== id)}));
    };

    const total = useMemo(() => orden.items.reduce((sum, item) => sum + item.valorTotal, 0), [orden.items]);
    
    const handleSave = (forceState?: OrdenCompra['estado']) => {
        if (!orden.proveedorId || orden.items.length === 0) {
            alert('Debe seleccionar un proveedor y añadir al menos un ítem.');
            return;
        }

        const currentUserRaw = sessionStorage.getItem('orionCurrentUser');
        const currentUser: OrionUser | null = currentUserRaw ? JSON.parse(currentUserRaw) : null;
        const userName = currentUser ? `${currentUser.nombre || ''} ${currentUser.apellidos || ''}`.trim() || currentUser.username : 'Sistema';

        const finalOrden: OrdenCompra = {
            id: ordenId,
            ...orden,
            estado: forceState || orden.estado,
            total,
            creadoPor: userName,
        };
        
        try {
            const storedData = JSON.parse(localStorage.getItem(COMPRAS_STORAGE_KEY) || '[]');
            const isUpdating = storedData.some((o: OrdenCompra) => o.id === finalOrden.id);
            const updatedData = isUpdating
                ? storedData.map((o: OrdenCompra) => o.id === finalOrden.id ? finalOrden : o)
                : [...storedData, finalOrden];
            localStorage.setItem(COMPRAS_STORAGE_KEY, JSON.stringify(updatedData));
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error('Failed to save purchase order', error);
        }
        
        onClose();
    };

    const contentIsReadOnly = isEditMode && ordenToEdit && (ordenToEdit.estado === 'Enviada' || ordenToEdit.estado === 'Recibida');


    return (
        <div className="bg-[var(--bg-card)] p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex-shrink-0">{isEditMode ? 'Editar' : 'Crear'} Orden de Compra</h3>
            
            {/* Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-[var(--border-color)] flex-shrink-0">
                <div>
                    <label className="text-sm font-medium"># OC</label>
                    <input type="text" value={ordenId} readOnly className="w-full bg-[var(--border-color)] p-2 border rounded-md cursor-not-allowed" />
                </div>
                <div className="md:col-span-2">
                    <label className="text-sm font-medium">Proveedor</label>
                    <div className="flex">
                        <input type="text" value={proveedorSearch} onChange={e => setProveedorSearch(e.target.value)} className="w-full bg-[var(--bg-main)] p-2 border rounded-l-md" readOnly={contentIsReadOnly}/>
                        <button onClick={handleProveedorSearch} className="p-2 bg-[var(--bg-main)] border rounded-r-md" disabled={contentIsReadOnly}><SearchIcon className="w-5 h-5"/></button>
                    </div>
                     {orden.proveedorNombre && <p className="text-xs mt-1 text-green-600">Seleccionado: {orden.proveedorNombre}</p>}
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-sm font-medium">F. Emisión</label>
                        <input type="date" value={orden.fechaEmision} onChange={e => setOrden(prev => ({...prev, fechaEmision: e.target.value}))} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" readOnly={contentIsReadOnly} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">F. Esperada</label>
                        <input type="date" value={orden.fechaEsperada} onChange={e => setOrden(prev => ({...prev, fechaEsperada: e.target.value}))} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" readOnly={contentIsReadOnly} />
                    </div>
                </div>
                 {isEditMode && (
                    <div className="md:col-start-1">
                        <label className="text-sm font-medium">Estado</label>
                         <select
                            value={orden.estado}
                            onChange={e => setOrden(prev => ({ ...prev, estado: e.target.value as OrdenCompra['estado'] }))}
                            disabled={orden.estado === 'Recibida'}
                            className="w-full bg-[var(--bg-main)] p-2 border rounded-md"
                        >
                            <option value="Borrador">Borrador</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Enviada">Enviada</option>
                            <option value="Recibida">Recibida</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Add Item Form */}
            {!contentIsReadOnly && (
                <div className="grid grid-cols-12 gap-2 items-end mb-4 flex-shrink-0">
                    <div className="col-span-6">
                        <label className="text-xs font-medium">Insumo</label>
                        <select value={currentItem.insumoId} onChange={handleInsumoSelect} className="w-full bg-[var(--bg-main)] p-1.5 border rounded-md text-sm">
                            <option value="">Seleccione un insumo...</option>
                            {allInsumos.map(insumo => (
                                <option key={insumo.id} value={insumo.id}>{insumo.nombre} ({insumo.id})</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs font-medium">Cantidad</label>
                        <input type="number" value={currentItem.cantidad} onChange={e => setCurrentItem(prev => ({...prev, cantidad: parseInt(e.target.value) || 0}))} className="w-full bg-[var(--bg-main)] p-1.5 border rounded-md text-sm" />
                    </div>
                    <div className="col-span-3">
                        <label className="text-xs font-medium">Vlr. Unitario</label>
                        <input type="number" value={currentItem.valorUnitario} onChange={e => setCurrentItem(prev => ({...prev, valorUnitario: parseFloat(e.target.value) || 0}))} className="w-full bg-[var(--bg-main)] p-1.5 border rounded-md text-sm" />
                    </div>
                    <button onClick={handleAddItem} className="col-span-1 p-2 bg-[var(--bg-main)] rounded-md hover:opacity-80"><PlusIcon /></button>
                </div>
            )}


            {/* Items Table */}
            <div className="flex-grow overflow-y-auto border-y border-[var(--border-color)] py-2">
                 <table className="w-full text-sm">
                    <thead className="font-bold text-left"><tr><th className="pb-2">Cód.</th><th className="pb-2">Descripción</th><th className="pb-2">Cant.</th><th className="pb-2 text-right">Vlr. Unit.</th><th className="pb-2 text-right">Vlr. Total</th><th></th></tr></thead>
                    <tbody>
                        {orden.items.map(item => (
                            <tr key={item.id} className="border-t border-[var(--border-color)]">
                                <td className="py-2">{item.insumoId}</td><td>{item.insumoNombre}</td><td>{item.cantidad}</td><td className="text-right">{formatCurrency(item.valorUnitario)}</td><td className="text-right">{formatCurrency(item.valorTotal)}</td>
                                <td>
                                    {!contentIsReadOnly && (
                                        <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 ml-2"><TrashIcon className="w-4 h-4" /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Footer */}
            <div className="grid grid-cols-3 gap-4 pt-4 flex-shrink-0">
                <div className="col-span-2">
                     <label className="text-sm font-medium">Observaciones</label>
                    <textarea value={orden.observaciones} onChange={e => setOrden(prev => ({...prev, observaciones: e.target.value}))} rows={2} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" readOnly={contentIsReadOnly}></textarea>
                </div>
                <div className="text-right space-y-2">
                    <p className="font-bold text-lg">Total: <span className="text-[var(--secondary-green)]">{formatCurrency(total)}</span></p>
                     <div className="flex justify-end gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg hover:opacity-80">Cancelar</button>
                        {!isEditMode && (
                            <>
                            <button onClick={() => handleSave('Borrador')} className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg hover:opacity-90 flex items-center gap-1"><SaveIcon className="w-4 h-4"/> Guardar Borrador</button>
                            <button onClick={() => handleSave('Enviada')} className="px-4 py-2 text-sm font-medium text-white bg-[var(--secondary-green)] rounded-lg hover:opacity-90">Guardar y Enviar</button>
                            </>
                        )}
                         {isEditMode && !contentIsReadOnly && (
                            <button onClick={() => handleSave()} className="px-4 py-2 text-sm font-medium text-white bg-[var(--secondary-green)] rounded-lg hover:opacity-90">Guardar Cambios</button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};


// --- MAIN COMPONENT ---
interface ComprasProps {
    permissions?: Record<string, boolean>;
    allInsumos: OrionInsumo[];
    proveedores: Tercero[];
}

const Compras: React.FC<ComprasProps> = ({ permissions, allInsumos, proveedores }) => {
    const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = () => {
            try {
                const stored = localStorage.getItem(COMPRAS_STORAGE_KEY);
                if (stored) {
                    setOrdenes(JSON.parse(stored));
                } else {
                    const initialOrdenes: OrdenCompra[] = [
                        { id: 'OC-0052', proveedorId: '900.123.456-7', proveedorNombre: 'Insumos del Campo SAS', fechaEmision: '2024-07-20', fechaEsperada: '2024-07-28', items: [], total: 1200000, estado: 'Recibida', creadoPor: 'Juan Logistica', observaciones: '' },
                        { id: 'OC-0053', proveedorId: '800.789.123-4', proveedorNombre: 'Empaques S.A.', fechaEmision: '2024-07-22', fechaEsperada: '2024-07-30', items: [], total: 850000, estado: 'Enviada', creadoPor: 'Juan Logistica', observaciones: '' },
                        { id: 'OC-0054', proveedorId: '900.123.456-7', proveedorNombre: 'Insumos del Campo SAS', fechaEmision: '2024-07-25', fechaEsperada: '2024-08-05', items: [], total: 250000, estado: 'Borrador', creadoPor: 'Martha Milena', observaciones: '' },
                        { id: 'OC-0055', proveedorId: '901.234.567-8', proveedorNombre: 'Transportes Rápidos LTDA', fechaEmision: '2024-07-26', fechaEsperada: '2024-08-01', items: [], total: 450000, estado: 'En Proceso', creadoPor: 'Martha Milena', observaciones: '' },
                    ];
                    setOrdenes(initialOrdenes);
                    localStorage.setItem(COMPRAS_STORAGE_KEY, JSON.stringify(initialOrdenes));
                }
            } catch (error) {
                console.error("Failed to load purchase orders", error);
            }
        };
        loadData();
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []);

    const filteredOrdenes = useMemo(() => {
        return ordenes
            .filter(orden => {
                if (!searchTerm) return true;
                const lowerSearch = searchTerm.toLowerCase();
                return (
                    orden.id.toLowerCase().includes(lowerSearch) ||
                    orden.proveedorNombre.toLowerCase().includes(lowerSearch) ||
                    orden.estado.toLowerCase().includes(lowerSearch)
                );
            })
            .sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime());
    }, [ordenes, searchTerm]);

    const handleOpenModal = (orden: OrdenCompra | null) => {
        window.dispatchEvent(new CustomEvent('createOrionWindow', {
            detail: {
                title: orden ? 'Editar Orden de Compra' : 'Nueva Orden de Compra',
                props: { ordenToEdit: orden }
            }
        }));
    };
    
    const handleDelete = (ordenId: string) => {
        if (window.confirm(`¿Está seguro de que desea eliminar la orden ${ordenId}?`)) {
            const updatedOrdenes = ordenes.filter(o => o.id !== ordenId);
            setOrdenes(updatedOrdenes);
            localStorage.setItem(COMPRAS_STORAGE_KEY, JSON.stringify(updatedOrdenes));
        }
    };

    const handleExportPDF = (orden: OrdenCompra) => {
        alert(`Funcionalidad para exportar a PDF la orden ${orden.id} no implementada.`);
    };
    
    const getStatusClass = (status: OrdenCompra['estado']) => {
        switch (status) {
            case 'Borrador': return 'bg-gray-200 text-gray-800';
            case 'En Proceso': return 'bg-yellow-100 text-yellow-800';
            case 'Enviada': return 'bg-blue-100 text-blue-800';
            case 'Recibida': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
            <div className="sm:flex sm:items-center sm:justify-between flex-shrink-0">
                <div>
                    <h3 className="text-lg font-bold">Gestión de Compras</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Crea y gestiona las órdenes de compra a proveedores.</p>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                     <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por ID, proveedor, estado..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-3 py-2 w-full sm:w-64 border border-[var(--border-color)] rounded-md text-sm bg-[var(--bg-main)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--secondary-green)] outline-none"
                        />
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-4 h-4 text-[var(--text-secondary)]" /></div>
                    </div>
                    <button
                        onClick={() => handleOpenModal(null)}
                        disabled={!permissions?.crear}
                        title={permissions?.crear ? 'Crear nueva orden de compra' : 'No tiene permisos para crear'}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--secondary-green)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                        <PlusIcon className="mr-2" /> Nueva Orden
                    </button>
                </div>
            </div>

            <div className="flex-grow overflow-auto border border-[var(--border-color)] rounded-lg shadow-md">
                <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="text-xs uppercase bg-[var(--bg-main)] text-[var(--text-primary)] sticky top-0">
                        <tr>
                            <th scope="col" className="py-3 px-6"># OC</th>
                            <th scope="col" className="py-3 px-6">Proveedor</th>
                            <th scope="col" className="py-3 px-6">Fecha Esperada</th>
                            <th scope="col" className="py-3 px-6">Total</th>
                            <th scope="col" className="py-3 px-6">Estado</th>
                            <th scope="col" className="py-3 px-6">Creado Por</th>
                            <th scope="col" className="py-3 px-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrdenes.map(orden => {
                            const isLocked = orden.estado === 'Enviada' || orden.estado === 'Recibida';
                            return (
                                <tr key={orden.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-main)]/50">
                                    <td className="py-4 px-6 font-medium text-[var(--text-primary)]">{orden.id}</td>
                                    <td className="py-4 px-6">{orden.proveedorNombre}</td>
                                    <td className="py-4 px-6">{orden.fechaEsperada}</td>
                                    <td className="py-4 px-6">{formatCurrency(orden.total)}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(orden.estado)}`}>{orden.estado}</span>
                                    </td>
                                    <td className="py-4 px-6">{orden.creadoPor}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => handleOpenModal(orden)} title="Ver Orden" className="text-gray-500 hover:text-gray-700"><ViewIcon /></button>
                                            <button onClick={() => handleOpenModal(orden)} disabled={isLocked || !permissions?.actualizar} title={isLocked ? "No se puede editar una orden enviada/recibida" : (permissions?.actualizar ? "Editar Orden" : "No tiene permisos para editar")} className="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"><EditIcon /></button>
                                            <button onClick={() => handleDelete(orden.id)} disabled={isLocked || !permissions?.eliminar} title={isLocked ? "No se puede eliminar una orden enviada/recibida" : (permissions?.eliminar ? "Eliminar Orden" : "No tiene permisos para eliminar")} className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"><TrashIcon /></button>
                                            <button onClick={() => handleExportPDF(orden)} title="Exportar a PDF" className="text-gray-500 hover:text-gray-700"><PdfIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                         {filteredOrdenes.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-[var(--text-secondary)]">No se encontraron órdenes de compra.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Compras;