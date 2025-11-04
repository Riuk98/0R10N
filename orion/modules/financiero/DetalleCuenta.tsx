import React, { useMemo } from 'react';
import { Tercero } from '../comercial/ClientesCRM';
import { OrdenCompra } from '../operaciones/Compras';
import { AsientoContable } from './Contabilidad';

// --- TYPE DEFINITIONS (Copied for modularity) ---
interface CuentaPorCobrar {
    id: string; facturaId: string; clienteNit: string; clienteNombre: string;
    clienteTelefono: string; ciudad: string; fechaEmision: string;
    fechaVencimiento: string; valorFactura: number; saldo: number;
}
interface CuentaPorPagar {
    id: string; ordenCompraId: string; proveedorId: string; proveedorNombre: string;
    fechaRecepcion: string; fechaVencimiento: string; valorTotal: number; saldo: number;
}
interface Factura {
    id: string; orderId: string; fecha: string; clienteNombre: string; clienteNit: string;
    items: any[]; subtotal: number; descuento: number; iva: number; retencion: number; total: number;
}
type TipoAsiento = 'Egresos' | 'Recibos de Caja' | 'Comprobante Contable';

// --- PROPS INTERFACE ---
interface DetalleCuentaProps {
    cuenta: CuentaPorCobrar | CuentaPorPagar;
    tipo: 'cobrar' | 'pagar';
    terceros: Tercero[];
    orionFacturas: Factura[];
    orionOrdenesCompra: OrdenCompra[];
    orionAsientosContables: AsientoContable[];
}

// --- ICONS ---
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const DocIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;
const MoneyIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const HistoryIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;


// --- HELPER COMPONENTS & FUNCTIONS ---
const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
const tipoAsientoPrefix: Record<TipoAsiento, string> = { 'Egresos': 'EG', 'Recibos de Caja': 'RC', 'Comprobante Contable': 'CT' };
const formatConsecutivo = (tipo: TipoAsiento, numero: number) => `${tipoAsientoPrefix[tipo]} - ${String(numero).padStart(3, '0')}`;

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
    <div className="bg-[var(--bg-main)]/50 border border-[var(--border-color)] rounded-lg p-4">
        <h4 className="font-bold text-md mb-3 flex items-center gap-2 text-[var(--secondary-green)]">
            {icon} {title}
        </h4>
        <div className="space-y-2 text-sm">{children}</div>
    </div>
);

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <span className="font-semibold text-[var(--text-secondary)]">{label}:</span>
        <span className="ml-2">{value || 'N/A'}</span>
    </div>
);

// --- MAIN COMPONENT ---
const DetalleCuenta: React.FC<DetalleCuentaProps> = ({ cuenta, tipo, terceros, orionFacturas, orionOrdenesCompra, orionAsientosContables }) => {

    const { tercero, documentoOriginal, historialPagos, saldoActual, valorOriginal } = useMemo(() => {
        const cxc = tipo === 'cobrar' ? (cuenta as CuentaPorCobrar) : null;
        const cxp = tipo === 'pagar' ? (cuenta as CuentaPorPagar) : null;

        const terceroId = cxc ? cxc.clienteNit : cxp?.proveedorId;
        const tercero = terceros.find(t => t.nit === terceroId);
        
        const documentoOriginal = tipo === 'cobrar'
            ? orionFacturas.find(f => f.id === cxc?.facturaId)
            : orionOrdenesCompra.find(oc => oc.id === cxp?.ordenCompraId);

        const docId = cxc ? cxc.facturaId : cxp?.ordenCompraId;
        const pagos = orionAsientosContables
            .flatMap(asiento => {
                const partidaRelevante = asiento.partidas.find(p => {
                    if (!p.descripcion.includes(docId)) return false;
                    return (tipo === 'cobrar' && asiento.tipo === 'Recibos de Caja' && p.cuenta === '130505') ||
                           (tipo === 'pagar' && asiento.tipo === 'Egresos' && p.cuenta === '2205');
                });

                if (partidaRelevante) {
                    return [{
                        fecha: asiento.fecha,
                        documento: formatConsecutivo(asiento.tipo, asiento.consecutivo),
                        monto: tipo === 'cobrar' ? partidaRelevante.credito : partidaRelevante.debito,
                    }];
                }
                return [];
            })
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        return {
            tercero,
            documentoOriginal,
            historialPagos: pagos,
            saldoActual: cxc ? cxc.saldo : cxp?.saldo || 0,
            valorOriginal: cxc ? cxc.valorFactura : cxp?.valorTotal || 0,
        };
    }, [cuenta, tipo, terceros, orionFacturas, orionOrdenesCompra, orionAsientosContables]);

    const historialModificaciones = [
        { fecha: '2024-08-01', usuario: 'Sofia Finanzas', accion: 'Se registró abono por $500,000.' },
        { fecha: '2024-07-20', usuario: 'Sistema', accion: 'Se generó la cuenta por mora de 1 día.' },
        { fecha: '2024-07-15', usuario: 'Carlos Ventas', accion: 'Creación de la cuenta a partir de la factura.' }
    ];

    const docId = tipo === 'cobrar' ? (cuenta as CuentaPorCobrar).facturaId : (cuenta as CuentaPorPagar).ordenCompraId;

    return (
        <div className="p-4 h-full flex flex-col overflow-y-auto text-sm">
            <h3 className="text-lg font-bold mb-1">Detalle de Cuenta: {cuenta.id}</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Documento Origen: {docId}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <InfoCard title="Información del Tercero" icon={<UserIcon className="w-5 h-5"/>}>
                    <DetailItem label="Nombre" value={tercero?.nombre} />
                    <DetailItem label="NIT" value={tercero?.nit} />
                    <DetailItem label="Teléfono" value={tercero?.telefono} />
                    <DetailItem label="Email" value={tercero?.email} />
                    <DetailItem label="Dirección" value={tercero?.direccion} />
                </InfoCard>

                <InfoCard title="Detalles del Documento" icon={<DocIcon className="w-5 h-5"/>}>
                    <DetailItem label="Fecha Emisión" value={formatDate(tipo === 'cobrar' ? (cuenta as CuentaPorCobrar).fechaEmision : (documentoOriginal as OrdenCompra)?.fechaEmision || '')} />
                    <DetailItem label="Fecha Vencimiento" value={formatDate(cuenta.fechaVencimiento)} />
                    <DetailItem label="Creado por" value={documentoOriginal?.creadoPor || 'N/A'} />
                    <DetailItem label="Observaciones" value={documentoOriginal?.observaciones || 'Sin observaciones.'} />
                    {tipo === 'cobrar' && <DetailItem label="Impuestos (IVA)" value={formatCurrency((documentoOriginal as Factura)?.iva || 0)} />}
                </InfoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-100/50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <p className="font-semibold text-blue-800 dark:text-blue-200">Valor Original</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(valorOriginal)}</p>
                </div>
                 <div className="bg-green-100/50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                    <p className="font-semibold text-green-800 dark:text-green-200">Total Abonado</p>
                    <p className="text-xl font-bold text-green-900 dark:text-green-100">{formatCurrency(valorOriginal - saldoActual)}</p>
                </div>
                 <div className="bg-red-100/50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                    <p className="font-semibold text-red-800 dark:text-red-200">Saldo Pendiente</p>
                    <p className="text-xl font-bold text-red-900 dark:text-red-100">{formatCurrency(saldoActual)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <InfoCard title="Historial de Abonos / Pagos" icon={<MoneyIcon className="w-5 h-5"/>}>
                    <div className="max-h-48 overflow-y-auto">
                        {historialPagos.length > 0 ? (
                            <table className="w-full text-xs">
                                <thead><tr className="font-bold border-b border-[var(--border-color)]"><td className="py-1">Fecha</td><td className="py-1">Documento</td><td className="py-1 text-right">Monto</td></tr></thead>
                                <tbody>
                                    {historialPagos.map((pago, i) => (
                                        <tr key={i}><td className="py-1">{formatDate(pago.fecha)}</td><td className="py-1">{pago.documento}</td><td className="py-1 text-right">{formatCurrency(pago.monto)}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p className="text-center text-[var(--text-secondary)] p-4">No se han registrado pagos.</p>}
                    </div>
                </InfoCard>
                <InfoCard title="Historial de Modificaciones" icon={<HistoryIcon className="w-5 h-5"/>}>
                     <div className="max-h-48 overflow-y-auto">
                        <ul className="space-y-3 text-xs">
                            {historialModificaciones.map((mod, i) => (
                                <li key={i} className="border-l-2 border-[var(--secondary-green)] pl-3">
                                    <p className="font-semibold">{mod.accion}</p>
                                    <p className="text-[var(--text-secondary)]">{formatDate(mod.fecha)} por {mod.usuario}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </InfoCard>
            </div>
        </div>
    );
};

export default DetalleCuenta;
