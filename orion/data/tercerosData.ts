import { Tercero } from '../modules/comercial/ClientesCRM';

export const initialTerceros: Tercero[] = [
    // --- Clientes ---
    {
        id: '900.111.222-1',
        nit: '900.111.222-1',
        nombre: 'Cliente Fiel S.A.S.',
        direccion: 'Calle Falsa 123, Bogotá',
        telefono: '3109876543',
        email: 'compras@clientefiel.com',
        tipoPago: 'Crédito',
        tipo: 'Cliente',
        status: 'Activo'
    },
    {
        id: '800.333.444-5',
        nit: '800.333.444-5',
        nombre: 'Mercado El Ahorro',
        direccion: 'Avenida Siempre Viva 742, Medellín',
        telefono: '3201234567',
        email: 'gerencia@mercadoahorro.co',
        tipoPago: 'Contado',
        tipo: 'Cliente',
        status: 'Activo'
    },
    {
        id: '901.555.666-8',
        nit: '901.555.666-8',
        nombre: 'Distribuidora Láctea del Sur',
        direccion: 'Carrera 10 # 20-30, Cali',
        telefono: '3157654321',
        email: 'pedidos@distsur.com',
        tipoPago: 'Crédito',
        tipo: 'Cliente',
        status: 'Inactivo'
    },
    // --- Proveedores ---
    {
        id: '860.777.888-2',
        nit: '860.777.888-2',
        nombre: 'Agroinsumos La Finca',
        direccion: 'Vereda El Rosal, Suesca',
        telefono: '3112223333',
        email: 'ventas@agroinsumoslafinca.com',
        tipoPago: 'Contado',
        tipo: 'Proveedor',
        status: 'Activo'
    },
    {
        id: '900.999.000-3',
        nit: '900.999.000-3',
        nombre: 'Envases Plásticos de Colombia',
        direccion: 'Parque Industrial Celta, Funza',
        telefono: '3184445555',
        email: 'contacto@envaplast.co',
        tipoPago: 'Crédito',
        tipo: 'Proveedor',
        status: 'Activo'
    },
    {
        id: '830.121.314-6',
        nit: '830.121.314-6',
        nombre: 'Transportes Carga Segura',
        direccion: 'Km 5 Vía Siberia, Cota',
        telefono: '3146667777',
        email: 'logistica@cargasegura.com',
        tipoPago: 'Crédito',
        tipo: 'Proveedor',
        status: 'Inactivo'
    },
    // --- Ambos ---
    {
        id: '901.234.567-9',
        nit: '901.234.567-9',
        nombre: 'Comercializadora y Logística Integral',
        direccion: 'Zona Franca, Bogotá',
        telefono: '3178889999',
        email: 'operaciones@integral.com',
        tipoPago: 'Crédito',
        tipo: 'Ambos',
        status: 'Activo'
    },
    {
        id: '800.567.890-1',
        nit: '800.567.890-1',
        nombre: 'Servicios Generales El Progreso',
        direccion: 'Calle 100 # 10-20, Bogotá',
        telefono: '3190001111',
        email: 'admin@progreso.com.co',
        tipoPago: 'Contado',
        tipo: 'Ambos',
        status: 'Activo'
    }
];
