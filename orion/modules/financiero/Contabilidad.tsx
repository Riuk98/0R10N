import React, { useState, useEffect, useMemo } from 'react';
import { AsientoContable, Partida, initialAsientos } from '../../data/contabilidadData';

// --- ICONS ---
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>);
const ArrowIcon = (props: { isExpanded: boolean } & React.SVGProps<SVGSVGElement>) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${props.isExpanded ? 'rotate-90' : ''}`}><polyline points="9 18 15 12 9 6"></polyline></svg>);

const ASIENTOS_STORAGE_KEY = 'orionAsientosContables';
const CONSECUTIVOS_STORAGE_KEY = 'orionContabilidadConsecutivos';
type TipoAsiento = 'Egresos' | 'Recibos de Caja' | 'Comprobante Contable';

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

const Contabilidad: React.FC = () => {
    const [asientos, setAsientos] = useState<AsientoContable[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedRows, setExpandedRows] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        try {
            const storedAsientos = localStorage.getItem(ASIENTOS_STORAGE_KEY);
            if (storedAsientos) {
                setAsientos(JSON.parse(storedAsientos));
            } else {
                setAsientos(initialAsientos);
                localStorage.setItem(ASIENTOS_STORAGE_KEY, JSON.stringify(initialAsientos));
            }

            // Initialize consecutive counters if they don't exist
            const storedConsecutivos = localStorage.getItem(CONSECUTIVOS_STORAGE_KEY);
            if (!storedConsecutivos) {
                 localStorage.setItem(CONSECUTIVOS_STORAGE_KEY, JSON.stringify({
                    'Egresos': 1,
                    'Recibos de Caja': 1,
                    'Comprobante Contable': 1
                }));
            }

        } catch (error) {
            console.error("Failed to load accounting entries", error);
            setAsientos(initialAsientos);
        }
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
                    asiento.partidas.some(p => p.cuenta.toLowerCase().includes(lowerSearch) || p.descripcion.toLowerCase().includes(lowerSearch))
                );
            })
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }, [asientos, searchTerm]);
    
    const handleAddAsiento = (newAsiento: AsientoContable) => {
        // Update asientos list
        const updatedAsientos = [...asientos, newAsiento];
        setAsientos(updatedAsientos);
        localStorage.setItem(ASIENTOS_STORAGE_KEY, JSON.stringify(updatedAsientos));

        // Update consecutive counter
        try {
            const storedConsecutivos = JSON.parse(localStorage.getItem(CONSECUTIVOS_STORAGE_KEY) || '{}');
            storedConsecutivos[newAsiento.tipo] = newAsiento.consecutivo;
            localStorage.setItem(CONSECUTIVOS_STORAGE_KEY, JSON.stringify(storedConsecutivos));
        } catch (error) {
            console.error("Failed to update consecutive counter", error);
        }
        
        setIsModalOpen(false);
    };

    const handleToggleRow = (asientoId: string) => {
        setExpandedRows(prev =>
            prev.includes(asientoId)
                ? prev.filter(id => id !== asientoId)
                : [...prev, asientoId]
        );
    };

    const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
            <div className="sm:flex sm:items-center sm:justify-between flex-shrink-0">
                <div>
                    <h3 className="text-lg font-bold">Contabilidad General</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Registro y consulta de asientos contables.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-2 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--secondary-green)] hover:opacity-90">
                    <PlusIcon className="mr-2" /> Nuevo Asiento
                </button>
            </div>

            <input
                type="text"
                placeholder="Buscar por concepto, tipo, consecutivo, cuenta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md text-sm bg-[var(--bg-main)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--secondary-green)] outline-none flex-shrink-0"
            />

            <div className="flex-grow overflow-auto border border-[var(--border-color)] rounded-lg shadow-md">
                <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="text-xs uppercase bg-[var(--bg-main)] text-[var(--text-primary)] sticky top-0">
                        <tr>
                            <th scope="col" className="py-3 px-6 w-12"></th>
                            <th scope="col" className="py-3 px-6">Fecha</th>
                            <th scope="col" className="py-3 px-6">Tipo</th>
                            <th scope="col" className="py-3 px-6">Consecutivo</th>
                            <th scope="col" className="py-3 px-6">Concepto</th>
                            <th scope="col" className="py-3 px-6 text-right">Total Débito</th>
                            <th scope="col" className="py-3 px-6 text-right">Total Crédito</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAsientos.map(asiento => {
                            const totalDebito = asiento.partidas.reduce((sum, p) => sum + p.debito, 0);
                            const totalCredito = asiento.partidas.reduce((sum, p) => sum + p.credito, 0);
                            const isExpanded = expandedRows.includes(asiento.id);
                            
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
                                        <td className="py-3 px-6 text-right">{formatCurrency(totalDebito)}</td>
                                        <td className="py-3 px-6 text-right">{formatCurrency(totalCredito)}</td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="bg-[var(--bg-main)]/30">
                                            <td colSpan={7} className="p-0">
                                                <div className="p-4">
                                                    <table className="w-full text-xs">
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
            
            {isModalOpen && <NuevoAsientoModal onClose={() => setIsModalOpen(false)} onSave={handleAddAsiento} />}
        </div>
    );
};

// --- Modal Component for New Entry ---
interface NuevoAsientoModalProps {
    onClose: () => void;
    onSave: (newAsiento: AsientoContable) => void;
}
const NuevoAsientoModal: React.FC<NuevoAsientoModalProps> = ({ onClose, onSave }) => {
    const [tipo, setTipo] = useState<TipoAsiento | ''>('');
    const [consecutivo, setConsecutivo] = useState<number>(0);
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [concepto, setConcepto] = useState('');
    const [partidas, setPartidas] = useState<Omit<Partida, 'id'>[]>([
        { cuenta: '', descripcion: '', debito: 0, credito: 0 },
        { cuenta: '', descripcion: '', debito: 0, credito: 0 },
    ]);

    useEffect(() => {
        if (tipo) {
            try {
                const storedConsecutivos = JSON.parse(localStorage.getItem(CONSECUTIVOS_STORAGE_KEY) || '{}');
                const nextConsecutivo = (storedConsecutivos[tipo] || 0) + 1;
                setConsecutivo(nextConsecutivo);
            } catch (error) {
                console.error("Failed to get next consecutive", error);
                setConsecutivo(1);
            }
        } else {
            setConsecutivo(0);
        }
    }, [tipo]);


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
        
        const newAsiento: AsientoContable = {
            id: `AS-${Date.now()}`,
            fecha,
            concepto,
            tipo,
            consecutivo,
            partidas: partidas.map((p, i) => ({ ...p, id: Date.now() + i })),
        };
        onSave(newAsiento);
    };

    const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-card)] rounded-lg shadow-xl p-6 w-full max-w-4xl h-[90vh] flex flex-col">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex-shrink-0">Crear Nuevo Asiento Contable</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 flex-shrink-0">
                    <div>
                        <label className="text-sm font-medium">Tipo de Asiento</label>
                        <select value={tipo} onChange={e => setTipo(e.target.value as TipoAsiento)} className="w-full bg-[var(--bg-main)] p-2 border rounded-md">
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
                    {partidas.map((partida, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2">
                            <input type="text" placeholder="Cuenta (e.g., 110505)" value={partida.cuenta} onChange={e => handlePartidaChange(index, 'cuenta', e.target.value)} className="col-span-3 bg-[var(--bg-main)] p-1.5 border rounded-md text-sm" />
                            <input type="text" placeholder="Descripción" value={partida.descripcion} onChange={e => handlePartidaChange(index, 'descripcion', e.target.value)} className="col-span-4 bg-[var(--bg-main)] p-1.5 border rounded-md text-sm" />
                            <input type="number" placeholder="Débito" value={partida.debito || ''} onChange={e => handlePartidaChange(index, 'debito', e.target.value)} className="col-span-2 bg-[var(--bg-main)] p-1.5 border rounded-md text-sm text-right" />
                            <input type="number" placeholder="Crédito" value={partida.credito || ''} onChange={e => handlePartidaChange(index, 'credito', e.target.value)} className="col-span-2 bg-[var(--bg-main)] p-1.5 border rounded-md text-sm text-right" />
                            <button onClick={() => removePartida(index)} className="col-span-1 text-red-500 hover:text-red-700 disabled:opacity-50" disabled={partidas.length <= 2}><TrashIcon /></button>
                        </div>
                    ))}
                    <button onClick={addPartida} className="text-sm text-[var(--secondary-green)] font-semibold hover:opacity-80">+ Añadir Partida</button>
                </div>

                <div className="flex justify-between items-center pt-4 font-bold text-lg flex-shrink-0">
                    <div className={`p-2 rounded ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                        {isBalanced ? 'Asiento Balanceado' : 'Asiento Desbalanceado'}
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
        </div>
    );
};

export default Contabilidad;