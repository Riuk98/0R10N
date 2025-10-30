import React from 'react';

const GestionUsuarios: React.FC = () => {
    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold">Gestión de Usuarios</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Crea, edita y gestiona los roles y permisos de los usuarios.</p>
                </div>
                 <button type="button" className="mt-2 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--secondary-green)] hover:opacity-90">
                    + Añadir Usuario
                </button>
            </div>
            
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-[var(--border-color)]">
                <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                    <thead className="text-xs uppercase bg-[var(--bg-main)] text-[var(--text-primary)]">
                        <tr>
                            <th scope="col" className="py-3 px-6">Nombre</th>
                            <th scope="col" className="py-3 px-6">Email</th>
                            <th scope="col" className="py-3 px-6">Rol</th>
                            <th scope="col" className="py-3 px-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-[var(--border-color)]">
                            <td className="py-4 px-6 font-medium text-[var(--text-primary)]">Martha Milena</td>
                            <td className="py-4 px-6">martha.milena@hatogrande.com</td>
                            <td className="py-4 px-6">Administrador</td>
                            <td className="py-4 px-6"><a href="#" className="font-medium text-[var(--secondary-green)] hover:opacity-80">Editar</a></td>
                        </tr>
                        <tr className="border-b border-[var(--border-color)]">
                            <td className="py-4 px-6 font-medium text-[var(--text-primary)]">Carlos Vélez</td>
                            <td className="py-4 px-6">carlos.velez@hatogrande.com</td>
                            <td className="py-4 px-6">Vendedor</td>
                             <td className="py-4 px-6"><a href="#" className="font-medium text-[var(--secondary-green)] hover:opacity-80">Editar</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionUsuarios;