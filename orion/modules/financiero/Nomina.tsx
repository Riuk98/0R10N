import React, { useState, useEffect, useMemo, useRef } from 'react';
import { OrionUser } from '../../data/internalUsers';

// --- ICONS ---
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const NoveltyIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const ArrowIcon = (props: { isExpanded: boolean } & React.SVGProps<SVGSVGElement>) => (
    <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${props.isExpanded ? 'rotate-90' : ''}`}>
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);


// --- HELPER FUNCTIONS & CONSTANTS ---
const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
const ORION_USERS_STORAGE_KEY = 'orionInternalUsers';
const SALARIO_MINIMO = 1300000;
const AUXILIO_TRANSPORTE_MENSUAL = 162000;


const generatePayPeriods = () => {
    const periods = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11

    for (let i = 0; i < 3; i++) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const monthName = date.toLocaleString('es-ES', { month: 'long' });
        const year = date.getFullYear();
        periods.push({ value: `${year}-${date.getMonth()}-2`, label: `16-${new Date(year, date.getMonth() + 1, 0).getDate()} ${monthName} ${year}` });
        periods.push({ value: `${year}-${date.getMonth()}-1`, label: `1-15 ${monthName} ${year}` });
    }
    return periods;
};

const Nomina: React.FC = () => {
    const [allUsers, setAllUsers] = useState<OrionUser[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    
    // Modals states
    const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<OrionUser | null>(null);
    const [noveltyEmployee, setNoveltyEmployee] = useState<OrionUser | null>(null);

    const [payrollSummary, setPayrollSummary] = useState({ totalEmployees: 0, totalBase: 0, totalDeductions: 0, totalAdditionalDeductions: 0, totalNet: 0 });
    const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'success'>('idle');
    
    // Toast notification state
    const [toast, setToast] = useState<{ message: string; undoAction: () => void } | null>(null);
    const toastTimeoutRef = useRef<number | null>(null);


    useEffect(() => {
        try {
            const storedUsers = localStorage.getItem(ORION_USERS_STORAGE_KEY);
            setAllUsers(storedUsers ? JSON.parse(storedUsers) : []);
        } catch (error) {
            console.error("Failed to load users for payroll", error);
        }

        // Cleanup for toast timeout on component unmount
        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);
    
    const activeEmployees = useMemo(() => allUsers.filter(u => u.estadoCuenta === 'Activo' && u.salarioBase), [allUsers]);

    useEffect(() => {
        if (isSettleModalOpen) {
            const totalEmployees = activeEmployees.length;
            const totalBase = activeEmployees.reduce((sum, emp) => sum + (emp.salarioBase || 0), 0) / 2; // Bi-weekly
            const totalDeductions = totalBase * 0.08; // Simulate 8% deduction (health + pension)
            const totalAdditionalDeductions = activeEmployees.reduce((sum, emp) => sum + (emp.deduccionesAdicionales || 0), 0);
            const totalNet = totalBase - totalDeductions - totalAdditionalDeductions;
            setPayrollSummary({ totalEmployees, totalBase, totalDeductions, totalAdditionalDeductions, totalNet });
        }
    }, [isSettleModalOpen, activeEmployees]);

    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return allUsers;
        const lowercasedFilter = searchTerm.toLowerCase();
        return allUsers.filter(emp =>
            `${emp.nombre || ''} ${emp.apellidos || ''}`.toLowerCase().includes(lowercasedFilter) ||
            (emp.cedula || '').includes(lowercasedFilter)
        );
    }, [allUsers, searchTerm]);

    const updateEmployeeInStorage = (updatedUser: OrionUser) => {
        const updatedUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
        setAllUsers(updatedUsers);
        localStorage.setItem(ORION_USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    };

    const handleSettlePayroll = () => {
        setProcessingState('processing');
        setTimeout(() => {
            setProcessingState('success');
        }, 2000);
    };

    const closeSettleModal = () => {
        setIsSettleModalOpen(false);
        setTimeout(() => setProcessingState('idle'), 300);
    };

    const handleToggleStatus = (employee: OrionUser) => {
        const originalStatus = employee.estadoCuenta;
        const newStatus = originalStatus === 'Activo' ? 'Inactivo' : 'Activo';

        // Optimistically update UI
        updateEmployeeInStorage({ ...employee, estadoCuenta: newStatus });

        // Clear any existing toast timeout
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToast(null);

        // Set up undo action
        const undo = () => {
            updateEmployeeInStorage({ ...employee, estadoCuenta: originalStatus });
            setToast(null);
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };

        // Show toast notification with undo option
        setToast({
            message: `El estado de ${employee.nombre || employee.username} se ha cambiado a ${newStatus}.`,
            undoAction: undo,
        });

        // Set timeout to hide toast after 5 seconds
        toastTimeoutRef.current = window.setTimeout(() => {
            setToast(null);
        }, 5000);
    };
    
    const handleToggleRow = (employeeId: number) => {
        setExpandedRows(prev =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };
    
    // --- RENDER METHODS ---

    const renderSettleModalContent = () => {
        if (processingState === 'success') {
            return (
                <div className="text-center p-8">
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Nómina Procesada</h3>
                    <p className="text-[var(--text-secondary)] mt-2">La nómina para el período seleccionado se ha liquidado correctamente.</p>
                    <button onClick={closeSettleModal} className="mt-6 w-full bg-[var(--secondary-green)] text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition">Cerrar</button>
                </div>
            );
        }

        return (
            <>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Liquidar Nómina</h3>
                <div className="my-4">
                    <label htmlFor="pay-period" className="block text-sm font-medium text-[var(--text-secondary)]">Período de Pago</label>
                    <select id="pay-period" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-green)] sm:text-sm rounded-md bg-[var(--bg-main)] text-[var(--text-primary)]">
                        {generatePayPeriods().map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                </div>

                <div className="space-y-3 p-4 bg-[var(--bg-main)] rounded-lg border border-[var(--border-color)]">
                    <div className="flex justify-between items-center text-sm"><span className="text-[var(--text-secondary)]">Total Empleados Activos:</span><span className="font-semibold">{payrollSummary.totalEmployees}</span></div>
                    <div className="flex justify-between items-center"><span className="text-[var(--text-secondary)]">Salario Base Total:</span><span className="font-semibold">{formatCurrency(payrollSummary.totalBase)}</span></div>
                    <div className="flex justify-between items-center text-red-600"><span className="font-medium">Deducciones de Ley (Est.):</span><span className="font-semibold">-{formatCurrency(payrollSummary.totalDeductions)}</span></div>
                    <div className="flex justify-between items-center text-red-600"><span className="font-medium">Otras Deducciones:</span><span className="font-semibold">-{formatCurrency(payrollSummary.totalAdditionalDeductions)}</span></div>
                    <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-[var(--border-color)]"><span className="text-[var(--text-primary)]">Total Neto a Pagar:</span><span className="text-[var(--secondary-green)]">{formatCurrency(payrollSummary.totalNet)}</span></div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={closeSettleModal} className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg hover:opacity-80">Cancelar</button>
                    <button onClick={handleSettlePayroll} disabled={processingState === 'processing'} className="px-4 py-2 text-sm font-medium text-white bg-[var(--secondary-green)] rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait">
                        {processingState === 'processing' ? <><SpinnerIcon /> <span>Procesando...</span></> : 'Confirmar y Procesar'}
                    </button>
                </div>
            </>
        );
    };
    
    const renderDetailRow = (employee: OrionUser) => {
        const salarioBase = employee.salarioBase || 0;
        const salarioQuincenal = salarioBase / 2;
        const deduccionSalud = salarioQuincenal * 0.04;
        const deduccionPension = salarioQuincenal * 0.04;
        const auxilioTransporte = salarioBase <= (SALARIO_MINIMO * 2) ? (AUXILIO_TRANSPORTE_MENSUAL / 2) : 0;
        const deduccionesAdicionales = employee.deduccionesAdicionales || 0;
        const totalPagar = salarioQuincenal + auxilioTransporte - deduccionSalud - deduccionPension - deduccionesAdicionales;

        return (
             <div className="p-4 bg-[var(--bg-main)]/50 text-sm grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Ingresos */}
                <div className="space-y-2">
                    <h4 className="font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1 mb-2">Ingresos</h4>
                    <div className="flex justify-between"><span>Salario Quincenal:</span> <span>{formatCurrency(salarioQuincenal)}</span></div>
                    {auxilioTransporte > 0 && <div className="flex justify-between"><span>Auxilio de Transporte:</span> <span>{formatCurrency(auxilioTransporte)}</span></div>}
                </div>

                {/* Deducciones */}
                <div className="space-y-2">
                    <h4 className="font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1 mb-2">Deducciones</h4>
                    <div className="flex justify-between text-red-600"><span>Salud (4%):</span> <span>-{formatCurrency(deduccionSalud)}</span></div>
                    <div className="flex justify-between text-red-600"><span>Pensión (4%):</span> <span>-{formatCurrency(deduccionPension)}</span></div>
                    {deduccionesAdicionales > 0 && <div className="flex justify-between text-red-600"><span>Crédito Empleado:</span> <span>-{formatCurrency(deduccionesAdicionales)}</span></div>}
                </div>

                {/* Novedades y Total */}
                <div className="space-y-2">
                    <h4 className="font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1 mb-2">Novedades</h4>
                    {employee.novedades && employee.novedades.length > 0 ? (
                        employee.novedades.map((n, i) => (
                            <div key={i} className="text-xs">
                                <span className="font-semibold">{n.tipo}:</span> {n.descripcion} ({n.fechaInicio} - {n.fechaFin})
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-[var(--text-secondary)]">No hay novedades en este período.</p>
                    )}
                    <div className="flex justify-between font-bold text-base pt-2 mt-4 border-t border-[var(--border-color)]">
                        <span className="text-[var(--text-primary)]">Total a Pagar:</span>
                        <span className="text-[var(--secondary-green)]">{formatCurrency(totalPagar)}</span>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="p-4 space-y-4 h-full relative">
            <style>{`
                @keyframes fade-in-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
            {/* Header */}
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-bold">Gestión de Nómina</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Calcula y gestiona el pago de salarios y prestaciones.</p>
                </div>
                <button
                    onClick={() => setIsSettleModalOpen(true)}
                    className="mt-2 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--secondary-green)] hover:opacity-90">
                    Liquidar Nómina
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar empleado por nombre o cédula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-[var(--border-color)] rounded-md text-sm bg-[var(--bg-main)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--secondary-green)] outline-none"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="text-[var(--text-secondary)]" />
                </div>
            </div>

            {/* Employee Table */}
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-[var(--border-color)]">
                <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="text-xs uppercase bg-[var(--bg-main)] text-[var(--text-primary)]">
                        <tr>
                            <th scope="col" className="py-3 px-6">Empleado</th>
                            <th scope="col" className="py-3 px-6">Cargo</th>
                            <th scope="col" className="py-3 px-6">Salario Base</th>
                            <th scope="col" className="py-3 px-6">Estado</th>
                            <th scope="col" className="py-3 px-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(emp => (
                            <React.Fragment key={emp.id}>
                                <tr className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-main)]/50 ${emp.estadoCuenta === 'Inactivo' ? 'opacity-50' : ''}`}>
                                    <td className="py-4 px-6 font-medium text-[var(--text-primary)] capitalize">
                                        <div className="flex items-center gap-2">
                                             <button onClick={() => handleToggleRow(emp.id)} className="p-1 rounded-full hover:bg-[var(--border-color)]">
                                                <ArrowIcon isExpanded={expandedRows.includes(emp.id)} />
                                            </button>
                                            <span>{`${emp.nombre || ''} ${emp.apellidos || emp.username}`}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">{emp.role}</td>
                                    <td className="py-4 px-6">{formatCurrency(emp.salarioBase || 0)}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${emp.estadoCuenta === 'Activo' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
                                            {emp.estadoCuenta}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 flex items-center gap-3">
                                        <button onClick={() => setEditingEmployee(emp)} title="Editar" className="text-[var(--secondary-green)] hover:opacity-70"><EditIcon /></button>
                                        <button onClick={() => setNoveltyEmployee(emp)} title="Novedades" className="text-blue-600 hover:opacity-70"><NoveltyIcon /></button>
                                        <label title={`Cambiar estado a ${emp.estadoCuenta === 'Activo' ? 'Inactivo' : 'Activo'}`} className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={emp.estadoCuenta === 'Activo'} onChange={() => handleToggleStatus(emp)} className="sr-only peer" />
                                            <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--secondary-green)]"></div>
                                        </label>
                                    </td>
                                </tr>
                                {expandedRows.includes(emp.id) && (
                                    <tr className="border-b border-[var(--border-color)]">
                                        <td colSpan={5}>
                                            {renderDetailRow(emp)}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                         {filteredEmployees.length === 0 && (
                            <tr className="border-b border-[var(--border-color)]">
                                <td colSpan={5} className="py-8 px-6 text-center text-[var(--text-secondary)]">No se encontraron empleados.</td>
                            </tr>
                         )}
                    </tbody>
                </table>
            </div>
            
            {/* Toast Notification */}
            {toast && (
                <div className="absolute bottom-4 right-4 bg-[var(--primary-blue)] text-white py-2 px-4 rounded-lg shadow-lg flex items-center gap-3 z-10 animate-fade-in-up">
                    <span className="text-sm">{toast.message}</span>
                    <button
                        onClick={toast.undoAction}
                        className="text-sm font-bold underline hover:opacity-80 flex-shrink-0"
                    >
                        Deshacer
                    </button>
                </div>
            )}


            {/* Modals */}
            {isSettleModalOpen && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-[var(--bg-card)] rounded-lg shadow-xl p-6 w-full max-w-md">{renderSettleModalContent()}</div></div>}
            {editingEmployee && <EditEmployeeModal employee={editingEmployee} onSave={updateEmployeeInStorage} onClose={() => setEditingEmployee(null)} />}
            {noveltyEmployee && <NoveltyModal employee={noveltyEmployee} onSave={updateEmployeeInStorage} onClose={() => setNoveltyEmployee(null)} />}
        </div>
    );
};

// --- MODAL COMPONENTS ---

interface ModalProps {
    employee: OrionUser;
    onSave: (updatedUser: OrionUser) => void;
    onClose: () => void;
}

const EditEmployeeModal: React.FC<ModalProps> = ({ employee, onSave, onClose }) => {
    const [salarioBase, setSalarioBase] = useState(employee.salarioBase || 0);
    const [deduccionesAdicionales, setDeduccionesAdicionales] = useState(employee.deduccionesAdicionales || 0);

    const handleSave = () => {
        onSave({ ...employee, salarioBase, deduccionesAdicionales });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-card)] rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Editar Empleado: {employee.nombre}</h3>
                <div className="my-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)]">Salario Base Mensual</label>
                        <input type="number" value={salarioBase} onChange={e => setSalarioBase(parseFloat(e.target.value))} className="mt-1 block w-full p-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-main)]"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)]">Deducciones Adicionales (por quincena)</label>
                        <input type="number" value={deduccionesAdicionales} onChange={e => setDeduccionesAdicionales(parseFloat(e.target.value))} className="mt-1 block w-full p-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-main)]"/>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg hover:opacity-80">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-[var(--secondary-green)] rounded-lg hover:opacity-90">Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
};

const NoveltyModal: React.FC<ModalProps> = ({ employee, onSave, onClose }) => {
    const [novedades, setNovedades] = useState(employee.novedades || []);
    const [newNovelty, setNewNovelty] = useState({ tipo: 'Incapacidad', fechaInicio: '', fechaFin: '', descripcion: '' });

    const handleAddNovelty = () => {
        if (!newNovelty.fechaInicio || !newNovelty.fechaFin || !newNovelty.descripcion) {
            alert("Por favor complete todos los campos de la nueva novedad.");
            return;
        }
        const updatedNovedades = [...novedades, newNovelty as OrionUser['novedades'][0]];
        setNovedades(updatedNovedades);
        onSave({ ...employee, novedades: updatedNovedades });
        setNewNovelty({ tipo: 'Incapacidad', fechaInicio: '', fechaFin: '', descripcion: '' }); // Reset form
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-card)] rounded-lg shadow-xl p-6 w-full max-w-lg h-[90vh] flex flex-col">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Novedades de: {employee.nombre}</h3>
                
                <div className="my-4 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)]">
                    <h4 className="font-semibold mb-2">Añadir Nueva Novedad</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <label>Tipo</label>
                            <select value={newNovelty.tipo} onChange={e => setNewNovelty({...newNovelty, tipo: e.target.value})} className="w-full p-1 border border-[var(--border-color)] rounded bg-[var(--bg-main)]">
                                <option>Incapacidad</option>
                                <option>Vacaciones</option>
                                <option>Licencia</option>
                                <option>Otro</option>
                            </select>
                        </div>
                        <div>
                            <label>Descripción</label>
                            <input type="text" value={newNovelty.descripcion} onChange={e => setNewNovelty({...newNovelty, descripcion: e.target.value})} className="w-full p-1 border border-[var(--border-color)] rounded bg-[var(--bg-main)]" />
                        </div>
                         <div>
                            <label>Fecha Inicio</label>
                            <input type="date" value={newNovelty.fechaInicio} onChange={e => setNewNovelty({...newNovelty, fechaInicio: e.target.value})} className="w-full p-1 border border-[var(--border-color)] rounded bg-[var(--bg-main)]" />
                        </div>
                         <div>
                            <label>Fecha Fin</label>
                            <input type="date" value={newNovelty.fechaFin} onChange={e => setNewNovelty({...newNovelty, fechaFin: e.target.value})} className="w-full p-1 border border-[var(--border-color)] rounded bg-[var(--bg-main)]" />
                        </div>
                    </div>
                    <button onClick={handleAddNovelty} className="mt-3 w-full px-4 py-2 text-sm font-medium text-white bg-[var(--secondary-green)] rounded-lg hover:opacity-90">Añadir</button>
                </div>

                <h4 className="font-semibold mt-2 mb-2">Historial de Novedades</h4>
                <div className="flex-grow overflow-y-auto border border-[var(--border-color)] rounded-lg p-2 space-y-2">
                    {novedades.length > 0 ? novedades.map((n, i) => (
                        <div key={i} className="bg-[var(--bg-main)] p-3 rounded text-sm">
                            <p className="font-bold">{n.tipo}: <span className="font-normal">{n.descripcion}</span></p>
                            <p className="text-xs text-[var(--text-secondary)]">Del {n.fechaInicio} al {n.fechaFin}</p>
                        </div>
                    )) : <p className="text-sm text-center text-[var(--text-secondary)] p-4">No hay novedades registradas.</p>}
                </div>

                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg hover:opacity-80">Cerrar</button>
                </div>
            </div>
        </div>
    );
};


export default Nomina;