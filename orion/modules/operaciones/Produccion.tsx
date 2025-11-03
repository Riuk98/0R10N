


import React, { useState, useEffect, useMemo } from 'react';
import { OrionUser } from '../../data/internalUsers';
import { OrionProduct, OrionInsumo } from './Inventario';

// --- DATA STRUCTURES & MOCKS ---
export interface InsumoRequerido {
    id: number;
    insumoId: string;
    insumoNombre: string;
    cantidad: number;
}

export interface OrdenProduccion {
    id: string; // e.g., 'OP-0236'
    productoId: string;
    productoNombre: string;
    cantidad: number;
    fechaInicio: string; // 'YYYY-MM-DD'
    fechaFin?: string; // 'YYYY-MM-DD'
    insumosRequeridos: InsumoRequerido[];
    estado: 'Planeada' | 'En Proceso' | 'Control de Calidad' | 'Finalizada';
    // FIX: Make 'observaciones' required to ensure data consistency and resolve type mismatch.
    observaciones: string;
    creadoPor: string;
}

const PRODUCCION_STORAGE_KEY = 'orionOrdenesProduccion';
const OP_CONSECUTIVO_KEY = 'orionOPConsecutivo';

// --- ICONS ---
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>);
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>);
const ViewIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

// --- HELPER FUNCTIONS ---
const getNewOPId = () => {
    let lastId = parseInt(localStorage.getItem(OP_CONSECUTIVO_KEY) || '235', 10);
    lastId++;
    localStorage.setItem(OP_CONSECUTIVO_KEY, lastId.toString());
    return `OP-${String(lastId).padStart(4, '0')}`;
};

// --- MODAL COMPONENT ---
interface OrdenProduccionFormProps {
    onClose: () => void;
    ordenToEdit: OrdenProduccion | null;
    allProducts: OrionProduct[];
    allInsumos: OrionInsumo[];
}
export const OrdenProduccionForm: React.FC<OrdenProduccionFormProps> = ({ onClose, ordenToEdit, allProducts, allInsumos }) => {
    const isEditMode = !!ordenToEdit;
    const initialFormState = {
        productoId: '', productoNombre: '', cantidad: 100, fechaInicio: new Date().toISOString().split('T')[0], estado: 'Planeada' as OrdenProduccion['estado'],
        insumosRequeridos: [] as InsumoRequerido[], observaciones: '', creadoPor: ''
    };
    const [orden, setOrden] = useState(initialFormState);
    const [ordenId, setOrdenId] = useState('');
    const [currentInsumo, setCurrentInsumo] = useState({ insumoId: '', insumoNombre: '', cantidad: 1 });

    useEffect(() => {
        if (isEditMode && ordenToEdit) {
            setOrdenId(ordenToEdit.id);
            setOrden(ordenToEdit);
        } else {
            setOrdenId(getNewOPId());
        }
    }, [isEditMode, ordenToEdit]);

    const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const product = allProducts.find(p => p.id === selectedId);
        if (product) {
            setOrden(prev => ({ ...prev, productoId: product.id, productoNombre: product.nombre }));
        }
    };
    
    const handleAddInsumo = () => {
        if (!currentInsumo.insumoId || currentInsumo.cantidad <= 0) return;
        const newInsumo: InsumoRequerido = { id: Date.now(), ...currentInsumo };
        setOrden(prev => ({ ...prev, insumosRequeridos: [...prev.insumosRequeridos, newInsumo] }));
        setCurrentInsumo({ insumoId: '', insumoNombre: '', cantidad: 1 });
    };

    const handleSave = () => {
        const currentUserRaw = sessionStorage.getItem('orionCurrentUser');
        const currentUser: OrionUser | null = currentUserRaw ? JSON.parse(currentUserRaw) : null;
        const userName = currentUser ? `${currentUser.nombre || ''} ${currentUser.apellidos || ''}`.trim() || currentUser.username : 'Sistema';

        const finalOrden: OrdenProduccion = { ...orden, id: ordenId, creadoPor: userName };
        
        try {
            const storedData = JSON.parse(localStorage.getItem(PRODUCCION_STORAGE_KEY) || '[]');
            const isUpdating = storedData.some((o: OrdenProduccion) => o.id === finalOrden.id);
            const updatedData = isUpdating
                ? storedData.map((o: OrdenProduccion) => o.id === finalOrden.id ? finalOrden : o)
                : [...storedData, finalOrden];
            localStorage.setItem(PRODUCCION_STORAGE_KEY, JSON.stringify(updatedData));
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error('Failed to save production order', error);
        }

        onClose();
    };

    const contentIsReadOnly = isEditMode && ordenToEdit?.estado === 'Finalizada';

    return (
        <div className="bg-[var(--bg-card)] p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">{isEditMode ? 'Editar' : 'Crear'} Orden de Producción</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-[var(--border-color)]">
                <div><label># OP</label><input type="text" value={ordenId} readOnly className="w-full bg-[var(--border-color)] p-2 border rounded-md cursor-not-allowed" /></div>
                <div className="md:col-span-2"><label>Producto a Fabricar</label>
                    <select value={orden.productoId} onChange={handleProductSelect} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" disabled={contentIsReadOnly}>
                        <option value="">Seleccione un producto...</option>
                        {allProducts.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                </div>
                <div><label>Cantidad</label><input type="number" value={orden.cantidad} onChange={e => setOrden(p => ({...p, cantidad: parseInt(e.target.value)}))} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" readOnly={contentIsReadOnly} /></div>
                <div><label>Fecha Inicio</label><input type="date" value={orden.fechaInicio} onChange={e => setOrden(p => ({...p, fechaInicio: e.target.value}))} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" readOnly={contentIsReadOnly} /></div>
                <div><label>Estado</label>
                    <select value={orden.estado} onChange={e => setOrden(p => ({...p, estado: e.target.value as OrdenProduccion['estado']}))} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" disabled={contentIsReadOnly}>
                        <option>Planeada</option><option>En Proceso</option><option>Control de Calidad</option><option>Finalizada</option>
                    </select>
                </div>
            </div>

            <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden">
                <div className="md:w-2/5 flex flex-col">
                    <h4 className="font-bold mb-2">Insumos Requeridos</h4>
                    {!contentIsReadOnly && (
                        <div className="grid grid-cols-12 gap-2 items-end mb-4 p-2 bg-[var(--bg-main)]/50 rounded-md">
                            <div className="col-span-7"><label className="text-xs">Insumo</label>
                                <select value={currentInsumo.insumoId} onChange={e => setCurrentInsumo(i => ({...i, insumoId: e.target.value, insumoNombre: allInsumos.find(m => m.id === e.target.value)?.nombre || ''}))} className="w-full p-1 border rounded bg-[var(--bg-main)]"><option value="">Seleccione...</option>{allInsumos.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}</select>
                            </div>
                            <div className="col-span-3"><label className="text-xs">Cant.</label><input type="number" value={currentInsumo.cantidad} onChange={e => setCurrentInsumo(i => ({...i, cantidad: parseInt(e.target.value)}))} className="w-full p-1 border rounded bg-[var(--bg-main)]"/></div>
                            <button onClick={handleAddInsumo} className="col-span-2 p-2 bg-[var(--bg-main)] rounded-md"><PlusIcon className="w-4 h-4"/></button>
                        </div>
                    )}
                    <div className="flex-grow overflow-y-auto border border-[var(--border-color)] rounded-lg p-2 space-y-2">
                         {orden.insumosRequeridos.map(insumo => <div key={insumo.id} className="text-sm p-2 bg-[var(--bg-main)]/50 rounded flex justify-between"><span>{insumo.insumoNombre}</span><span className="font-semibold">{insumo.cantidad}</span></div>)}
                    </div>
                </div>
                <div className="md:w-3/5 flex flex-col"><label className="font-bold mb-2">Observaciones</label><textarea value={orden.observaciones} onChange={e => setOrden(p => ({...p, observaciones: e.target.value}))} rows={5} className="w-full flex-grow bg-[var(--bg-main)] p-2 border rounded-md" readOnly={contentIsReadOnly}></textarea></div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-[var(--bg-main)] border rounded-lg">Cancelar</button>
                {!contentIsReadOnly && <button onClick={handleSave} className="px-4 py-2 text-white bg-[var(--secondary-green)] rounded-lg">Guardar</button>}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
interface ProduccionProps {
    permissions?: Record<string, boolean>;
    allProducts: OrionProduct[];
    allInsumos: OrionInsumo[];
}

const Produccion: React.FC<ProduccionProps> = ({ permissions, allProducts, allInsumos }) => {
    const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = () => {
            try {
                const stored = localStorage.getItem(PRODUCCION_STORAGE_KEY);
                if (stored) {
                    setOrdenes(JSON.parse(stored));
                } else {
                    const initial: OrdenProduccion[] = [
                        { id: 'OP-0234', productoId: 'QCP-500', productoNombre: 'Queso Campesino 500g', cantidad: 500, fechaInicio: '2024-07-28', estado: 'En Proceso', insumosRequeridos: [], creadoPor: 'Juan Logistica', observaciones: '' },
                        { id: 'OP-0235', productoId: 'YFR-1L', productoNombre: 'Yogur de Fresa 1L', cantidad: 300, fechaInicio: '2024-07-29', estado: 'Planeada', insumosRequeridos: [], creadoPor: 'Juan Logistica', observaciones: '' },
                        { id: 'OP-0233', productoId: 'AQP-450', productoNombre: 'Arequipe 450g', cantidad: 400, fechaInicio: '2024-07-25', fechaFin: '2024-07-26', estado: 'Finalizada', insumosRequeridos: [], creadoPor: 'Juan Logistica', observaciones: '' },
                    ];
                    setOrdenes(initial);
                    localStorage.setItem(PRODUCCION_STORAGE_KEY, JSON.stringify(initial));
                }
            } catch (error) { console.error("Failed to load production orders", error); }
        };
        loadData();
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []);

    const filteredOrdenes = useMemo(() => {
        return ordenes.filter(o => !searchTerm || o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.productoNombre.toLowerCase().includes(searchTerm.toLowerCase()) || o.estado.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());
    }, [ordenes, searchTerm]);
    
    const handleOpenModal = (orden: OrdenProduccion | null) => {
        window.dispatchEvent(new CustomEvent('createOrionWindow', {
            detail: {
                title: orden ? 'Editar Orden de Producción' : 'Nueva Orden de Producción',
                props: { ordenToEdit: orden }
            }
        }));
    };

    const handleDelete = (ordenId: string) => {
        if (window.confirm(`¿Eliminar la orden ${ordenId}?`)) {
            const updated = ordenes.filter(o => o.id !== ordenId);
            setOrdenes(updated);
            localStorage.setItem(PRODUCCION_STORAGE_KEY, JSON.stringify(updated));
        }
    };

    const getStatusClass = (status: OrdenProduccion['estado']) => {
        const classes = 'px-2 py-1 text-xs font-semibold rounded-full';
        switch (status) {
            case 'Planeada': return `${classes} bg-gray-200 text-gray-800`;
            case 'En Proceso': return `${classes} bg-blue-100 text-blue-800`;
            case 'Control de Calidad': return `${classes} bg-yellow-100 text-yellow-800`;
            case 'Finalizada': return `${classes} bg-green-100 text-green-800`;
            default: return classes;
        }
    };

    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div><h3 className="text-lg font-bold">Control de Producción</h3><p className="text-sm text-[var(--text-secondary)]">Planifica y sigue el progreso de las órdenes de producción.</p></div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <div className="relative">
                        <input type="text" placeholder="Buscar por ID, producto, estado..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 w-full sm:w-64 border rounded-md text-sm bg-[var(--bg-main)] focus:ring-2 focus:ring-[var(--secondary-green)] outline-none" />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-4 h-4 text-[var(--text-secondary)]" /></div>
                    </div>
                    <button onClick={() => handleOpenModal(null)} disabled={!permissions?.crear} className="inline-flex items-center justify-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md text-white bg-[var(--secondary-green)] hover:opacity-90 disabled:opacity-50"><PlusIcon className="mr-2" /> Nueva Orden</button>
                </div>
            </div>

            <div className="flex-grow overflow-auto border rounded-lg shadow-md">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-[var(--bg-main)] sticky top-0"><tr>
                        {['# OP', 'Producto a Fabricar', 'Cantidad', 'Fecha Inicio', 'Estado', 'Acciones'].map(h => <th key={h} scope="col" className="py-3 px-6">{h}</th>)}
                    </tr></thead>
                    <tbody>
                        {filteredOrdenes.map(orden => (
                            <tr key={orden.id} className="border-b hover:bg-[var(--bg-main)]/50">
                                <td className="py-4 px-6 font-medium">{orden.id}</td>
                                <td className="py-4 px-6">{orden.productoNombre}</td>
                                <td className="py-4 px-6">{orden.cantidad}</td>
                                <td className="py-4 px-6">{orden.fechaInicio}</td>
                                <td className="py-4 px-6"><span className={getStatusClass(orden.estado)}>{orden.estado}</span></td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleOpenModal(orden)} title="Ver/Editar Orden"><ViewIcon /></button>
                                        <button onClick={() => handleDelete(orden.id)} disabled={!permissions?.eliminar || orden.estado === 'Finalizada'} title="Eliminar Orden" className="text-red-500 disabled:opacity-30"><TrashIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Produccion;