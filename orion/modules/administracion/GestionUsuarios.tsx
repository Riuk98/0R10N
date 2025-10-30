import React, { useState, useMemo } from 'react';
import { OrionUser } from '../../data/internalUsers';

interface GestionUsuariosProps {
    users: OrionUser[];
    permissions?: Record<string, boolean>;
    onDeleteSuccess: (userId: number) => void;
}

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);


const GestionUsuarios: React.FC<GestionUsuariosProps> = ({ users, permissions, onDeleteSuccess }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddUser = () => {
        window.dispatchEvent(new CustomEvent('createOrionWindow', {
            detail: { title: 'Registro de Usuario' }
        }));
    };

    const handleEditUser = (user: OrionUser) => {
        window.dispatchEvent(new CustomEvent('createOrionWindow', {
            detail: {
                title: 'Editar Usuario',
                props: { userToEdit: user }
            }
        }));
    };

    const filteredUsers = useMemo(() => {
        if (!searchTerm) {
            return users;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return users.filter(user => {
            const fullName = `${user.nombre || ''} ${user.apellidos || ''}`.toLowerCase();
            const email = (user.correoPersonal || '').toLowerCase();
            const username = user.username.toLowerCase();
            return fullName.includes(lowercasedFilter) || email.includes(lowercasedFilter) || username.includes(lowercasedFilter);
        });
    }, [users, searchTerm]);

    return (
        <div className="p-4">
            <div className="sm:flex sm:items-center sm:justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold">Gestión de Usuarios</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Crea, edita y gestiona los roles y permisos de los usuarios.</p>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-3 pr-10 py-2 w-full sm:w-64 border border-[var(--border-color)] rounded-md text-sm bg-[var(--bg-main)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--secondary-green)] outline-none"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <SearchIcon className="text-[var(--text-secondary)]"/>
                        </div>
                    </div>
                     <button 
                        type="button"
                        onClick={handleAddUser}
                        disabled={!permissions?.crear}
                        title={permissions?.crear ? 'Añadir nuevo usuario' : 'No tiene permisos para crear usuarios'}
                        className="inline-flex items-center justify-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--secondary-green)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                        + Añadir Usuario
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-[var(--border-color)]">
                <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="text-xs uppercase bg-[var(--bg-main)] text-[var(--text-primary)]">
                        <tr>
                            <th scope="col" className="py-3 px-6">Nombre Completo</th>
                            <th scope="col" className="py-3 px-6">Usuario</th>
                            <th scope="col" className="py-3 px-6">Email</th>
                            <th scope="col" className="py-3 px-6">Rol</th>
                            <th scope="col" className="py-3 px-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-[var(--border-color)]">
                                <td className="py-4 px-6 font-medium text-[var(--text-primary)] capitalize">{`${user.nombre || ''} ${user.apellidos || user.username}`}</td>
                                <td className="py-4 px-6">{user.username}</td>
                                <td className="py-4 px-6">{user.correoPersonal || `${user.username}@orion.system`}</td>
                                <td className="py-4 px-6">{user.role}</td>
                                <td className="py-4 px-6 flex items-center gap-4">
                                    <button onClick={() => handleEditUser(user)} disabled={!permissions?.actualizar} title={permissions?.actualizar ? 'Editar usuario' : 'No tiene permisos para editar'} className="font-medium text-[var(--secondary-green)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Editar
                                    </button>
                                    {user.id !== 1 && ( // Safeguard: prevent deleting the main admin
                                        <button onClick={() => onDeleteSuccess(user.id)} disabled={!permissions?.eliminar} title={permissions?.eliminar ? 'Eliminar usuario' : 'No tiene permisos para eliminar'} className="font-medium text-red-500 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed">
                                            Eliminar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionUsuarios;