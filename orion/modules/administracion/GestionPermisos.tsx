import React, { useState, useEffect } from 'react';
import { modulos, defaultPermissionsByRole, roles } from '../../data/permissions';

interface GestionPermisosProps {
    onClose?: () => void;
}

const moduleNameMapping: { [key: string]: string } = {
    "Terceros": "Terceros (CRM)",
    "Pedidos de venta": "Pedidos de Venta",
    "Soporte": "Soporte (PQR)",
    "Cuentas por cobrar": "Cuentas por Cobrar",
    "Cuentas por pagar": "Cuentas por Pagar",
    "Contabilidad": "Contabilidad",
    "Nomina": "Nómina",
    "Inventario": "Inventario",
    "Compras": "Compras",
    "Produccion": "Producción",
    "Reportes y analiticas": "Reportes y Analíticas",
    "Gestion de usuarios": "Gestión de Usuarios",
    "Configuracion": "Configuración",
    "Gestion de permisos": "Gestión de Permisos"
};

const PERMISSIONS_STORAGE_KEY = 'permisosPorRol';

const GestionPermisos: React.FC<GestionPermisosProps> = ({ onClose = () => {} }) => {
    const [permissionsByRole, setPermissionsByRole] = useState<Record<string, Record<string, Record<string, boolean>>>>({});
    const [selectedRole, setSelectedRole] = useState(roles[0]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        const loadPermissions = () => {
            try {
                const savedPermissions = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
                if (savedPermissions) {
                    setPermissionsByRole(JSON.parse(savedPermissions));
                } else {
                    setPermissionsByRole(defaultPermissionsByRole);
                }
            } catch (e) {
                console.error("Failed to load permissions from localStorage", e);
                setPermissionsByRole(defaultPermissionsByRole);
            }
        };
        loadPermissions();
    }, []);

    const handleToggle = (modulo: string, permiso: string) => {
        setPermissionsByRole(prev => {
            const newPermissions = JSON.parse(JSON.stringify(prev));
            if (!newPermissions[selectedRole]) {
                newPermissions[selectedRole] = {};
            }
            if (!newPermissions[selectedRole][modulo]) {
                newPermissions[selectedRole][modulo] = {};
            }
            newPermissions[selectedRole][modulo][permiso] = !newPermissions[selectedRole][modulo][permiso];
            return newPermissions;
        });
    };

    const isChecked = (modulo: string, permiso: string) => {
        return permissionsByRole[selectedRole]?.[modulo]?.[permiso] || false;
    };

    const handleSave = () => {
        localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(permissionsByRole));
        window.dispatchEvent(new Event("storage")); // Notify other tabs/windows of the change
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 2000);
    };

    return (
        <>
            <style>{`
                .permissions-container {
                  font-family: Arial, sans-serif;
                  background-color: var(--bg-card);
                  color: var(--text-primary);
                  padding: 20px 40px;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                }
                .permissions-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 20px;
                  flex-shrink: 0;
                }
                .permissions-container h2 {
                  color: var(--text-primary);
                }
                .permissions-table-wrapper {
                    flex-grow: 1;
                    overflow-y: auto;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                }
                .permissions-container table {
                  width: 100%;
                  border-collapse: collapse;
                }
                .permissions-container th, .permissions-container td {
                  border: 1px solid var(--border-color);
                  text-align: center;
                  padding: 10px;
                }
                .permissions-container th {
                  background-color: var(--bg-main);
                  position: sticky;
                  top: 0;
                  z-index: 1;
                }
                .permissions-container .switch {
                  position: relative;
                  display: inline-block;
                  width: 50px;
                  height: 24px;
                }
                .permissions-container .switch input {
                  opacity: 0;
                  width: 0;
                  height: 0;
                }
                .permissions-container .slider {
                  position: absolute;
                  cursor: pointer;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: #ccc;
                  transition: .3s;
                  border-radius: 24px;
                }
                .permissions-container .slider:before {
                  position: absolute;
                  content: "";
                  height: 18px;
                  width: 18px;
                  left: 3px;
                  bottom: 3px;
                  background-color: white;
                  transition: .3s;
                  border-radius: 50%;
                }
                .permissions-container input:checked + .slider {
                  background-color: var(--secondary-green);
                }
                .permissions-container input:checked + .slider:before {
                  transform: translateX(26px);
                }
                .permissions-container .buttons {
                  margin-top: 20px;
                  text-align: center;
                  flex-shrink: 0;
                }
                .permissions-container .btn {
                  padding: 10px 20px;
                  border: none;
                  color: white;
                  font-size: 16px;
                  border-radius: 5px;
                  cursor: pointer;
                  margin: 5px;
                }
                .permissions-container .btn-success {
                  background-color: var(--secondary-green);
                }
                .permissions-container .btn-success:hover {
                    opacity: 0.9;
                }
                .permissions-container .btn-danger {
                  background-color: #dc3545;
                }
                .permissions-container .btn-danger:hover {
                  background-color: #c82333;
                }
                .permissions-container .alert {
                  text-align: center;
                  color: #28a745;
                  font-weight: bold;
                  margin-top: 15px;
                }
            `}</style>
            <div className="permissions-container">
                <div className="permissions-header">
                    <h2>Permisos Roles de Usuario</h2>
                    <div>
                        <label htmlFor="role-select" className="mr-2 font-semibold">Seleccionar Rol:</label>
                        <select
                            id="role-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="p-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-main)] text-[var(--text-primary)]"
                        >
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="permissions-table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Módulo</th>
                                <th>Ver</th>
                                <th>Crear</th>
                                <th>Actualizar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modulos.map((modulo, i) => (
                                <tr key={modulo}>
                                    <td>{i + 1}</td>
                                    <td>{moduleNameMapping[modulo] || modulo}</td>
                                    {["ver", "crear", "actualizar", "eliminar"].map(permiso => (
                                        <td key={permiso}>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked(modulo, permiso)}
                                                    onChange={() => handleToggle(modulo, permiso)}
                                                    disabled={selectedRole === 'Administrador'}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="buttons">
                    <button className="btn btn-success" onClick={handleSave}>Guardar</button>
                    <button className="btn btn-danger" onClick={onClose}>Salir</button>
                </div>
                 {showSuccessAlert && <div className="alert" style={{ display: 'block' }}>✅ Permisos guardados correctamente</div>}
            </div>
        </>
    );
};

export default GestionPermisos;
