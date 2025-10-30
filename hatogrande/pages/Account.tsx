import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Account: React.FC = () => {
    const { currentUser, logout, navigateTo } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userData, setUserData] = useState(currentUser);

    React.useEffect(() => {
        if (!currentUser) {
            navigateTo('login');
        }
    }, [currentUser, navigateTo]);

    if (!currentUser) {
        return <div className="container mx-auto px-4 py-12 text-center"><p>Cargando...</p></div>;
    }
    
    const handleSave = () => {
        // Here you would typically make an API call to save the user data
        console.log("Saving data:", userData);
        setIsEditing(false);
    }
    
    const handleDeleteConfirm = () => {
        alert("Tu solicitud de eliminación ha sido procesada. Tienes 72 horas para cancelarla iniciando sesión nuevamente.");
        setShowDeleteModal(false);
        logout();
    }
    
    const renderSection = (title: string, children: React.ReactNode) => (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">{children}</div>
    );

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-[var(--color-text)]">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-[var(--color-dark)]">HOLA, {currentUser.firstName.toUpperCase()}</h1>
                <p className="mt-2">Administra y edita la información de tu perfil.</p>
            </div>

            {/* MIS DATOS PERSONALES */}
            {renderSection("MIS DATOS PERSONALES", (
                <>
                    {isEditing ? (
                        <div className="space-y-4">
                            <input value={userData?.firstName} onChange={(e) => setUserData(d => d ? {...d, firstName: e.target.value} : null)} className="w-full p-2 border rounded" placeholder="Nombre"/>
                            <input value={userData?.lastName} onChange={(e) => setUserData(d => d ? {...d, lastName: e.target.value} : null)} className="w-full p-2 border rounded" placeholder="Apellido"/>
                            <input value={userData?.phone} onChange={(e) => setUserData(d => d ? {...d, phone: e.target.value} : null)} className="w-full p-2 border rounded" placeholder="Teléfono"/>
                            <div className="flex gap-4">
                                <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">GUARDAR</button>
                                <button onClick={() => { setIsEditing(false); setUserData(currentUser); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancelar</button>
                            </div>
                        </div>
                    ) : (
                         <>
                            <p><strong>Nombre:</strong> {currentUser.firstName} {currentUser.lastName}</p>
                            <p><strong>Email:</strong> {currentUser.email}</p>
                            <p><strong>Teléfono:</strong> {currentUser.phone || 'No especificado'}</p>
                            <button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-dark)] font-semibold rounded hover:bg-[var(--color-accent)]">EDITAR</button>
                        </>
                    )}
                </>
            ))}

             {/* DIRECCIONES ALMACENADAS */}
             {renderSection("DIRECCIONES ALMACENADAS", (
                 <>
                    <p className="opacity-80">No tienes direcciones guardadas.</p>
                    <div className="flex gap-4 mt-4">
                        <button className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-dark)] font-semibold rounded hover:bg-[var(--color-accent)]">AGREGAR DIRECCIÓN</button>
                    </div>
                </>
             ))}
             
             {/* MIS PEDIDOS */}
              {renderSection("MIS PEDIDOS", (
                  <p className="opacity-80">No tienes pedidos recientes.</p>
              ))}
              
             {/* ELIMINAR PERFIL */}
              {renderSection("ELIMINAR PERFIL", (
                 <>
                    <p className="mb-4">Esta acción eliminará permanentemente tu perfil y todos tus datos asociados.</p>
                    <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700">ELIMINAR PERFIL</button>
                 </>
              ))}

            {showDeleteModal && (
                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4 text-[var(--color-dark)]">¿Estás seguro de eliminar tu perfil?</h3>
                        <p className="text-[var(--color-text)] mb-6">Esta acción no se puede deshacer. Tus datos se eliminarán permanentemente después de un periodo de 72 horas.</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                            <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Confirmar</button>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default Account;