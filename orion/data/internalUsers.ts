// orion/data/internalUsers.ts

export interface OrionUser {
    id: number;
    username: string;
    password: string; // In a real application, this should be a hash.
    role: string;
    // Optional extended properties
    nombre?: string;
    apellidos?: string;
    cedula?: string;
    correoPersonal?: string;
    celular?: string;
    fechaNacimiento?: string;
    direccion?: string;
    departamento?: string;
    supervisor?: string;
    fechaIngreso?: string;
    fechaTerminacion?: string;
    tipoContrato?: string;
    '2fa'?: string;
    estadoCuenta?: string;
    salarioBase?: number; // Added for payroll
    deduccionesAdicionales?: number; // Added for payroll edits
    novedades?: { // Added for payroll novelties
        tipo: 'Incapacidad' | 'Vacaciones' | 'Licencia' | 'Otro';
        fechaInicio: string;
        fechaFin: string;
        descripcion: string;
    }[];
}

export const INTERNAL_USERS: OrionUser[] = [
    {
        id: 1,
        username: 'admin',
        password: 'admin',
        role: 'Administrador',
        nombre: 'admin',
        apellidos: 'admin',
        salarioBase: 6000000,
        tipoContrato: 'Indefinido',
        estadoCuenta: 'Activo',
    },
    {
        id: 2,
        username: 'vendedor',
        password: 'vendedor',
        role: 'Vendedor/Administrativo',
        nombre: 'Carlos',
        apellidos: 'Ventas',
        salarioBase: 1800000,
        tipoContrato: 'Indefinido',
        estadoCuenta: 'Activo',
        deduccionesAdicionales: 50000, // For a bi-weekly credit
        novedades: [
            {
                tipo: 'Vacaciones',
                fechaInicio: '2024-07-01',
                fechaFin: '2024-07-08',
                descripcion: 'Vacaciones programadas'
            }
        ]
    },
    {
        id: 3,
        username: 'almacen',
        password: 'almacen',
        role: 'Logistica/Almacen',
        nombre: 'Juan',
        apellidos: 'Logistica',
        salarioBase: 1600000,
        tipoContrato: 'Indefinido',
        estadoCuenta: 'Activo',
    },
    {
        id: 4,
        username: 'contabilidad',
        password: 'contabilidad',
        role: 'Contabilidad/Tesoreria',
        nombre: 'Sofia',
        apellidos: 'Finanzas',
        salarioBase: 2500000,
        tipoContrato: 'Indefinido',
        estadoCuenta: 'Activo',
    },
    {
        id: 5,
        username: 'coordinador',
        password: 'coordinador',
        role: 'Coordinador/Jefe',
        nombre: 'Ana',
        apellidos: 'Rojas',
        salarioBase: 3500000,
        tipoContrato: 'Indefinido',
        estadoCuenta: 'Activo',
    }
];