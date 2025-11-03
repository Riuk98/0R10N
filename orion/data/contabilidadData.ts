// orion/data/contabilidadData.ts

export interface Partida {
    id: number;
    cuenta: string;
    descripcion: string;
    debito: number;
    credito: number;
}

export interface AsientoContable {
    id: string; // e.g., 'AS-0001'
    fecha: string; // 'YYYY-MM-DD'
    concepto: string; // General concept of the transaction
    tipo: 'Egresos' | 'Recibos de Caja' | 'Comprobante Contable';
    consecutivo: number;
    partidas: Partida[];
}

export const initialAsientos: AsientoContable[] = [
    {
        id: 'AS-0001',
        fecha: '2024-07-23',
        concepto: 'Venta de contado de productos lácteos.',
        tipo: 'Recibos de Caja',
        consecutivo: 1,
        partidas: [
            { id: 1, cuenta: '110505 - Caja General', descripcion: 'Ingreso por venta', debito: 500000, credito: 0 },
            { id: 2, cuenta: '4135 - Ingresos por Venta', descripcion: 'Venta de mercancía', debito: 0, credito: 500000 },
        ]
    },
    {
        id: 'AS-0002',
        fecha: '2024-07-24',
        concepto: 'Compra de insumos a crédito a Insumos del Campo SAS',
        tipo: 'Comprobante Contable',
        consecutivo: 1,
        partidas: [
            { id: 1, cuenta: '1435 - Mercancías no fabricadas', descripcion: 'Compra de leche cruda', debito: 1200000, credito: 0 },
            { id: 2, cuenta: '2205 - Proveedores Nacionales', descripcion: 'Cta por pagar a Insumos del Campo', debito: 0, credito: 1200000 },
        ]
    },
    {
        id: 'AS-0003',
        fecha: '2024-07-25',
        concepto: 'Pago de servicios públicos (energía)',
        tipo: 'Egresos',
        consecutivo: 1,
        partidas: [
            { id: 1, cuenta: '5135 - Servicios Públicos', descripcion: 'Gasto energía mes de Julio', debito: 450000, credito: 0 },
            { id: 2, cuenta: '111005 - Bancos', descripcion: 'Salida de dinero de Bancolombia', debito: 0, credito: 450000 },
        ]
    }
];