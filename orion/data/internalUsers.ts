

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
    // FIX: Add missing optional property to the interface.
    fechaTerminacion?: string;
    tipoContrato?: string;
    '2fa'?: string;
    estadoCuenta?: string;
}

export const INTERNAL_USERS: OrionUser[] = [
    {
        id: 1,
        username: 'admin',
        password: 'admin',
        role: 'Administrador',
    },
    {
        id: 2,
        username: 'vendedor',
        password: 'vendedor',
        role: 'Vendedor/Administrativo',
    },
    {
        id: 3,
        username: 'almacen',
        password: 'almacen',
        role: 'Logistica/Almacen',
    },
    {
        id: 4,
        username: 'contabilidad',
        password: 'contabilidad',
        role: 'Contabilidad/Tesoreria',
    },
    {
        id: 5,
        username: 'coordinador',
        password: 'coordinador',
        role: 'Coordinador/Jefe',
    }
];