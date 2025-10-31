// orion/data/permissions.ts

export const modulos = [
    "Terceros", "Pedidos de venta", "Soporte", "Cuentas por cobrar", "Cuentas por pagar",
    "Contabilidad", "Nomina", "Inventario", "Compras", "Produccion",
    "Reportes y analiticas", "Gestion de usuarios", "Configuracion"
];

export const roles = [
    "Administrador",
    "Vendedor/Administrativo",
    "Logistica/Almacen",
    "Contabilidad/Tesoreria",
    "Coordinador/Jefe"
];

const fullAccess = {
    ver: true,
    crear: true,
    actualizar: true,
    eliminar: true,
};

const noAccess = {
    ver: false,
    crear: false,
    actualizar: false,
    eliminar: false,
};

const readOnly = {
    ver: true,
    crear: false,
    actualizar: false,
    eliminar: false,
};

const generatePermissions = (overrides: Record<string, any>) => {
    const permissions: Record<string, any> = {};
    modulos.forEach(module => {
        permissions[module] = overrides[module] || noAccess;
    });
    return permissions;
};

export const defaultPermissionsByRole: Record<string, Record<string, Record<string, boolean>>> = {
    "Administrador": generatePermissions(
        Object.fromEntries(modulos.map(m => [m, fullAccess]))
    ),
    "Vendedor/Administrativo": generatePermissions({
        "Pedidos de venta": { ver: true, crear: true, actualizar: true, eliminar: false },
        "Terceros": { ver: true, crear: true, actualizar: true, eliminar: false },
        "Inventario": readOnly,
        "Soporte": { ver: true, crear: true, actualizar: true, eliminar: false },
    }),
    "Logistica/Almacen": generatePermissions({
        "Compras": { ver: true, crear: true, actualizar: true, eliminar: false },
        "Inventario": { ver: true, crear: true, actualizar: true, eliminar: false },
        "Produccion": { ver: true, crear: true, actualizar: true, eliminar: false },
        "Pedidos de venta": { ver: true, crear: false, actualizar: true, eliminar: false },
        "Reportes y analiticas": readOnly,
    }),
    "Contabilidad/Tesoreria": generatePermissions({
        "Contabilidad": { ver: true, crear: true, actualizar: true, eliminar: false },
        "Cuentas por cobrar": { ver: true, crear: true, actualizar: true, eliminar: false },
        "Cuentas por pagar": { ver: true, crear: true, actualizar: true, eliminar: false },
        "Nomina": { ver: true, crear: true, actualizar: true, eliminar: false },
        "Terceros": { ver: true, crear: true, actualizar: true, eliminar: false },
        "Reportes y analiticas": readOnly,
        "Pedidos de venta": readOnly,
    }),
    "Coordinador/Jefe": generatePermissions({
        ...Object.fromEntries(modulos.map(m => [m, readOnly])), // Start with read-only for all
        "Reportes y analiticas": fullAccess,
        "Terceros": { ver: true, crear: false, actualizar: true, eliminar: false },
        "Gestion de usuarios": { ver: true, crear: true, actualizar: true, eliminar: true },
        "Pedidos de venta": { ver: true, crear: false, actualizar: true, eliminar: false },
        "Compras": { ver: true, crear: false, actualizar: true, eliminar: false },
        "Produccion": { ver: true, crear: false, actualizar: true, eliminar: false },
    }),
};
