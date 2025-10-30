
import React, { useState } from 'react';

interface ConfiguracionProps {
    visibleModules?: Record<string, boolean>;
    toggleModuleVisibility?: (moduleName: string) => void;
}

// Define types for user permissions
interface UserPermission {
    id: number;
    name: string;
    email: string;
    role: 'Administrador' | 'Vendedor' | 'Operario' | 'Solo Lectura';
}

// Define available roles
const ROLES: UserPermission['role'][] = ['Administrador', 'Vendedor', 'Operario', 'Solo Lectura'];

// FIX: Updated the default value for toggleModuleVisibility to match its type signature, which expects one argument.
const Configuracion: React.FC<ConfiguracionProps> = ({ visibleModules = {}, toggleModuleVisibility = (_moduleName: string) => {} }) => {
    // FIX: Moved the sort method here to create a sorted array once per render.
    const allModules = Object.keys(visibleModules).sort();

    // State for user permissions
    const [users, setUsers] = useState<UserPermission[]>([
        { id: 1, name: 'Martha Milena', email: 'martha.milena@hatogrande.com', role: 'Administrador' },
        { id: 2, name: 'Carlos Vélez', email: 'carlos.velez@hatogrande.com', role: 'Vendedor' },
        { id: 3, name: 'Ana María Rojas', email: 'ana.rojas@hatogrande.com', role: 'Operario' },
        { id: 4, name: 'Usuario Visitante', email: 'visitante@hatogrande.com', role: 'Solo Lectura' },
    ]);

    // Handler to change user role
    const handleRoleChange = (userId: number, newRole: UserPermission['role']) => {
        setUsers(currentUsers =>
            currentUsers.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            )
        );
    };
    
    const handleSaveChanges = () => {
        // In a real application, you would send the `users` state to your backend to persist the changes.
        // For this demo, we can just show an alert.
        alert('Permisos de usuario guardados (simulado).');
    };

    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Configuración del Sistema</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Ajusta los parámetros generales de la aplicación.</p>

            <div className="space-y-6">
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-[var(--text-primary)]">Nombre de la Empresa</label>
                    <input type="text" id="companyName" defaultValue="Hato Grande" className="mt-1 block w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--secondary-green)] focus:border-[var(--secondary-green)] sm:text-sm text-[var(--text-primary)]" />
                </div>
                <div>
                    <label htmlFor="defaultCurrency" className="block text-sm font-medium text-[var(--text-primary)]">Moneda por Defecto</label>
                    <select id="defaultCurrency" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-green)] focus:border-[var(--secondary-green)] sm:text-sm rounded-md bg-[var(--bg-main)] text-[var(--text-primary)]">
                        <option>COP - Peso Colombiano</option>
                        <option>USD - Dólar Americano</option>
                    </select>
                </div>
                <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                        <input id="maintenanceMode" type="checkbox" className="focus:ring-[var(--secondary-green)] h-4 w-4 text-[var(--secondary-green)] border-[var(--border-color)] rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="maintenanceMode" className="font-medium text-[var(--text-primary)]">Activar Modo Mantenimiento</label>
                        <p className="text-[var(--text-secondary)]">Los usuarios no podrán acceder al sistema.</p>
                    </div>
                </div>
                <button type="button" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--secondary-green)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary-green)]">
                    Guardar Cambios
                </button>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
                <h4 className="text-md font-bold mb-2 text-[var(--text-primary)]">Gestión de Visibilidad de Módulos</h4>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Activa o desactiva los módulos que estarán visibles en la barra lateral. Los cambios se guardan automáticamente.
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {allModules.map(moduleName => (
                        <div key={moduleName} className="flex items-center justify-between p-3 bg-[var(--bg-main)] rounded-md border border-[var(--border-color)]">
                            <span className="font-medium text-[var(--text-primary)]">{moduleName}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={visibleModules[moduleName] ?? true} 
                                    // FIX: The toggleModuleVisibility prop is optional. If not provided, the default function was used, which didn't expect arguments.
                                    // The function is now correctly called. The default value in the component definition has been updated to prevent type errors.
                                    onChange={() => toggleModuleVisibility(moduleName)}
                                    className="sr-only peer"
                                    aria-label={`Toggle visibility for ${moduleName}`}
                                />
                                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--secondary-green)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--secondary-green)]"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- NEW USER PERMISSIONS SECTION --- */}
            <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
                <h4 className="text-md font-bold mb-2 text-[var(--text-primary)]">Gestión de Permisos de Usuario</h4>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Asigna roles a los usuarios para controlar su acceso a los diferentes módulos y funcionalidades del sistema.
                </p>
                <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-[var(--border-color)]">
                    <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                        <thead className="text-xs uppercase bg-[var(--bg-main)] text-[var(--text-primary)]">
                            <tr>
                                <th scope="col" className="py-3 px-6">Nombre</th>
                                <th scope="col" className="py-3 px-6">Email</th>
                                <th scope="col" className="py-3 px-6">Rol Asignado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-main)]/50">
                                    <td className="py-4 px-6 font-medium text-[var(--text-primary)]">{user.name}</td>
                                    <td className="py-4 px-6">{user.email}</td>
                                    <td className="py-4 px-6">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserPermission['role'])}
                                            className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-lg focus:ring-[var(--secondary-green)] focus:border-[var(--secondary-green)] block w-full p-2.5"
                                            aria-label={`Rol para ${user.name}`}
                                        >
                                            {ROLES.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <button 
                    type="button" 
                    onClick={handleSaveChanges}
                    className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--secondary-green)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary-green)]">
                    Guardar Permisos
                </button>
            </div>
            {/* --- END NEW SECTION --- */}
        </div>
    );
};

export default Configuracion;
