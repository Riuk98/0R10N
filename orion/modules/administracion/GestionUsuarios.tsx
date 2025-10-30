import React from 'react';
import { OrionUser } from '../../data/internalUsers';

interface GestionUsuariosProps {
    users: OrionUser[];
}

const GestionUsuarios: React.FC<GestionUsuariosProps> = ({ users }) => {

    const handleAddUser = () => {
        window.dispatchEvent(new CustomEvent('createOrionWindow', {
            detail: { title: 'Registro de Usuario' }
        }));
    };

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold">Gestión de Usuarios</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Crea, edita y gestiona los roles y permisos de los usuarios.</p>
                </div>
                 <button 
                    type="button"
                    onClick={handleAddUser}
                    className="mt-2 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--secondary-green)] hover:opacity-90">
                    + Añadir Usuario
                </button>
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
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-[var(--border-color)]">
                                <td className="py-4 px-6 font-medium text-[var(--text-primary)] capitalize">{`${user.nombre || ''} ${user.apellidos || user.username}`}</td>
                                <td className="py-4 px-6">{user.username}</td>
                                <td className="py-4 px-6">{user.correoPersonal || `${user.username}@orion.system`}</td>
                                <td className="py-4 px-6">{user.role}</td>
                                <td className="py-4 px-6"><a href="#" className="font-medium text-[var(--secondary-green)] hover:opacity-80">Editar</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionUsuarios;