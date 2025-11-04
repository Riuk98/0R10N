import React, { useState, useEffect, useMemo } from 'react';
import { AsientoContable as AsientoContableData, Partida as PartidaData, initialAsientos } from '../../data/contabilidadData';
import { OrionUser } from '../../data/internalUsers';


// --- ICONS ---
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>);
const ArrowIcon = (props: { isExpanded: boolean } & React.SVGProps<SVGSVGElement>) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${props.isExpanded ? 'rotate-90' : ''}`}><polyline points="9 18 15 12 9 6"></polyline></svg>);
const ViewIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const PdfIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);

export interface Partida extends PartidaData {}
export interface AsientoContable extends AsientoContableData {}

const ASIENTOS_STORAGE_KEY = 'orionAsientosContables';
const CONSECUTIVOS_STORAGE_KEY = 'orionContabilidadConsecutivos';
type TipoAsiento = 'Egresos' | 'Recibos de Caja' | 'Comprobante Contable';

// --- DEFINITIONS FOR ACCOUNT SEARCH MODAL ---
const CUENTAS_COBRAR_STORAGE_KEY = 'orionCuentasCobrar';
const CUENTAS_PAGAR_STORAGE_KEY = 'orionCuentasPagar';

// Interface copied from CuentasCobrar.tsx as it's not exported
interface CuentaPorCobrar {
    id: string;
    facturaId: string;
    clienteNit: string;
    clienteNombre: string;
    clienteTelefono: string;
    ciudad: string;
    fechaEmision: string;
    fechaVencimiento: string;
    valorFactura: number;
    saldo: number;
}

// Interface for Accounts Payable
interface CuentaPorPagar {
    id: string;
    ordenCompraId: string;
    proveedorId: string;
    proveedorNombre: string;
    fechaRecepcion: string;
    fechaVencimiento: string;
    valorTotal: number;
    saldo: number;
}

// Mock data for Accounts Payable
const initialCuentasPagar: CuentaPorPagar[] = [
    { id: 'CXP-OC-0052', ordenCompraId: 'OC-0052', proveedorId: '860.777.888-2', proveedorNombre: 'Agroinsumos La Finca', fechaRecepcion: '2024-07-28', fechaVencimiento: '2024-08-27', valorTotal: 1200000, saldo: 1200000 },
    { id: 'CXP-OC-0053', ordenCompraId: 'OC-0053', proveedorId: '900.999.000-3', proveedorNombre: 'Envases Plásticos de Colombia', fechaRecepcion: '2024-07-30', fechaVencimiento: '2024-08-29', valorTotal: 850000, saldo: 350000 },
];

// FIX: Define formatCurrency at module scope to be accessible by all components in this file.
const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

const tipoAsientoPrefix: Record<TipoAsiento, string> = {
    'Egresos': 'EG',
    'Recibos de Caja': 'RC',
    'Comprobante Contable': 'CT'
};

const formatConsecutivo = (tipo: TipoAsiento | '', numero: number): string => {
    if (!tipo || !numero) return '';
    const prefix = tipoAsientoPrefix[tipo as TipoAsiento];
    return `${prefix} - ${String(numero).padStart(3, '0')}`;
};

const isSameMonthAndYear = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
};

const Contabilidad: React.FC = () => {
    const [asientos, setAsientos] = useState<AsientoContable[]>([]);
    const [expandedRows, setExpandedRows] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        const loadAsientos = () => {
            try {
                const storedAsientos = localStorage.getItem(ASIENTOS_STORAGE_KEY);
                if (storedAsientos) {
                    setAsientos(JSON.parse(storedAsientos));
                } else {
                    setAsientos(initialAsientos);
                    localStorage.setItem(ASIENTOS_STORAGE_KEY, JSON.stringify(initialAsientos));
                }

                const storedConsecutivos = localStorage.getItem(CONSECUTIVOS_STORAGE_KEY);
                if (!storedConsecutivos) {
                     localStorage.setItem(CONSECUTIVOS_STORAGE_KEY, JSON.stringify({
                        'Egresos': initialAsientos.filter(a => a.tipo === 'Egresos').length,
                        'Recibos de Caja': initialAsientos.filter(a => a.tipo === 'Recibos de Caja').length,
                        'Comprobante Contable': initialAsientos.filter(a => a.tipo === 'Comprobante Contable').length
                    }));
                }
            } catch (error) {
                console.error("Failed to load accounting entries", error);
                setAsientos(initialAsientos);
            }
        };
        loadAsientos();
        window.addEventListener('storage', loadAsientos);
        return () => window.removeEventListener('storage', loadAsientos);
    }, []);

    const filteredAsientos = useMemo(() => {
        return asientos
            .filter(asiento => {
                if (!searchTerm) return true;
                const lowerSearch = searchTerm.toLowerCase().replace(/\s/g, '');
                return (
                    asiento.concepto.toLowerCase().includes(lowerSearch) ||
                    asiento.id.toLowerCase().includes(lowerSearch) ||
                    asiento.tipo.toLowerCase().includes(lowerSearch) ||
                    formatConsecutivo(asiento.tipo, asiento.consecutivo).toLowerCase().replace(/\s/g, '').includes(lowerSearch) ||
                    asiento.creadoPor.toLowerCase().includes(lowerSearch) ||
                    asiento.partidas.some(p => p.cuenta.toLowerCase().includes(lowerSearch) || p.descripcion.toLowerCase().includes(lowerSearch))
                );
            })
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }, [asientos, searchTerm]);

    const handleOpenEditModal = (asiento: AsientoContable) => {
        window.dispatchEvent(new CustomEvent('createOrionWindow', {
            detail: { 
                title: 'Editar Asiento Contable',
                props: { asientoToEdit: asiento }
            }
        }));
    };
    
    const handleExportPDF = (asiento: AsientoContable) => {
        alert(`Generando PDF para el asiento ${formatConsecutivo(asiento.tipo, asiento.consecutivo)}...`);
    };

    const handleToggleRow = (asientoId: string) => {
        setExpandedRows(prev =>
            prev.includes(asientoId)
                ? prev.filter(id => id !== asientoId)
                : [...prev, asientoId]
        );
    };

    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
            <div className="sm:flex sm:items-center sm:justify-between flex-shrink-0">
                <div>
                    <h3 className="text-lg font-bold">Contabilidad General</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Registro y consulta de asientos contables.</p>
                </div>
                <button
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent('createOrionWindow', {
                            detail: { title: 'Nuevo Asiento Contable' }
                        }));
                    }}
                    className="mt-2 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--secondary-green)] hover:opacity-90">
                    <PlusIcon className="mr-2" /> Nuevo Asiento
                </button>
            </div>

            <input
                type="text"
                placeholder="Buscar por concepto, tipo, consecutivo, usuario, cuenta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md text-sm bg-[var(--bg-main)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--secondary-green)] outline-none flex-shrink-0"
            />

            <div className="flex-grow overflow-auto border border-[var(--border-color)] rounded-lg shadow-md">
                <table className="w-full text-sm text-left text-[var(--text-secondary)] min-w-[1000px]">
                    <thead className="text-xs uppercase bg-[var(--bg-main)] text-[var(--text-primary)] sticky top-0">
                        <tr>
                            <th scope="col" className="py-3 px-6 w-12"></th>
                            <th scope="col" className="py-3 px-6">Fecha</th>
                            <th scope="col" className="py-3 px-6">Tipo</th>
                            <th scope="col" className="py-3 px-6">Consecutivo</th>
                            <th scope="col" className="py-3 px-6">Concepto</th>
                            <th scope="col" className="py-3 px-6">Creado Por</th>
                            <th scope="col" className="py-3 px-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAsientos.map(asiento => {
                            const isExpanded = expandedRows.includes(asiento.id);
                            const canEdit = isSameMonthAndYear(new Date(), new Date(asiento.fecha));

                            return (
                                <React.Fragment key={asiento.id}>
                                    <tr className="border-b border-[var(--border-color)] hover:bg-[var(--bg-main)]/50">
                                        <td className="py-3 px-6 text-center">
                                            <button onClick={() => handleToggleRow(asiento.id)} className="p-1 rounded-full hover:bg-[var(--border-color)]"><ArrowIcon isExpanded={isExpanded} /></button>
                                        </td>
                                        <td className="py-3 px-6">{asiento.fecha}</td>
                                        <td className="py-3 px-6 font-medium text-[var(--text-primary)]">{asiento.tipo}</td>
                                        <td className="py-3 px-6">{formatConsecutivo(asiento.tipo, asiento.consecutivo)}</td>
                                        <td className="py-3 px-6 max-w-sm truncate" title={asiento.concepto}>{asiento.concepto}</td>
                                        <td className="py-3 px-6">{asiento.creadoPor}</td>
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => handleToggleRow(asiento.id)} title="Ver Detalle" className="text-gray-500 hover:text-gray-700"><ViewIcon /></button>
                                                <button onClick={() => handleExportPDF(asiento)} title="Exportar a PDF" className="text-gray-500 hover:text-gray-700"><PdfIcon /></button>
                                                <button 
                                                    onClick={() => handleOpenEditModal(asiento)} 
                                                    title={canEdit ? "Modificar Asiento" : "No se puede editar asientos de meses anteriores"}
                                                    disabled={!canEdit}
                                                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <EditIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="bg-[var(--bg-main)]/30">
                                            <td colSpan={7} className="p-0">
                                                <div className="p-4">
                                                     <div className="flex justify-between items-center mb-2 font-bold text-base">
                                                        <span>Detalle del Asiento</span>
                                                        <div className="grid grid-cols-2 gap-x-8 text-right">
                                                            <span>{formatCurrency(asiento.partidas.reduce((s, p) => s + p.debito, 0))}</span>
                                                            <span>{formatCurrency(asiento.partidas.reduce((s, p) => s + p.credito, 0))}</span>
                                                        </div>
                                                     </div>
                                                    <table className="w-full text-xs min-w-[700px]">
                                                        <thead className="font-bold">
                                                            <tr>
                                                                <td className="pb-2 px-2">Cuenta</td>
                                                                <td className="pb-2 px-2">Descripción</td>
                                                                <td className="pb-2 px-2 text-right">Débito</td>
                                                                <td className="pb-2 px-2 text-right">Crédito</td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {asiento.partidas.map(p => (
                                                                <tr key={p.id} className="border-t border-[var(--border-color)]">
                                                                    <td className="py-2 px-2">{p.cuenta}</td>
                                                                    <td className="py-2 px-2">{p.descripcion}</td>
                                                                    <td className="py-2 px-2 text-right">{p.debito > 0 ? formatCurrency(p.debito) : ''}</td>
                                                                    <td className="py-2 px-2 text-right">{p.credito > 0 ? formatCurrency(p.credito) : ''}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Form Component for New/Edit Entry ---
interface NuevoAsientoContableFormProps {
    onClose: () => void;
    asientoToEdit?: AsientoContable;
}

// --- Search Modal Component ---
interface BuscarCuentasModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (cuenta: CuentaPorCobrar | CuentaPorPagar, tipo: 'cobrar' | 'pagar') => void;
    cuentasPorCobrar: CuentaPorCobrar[];
    cuentasPorPagar: CuentaPorPagar[];
}

const BuscarCuentasModal: React.FC<BuscarCuentasModalProps> = ({ isOpen, onClose, onSelect, cuentasPorCobrar, cuentasPorPagar }) => {
    const [activeTab, setActiveTab] = useState<'cobrar' | 'pagar'>('cobrar');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCuentasCobrar = useMemo(() => cuentasPorCobrar.filter(c => c.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) || c.facturaId.toLowerCase().includes(searchTerm.toLowerCase())), [cuentasPorCobrar, searchTerm]);
    const filteredCuentasPagar = useMemo(() => cuentasPorPagar.filter(c => c.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) || c.ordenCompraId.toLowerCase().includes(searchTerm.toLowerCase())), [cuentasPorPagar, searchTerm]);

    useEffect(() => {
        if (isOpen) setSearchTerm('');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[1050] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[var(--bg-card)] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h3 className="text-lg font-bold">Buscar Cuentas Pendientes</h3>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>
                <div className="flex border-b border-[var(--border-color)]">
                    <button onClick={() => setActiveTab('cobrar')} className={`flex-1 p-3 font-semibold ${activeTab === 'cobrar' ? 'bg-[var(--bg-main)] text-[var(--secondary-green)]' : ''}`}>Cuentas por Cobrar</button>
                    <button onClick={() => setActiveTab('pagar')} className={`flex-1 p-3 font-semibold ${activeTab === 'pagar' ? 'bg-[var(--bg-main)] text-[var(--secondary-green)]' : ''}`}>Cuentas por Pagar</button>
                </div>
                <div className="p-4"><input type="text" placeholder="Buscar por cliente/proveedor o documento..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 bg-[var(--bg-main)] border rounded-md" /></div>
                <div className="flex-grow overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--bg-main)] sticky top-0">
                            <tr>
                                <th className="p-2 text-left">{activeTab === 'cobrar' ? 'Factura' : 'O. Compra'}</th>
                                <th className="p-2 text-left">{activeTab === 'cobrar' ? 'Cliente' : 'Proveedor'}</th>
                                <th className="p-2 text-left">Vencimiento</th>
                                <th className="p-2 text-right">Saldo</th>
                                <th className="p-2">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeTab === 'cobrar' && filteredCuentasCobrar.map(c => (
                                <tr key={c.id} className="border-t hover:bg-[var(--bg-main)]/50">
                                    <td className="p-2">{c.facturaId}</td><td className="p-2">{c.clienteNombre}</td><td className="p-2">{new Date(c.fechaVencimiento).toLocaleDateString()}</td><td className="p-2 text-right">{formatCurrency(c.saldo)}</td>
                                    <td className="p-2 text-center"><button onClick={() => onSelect(c, 'cobrar')} className="px-2 py-1 text-xs bg-[var(--secondary-green)] text-white rounded">Seleccionar</button></td>
                                </tr>
                            ))}
                            {activeTab === 'pagar' && filteredCuentasPagar.map(c => (
                                <tr key={c.id} className="border-t hover:bg-[var(--bg-main)]/50">
                                    <td className="p-2">{c.ordenCompraId}</td><td className="p-2">{c.proveedorNombre}</td><td className="p-2">{new Date(c.fechaVencimiento).toLocaleDateString()}</td><td className="p-2 text-right">{formatCurrency(c.saldo)}</td>
                                    <td className="p-2 text-center"><button onClick={() => onSelect(c, 'pagar')} className="px-2 py-1 text-xs bg-[var(--secondary-green)] text-white rounded">Seleccionar</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export const NuevoAsientoContableForm: React.FC<NuevoAsientoContableFormProps> = ({ onClose, asientoToEdit }) => {
    const isEditMode = !!asientoToEdit;
    const [tipo, setTipo] = useState<TipoAsiento | ''>('');
    const [consecutivo, setConsecutivo] = useState<number>(0);
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [concepto, setConcepto] = useState('');
    const [partidas, setPartidas] = useState<Omit<Partida, 'id'>[]>([
        { cuenta: '', descripcion: '', debito: 0, credito: 0 },
        { cuenta: '', descripcion: '', debito: 0, credito: 0 },
    ]);

    // State for the new modal
    const [cuentasPorCobrar, setCuentasPorCobrar] = useState<CuentaPorCobrar[]>([]);
    const [cuentasPorPagar, setCuentasPorPagar] = useState<CuentaPorPagar[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartidaIndex, setEditingPartidaIndex] = useState<number | null>(null);
    
    useEffect(() => {
        if (asientoToEdit) {
            setTipo(asientoToEdit.tipo);
            setConsecutivo(asientoToEdit.consecutivo);
            setFecha(asientoToEdit.fecha);
            setConcepto(asientoToEdit.concepto);
            setPartidas(asientoToEdit.partidas.map(({ id, ...rest }) => rest)); // Remove id for editing
        }
    }, [asientoToEdit]);

    useEffect(() => {
        if (tipo && !isEditMode) {
            try {
                const storedConsecutivos = JSON.parse(localStorage.getItem(CONSECUTIVOS_STORAGE_KEY) || '{}');
                const nextConsecutivo = (storedConsecutivos[tipo] || 0) + 1;
                setConsecutivo(nextConsecutivo);
            } catch (error) {
                console.error("Failed to get next consecutive", error);
                setConsecutivo(1);
            }
        } else if (!tipo) {
            setConsecutivo(0);
        }
    }, [tipo, isEditMode]);

    // Effect to load CxC and CxP data
    useEffect(() => {
        const storedCxc = localStorage.getItem(CUENTAS_COBRAR_STORAGE_KEY);
        if (storedCxc) setCuentasPorCobrar(JSON.parse(storedCxc).filter((c: CuentaPorCobrar) => c.saldo > 0));

        const storedCxp = localStorage.getItem(CUENTAS_PAGAR_STORAGE_KEY);
        if (storedCxp) setCuentasPorPagar(JSON.parse(storedCxp).filter((c: CuentaPorPagar) => c.saldo > 0));
        else {
            localStorage.setItem(CUENTAS_PAGAR_STORAGE_KEY, JSON.stringify(initialCuentasPagar));
            setCuentasPorPagar(initialCuentasPagar.filter(c => c.saldo > 0));
        }
    }, []);

    const openModalForPartida = (index: number) => {
        setEditingPartidaIndex(index);
        setIsModalOpen(true);
    };

    const handleSelectCuenta = (cuenta: CuentaPorCobrar | CuentaPorPagar, tipo: 'cobrar' | 'pagar') => {
        if (editingPartidaIndex === null) return;
        let partida1: Omit<Partida, 'id'>, partida2: Omit<Partida, 'id'>;

        if (tipo === 'cobrar') {
            const cxc = cuenta as CuentaPorCobrar;
            partida1 = { cuenta: '110505', descripcion: `Abono F. ${cxc.facturaId} - ${cxc.clienteNombre}`, debito: cxc.saldo, credito: 0 };
            partida2 = { cuenta: '130505', descripcion: `Cancelación F. ${cxc.facturaId}`, debito: 0, credito: cxc.saldo };
        } else {
            const cxp = cuenta as CuentaPorPagar;
            partida1 = { cuenta: '2205', descripcion: `Abono OC ${cxp.ordenCompraId} - ${cxp.proveedorNombre}`, debito: cxp.saldo, credito: 0 };
            partida2 = { cuenta: '111005', descripcion: `Pago OC ${cxp.ordenCompraId}`, debito: 0, credito: cxp.saldo };
        }
        
        const newPartidas = [...partidas];
        newPartidas[editingPartidaIndex] = partida1;
        
        const nextIndex = editingPartidaIndex + 1;
        if (nextIndex < newPartidas.length && newPartidas[nextIndex].cuenta === '' && newPartidas[nextIndex].debito === 0 && newPartidas[nextIndex].credito === 0) {
            newPartidas[nextIndex] = partida2;
        } else {
            newPartidas.splice(nextIndex, 0, partida2);
        }
        
        setPartidas(newPartidas);
        setIsModalOpen(false);
        setEditingPartidaIndex(null);
    };


    const handlePartidaChange = (index: number, field: keyof Omit<Partida, 'id'>, value: string | number) => {
        const newPartidas = [...partidas];
        const partida = { ...newPartidas[index] };
        
        if (field === 'debito') {
            partida.debito = Number(value);
            if (Number(value) > 0) partida.credito = 0;
        } else if (field === 'credito') {
            partida.credito = Number(value);
            if (Number(value) > 0) partida.debito = 0;
        } else {
            partida[field as 'cuenta' | 'descripcion'] = String(value);
        }
        
        newPartidas[index] = partida;
        setPartidas(newPartidas);
    };

    const addPartida = () => {
        setPartidas([...partidas, { cuenta: '', descripcion: '', debito: 0, credito: 0 }]);
    };

    const removePartida = (index: number) => {
        setPartidas(partidas.filter((_, i) => i !== index));
    };

    const totalDebito = useMemo(() => partidas.reduce((sum, p) => sum + p.debito, 0), [partidas]);
    const totalCredito = useMemo(() => partidas.reduce((sum, p) => sum + p.credito, 0), [partidas]);
    const isBalanced = totalDebito === totalCredito && totalDebito > 0;

    const handleSubmit = () => {
        if (!isBalanced || !fecha || !concepto || !tipo) {
            alert("Verifique que el asiento esté balanceado, y que el tipo, fecha y concepto no estén vacíos.");
            return;
        }
    
        const currentUserRaw = sessionStorage.getItem('orionCurrentUser');
        const currentUser: OrionUser | null = currentUserRaw ? JSON.parse(currentUserRaw) : null;
        const userName = currentUser ? `${currentUser.nombre || ''} ${currentUser.apellidos || ''}`.trim() || currentUser.username : 'Sistema';
    
        const asientoData: AsientoContable = {
            id: isEditMode ? asientoToEdit!.id : `AS-${Date.now()}`,
            fecha,
            concepto,
            tipo,
            consecutivo: isEditMode ? asientoToEdit!.consecutivo : consecutivo,
            partidas: partidas.map((p, i) => ({ ...p, id: Date.now() + i })),
            creadoPor: userName,
        };
    
        try {
            // --- SAVE ACCOUNTING ENTRY ---
            const storedAsientos = JSON.parse(localStorage.getItem(ASIENTOS_STORAGE_KEY) || '[]');
            const isUpdating = storedAsientos.some((a: AsientoContable) => a.id === asientoData.id);
            let updatedAsientos;
    
            if (isUpdating) {
                updatedAsientos = storedAsientos.map((a: AsientoContable) => a.id === asientoData.id ? asientoData : a);
            } else {
                updatedAsientos = [...storedAsientos, asientoData];
                const storedConsecutivos = JSON.parse(localStorage.getItem(CONSECUTIVOS_STORAGE_KEY) || '{}');
                storedConsecutivos[asientoData.tipo] = asientoData.consecutivo;
                localStorage.setItem(CONSECUTIVOS_STORAGE_KEY, JSON.stringify(storedConsecutivos));
            }
            localStorage.setItem(ASIENTOS_STORAGE_KEY, JSON.stringify(updatedAsientos));
    
            // --- UPDATE CxC / CxP BALANCES ---
            if (asientoData.tipo === 'Recibos de Caja') {
                const storedCxc = JSON.parse(localStorage.getItem(CUENTAS_COBRAR_STORAGE_KEY) || '[]');
                let hasChanges = false;
                asientoData.partidas.forEach(partida => {
                    if (partida.cuenta === '130505' && partida.credito > 0) {
                        const match = partida.descripcion.match(/F\.\s*([A-Z0-9-]+)/i);
                        if (match && match[1]) {
                            const facturaId = match[1];
                            const cxcIndex = storedCxc.findIndex((c: any) => c.facturaId === facturaId);
                            if (cxcIndex > -1) {
                                storedCxc[cxcIndex].saldo = Math.max(0, storedCxc[cxcIndex].saldo - partida.credito);
                                hasChanges = true;
                            }
                        }
                    }
                });
                if (hasChanges) {
                    localStorage.setItem(CUENTAS_COBRAR_STORAGE_KEY, JSON.stringify(storedCxc));
                }
            } else if (asientoData.tipo === 'Egresos') {
                const storedCxp = JSON.parse(localStorage.getItem(CUENTAS_PAGAR_STORAGE_KEY) || '[]');
                let hasChanges = false;
                asientoData.partidas.forEach(partida => {
                    if (partida.cuenta === '2205' && partida.debito > 0) {
                        const match = partida.descripcion.match(/OC\s*([A-Z0-9-]+)/i);
                        if (match && match[1]) {
                            const ordenCompraId = match[1];
                            const cxpIndex = storedCxp.findIndex((c: any) => c.ordenCompraId === ordenCompraId);
                            if (cxpIndex > -1) {
                                storedCxp[cxpIndex].saldo = Math.max(0, storedCxp[cxpIndex].saldo - partida.debito);
                                hasChanges = true;
                            }
                        }
                    }
                });
                if (hasChanges) {
                    localStorage.setItem(CUENTAS_PAGAR_STORAGE_KEY, JSON.stringify(storedCxp));
                }
            }
    
            window.dispatchEvent(new Event('storage')); // Notify other components
        } catch (error) {
            console.error("Failed to save asiento and update accounts", error);
            alert("Ocurrió un error al guardar el asiento contable.");
        }
    
        onClose();
    };


    return (
        <div className="bg-[var(--bg-card)] p-6 h-full flex flex-col">
            <BuscarCuentasModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectCuenta} cuentasPorCobrar={cuentasPorCobrar} cuentasPorPagar={cuentasPorPagar} />
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex-shrink-0">{isEditMode ? 'Editar Asiento Contable' : 'Crear Nuevo Asiento Contable'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 flex-shrink-0">
                <div>
                    <label className="text-sm font-medium">Tipo de Asiento</label>
                    <select value={tipo} onChange={e => setTipo(e.target.value as TipoAsiento)} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" disabled={isEditMode}>
                        <option value="">Seleccione...</option>
                        <option value="Egresos">Egresos</option>
                        <option value="Recibos de Caja">Recibos de Caja</option>
                        <option value="Comprobante Contable">Comprobante Contable</option>
                    </select>
                </div>
                 <div>
                    <label className="text-sm font-medium">Consecutivo</label>
                    <input type="text" value={formatConsecutivo(tipo, consecutivo)} readOnly className="w-full bg-[var(--border-color)] p-2 border rounded-md cursor-not-allowed" />
                </div>
                <div>
                    <label className="text-sm font-medium">Fecha</label>
                    <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" />
                </div>
                <div className="md:col-span-4">
                    <label className="text-sm font-medium">Concepto General</label>
                    <input type="text" value={concepto} onChange={e => setConcepto(e.target.value)} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto border-t border-b border-[var(--border-color)] py-2">
                <div className="min-w-[800px]">
                    {partidas.map((partida, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2">
                            <div className="col-span-3 relative">
                                <input type="text" placeholder="Cuenta (e.g., 110505)" value={partida.cuenta} onChange={e => handlePartidaChange(index, 'cuenta', e.target.value)} className="w-full bg-[var(--bg-main)] p-1.5 border rounded-md text-sm pr-8" />
                                <button type="button" onClick={() => openModalForPartida(index)} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--border-color)]" title="Buscar Cuentas Pendientes">
                                    <SearchIcon className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                            <input type="text" placeholder="Descripción" value={partida.descripcion} onChange={e => handlePartidaChange(index, 'descripcion', e.target.value)} className="col-span-4 bg-[var(--bg-main)] p-1.5 border rounded-md text-sm" />
                            <input type="number" placeholder="Débito" value={partida.debito || ''} onChange={e => handlePartidaChange(index, 'debito', e.target.value)} className="col-span-2 bg-[var(--bg-main)] p-1.5 border rounded-md text-sm text-right" />
                            <input type="number" placeholder="Crédito" value={partida.credito || ''} onChange={e => handlePartidaChange(index, 'credito', e.target.value)} className="col-span-2 bg-[var(--bg-main)] p-1.5 border rounded-md text-sm text-right" />
                            <button onClick={() => removePartida(index)} className="col-span-1 text-red-500 hover:text-red-700 disabled:opacity-50" disabled={partidas.length <= 2}><TrashIcon /></button>
                        </div>
                    ))}
                </div>
                <button onClick={addPartida} className="text-sm text-[var(--secondary-green)] font-semibold hover:opacity-80">+ Añadir Partida</button>
            </div>

            <div className="flex justify-between items-center pt-4 font-bold text-lg flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                        {isBalanced ? 'Asiento Balanceado' : 'Asiento Desbalanceado'}
                    </div>
                    {!isBalanced && (
                        <div className="text-red-600 text-base font-medium">
                            Diferencia: {formatCurrency(Math.abs(totalDebito - totalCredito))}
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-x-8 text-right">
                    <span>{formatCurrency(totalDebito)}</span>
                    <span>{formatCurrency(totalCredito)}</span>
                </div>
            </div>


            <div className="mt-6 flex justify-end gap-3 flex-shrink-0">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg hover:opacity-80">Cancelar</button>
                <button onClick={handleSubmit} disabled={!isBalanced || !tipo} className="px-4 py-2 text-sm font-medium text-white bg-[var(--secondary-green)] rounded-lg hover:opacity-90 disabled:opacity-50">Guardar Asiento</button>
            </div>
        </div>
    );
};


export default Contabilidad;