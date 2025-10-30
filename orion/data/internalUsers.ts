

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
    tipoContrato?: string;
    '2fa'?: string;
    estadoCuenta?: string;
}

export const INTERNAL_USERS: OrionUser[] = [
    {
        id: 1,
        username: 'admin',
        password: 'admin',
        role: 'Administrator',
    }
];