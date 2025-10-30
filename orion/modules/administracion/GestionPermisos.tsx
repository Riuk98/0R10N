import React, { useState, useEffect } from 'react';

interface GestionPermisosProps {
    onClose?: () => void;
    visibleModules?: Record<string, boolean>;
    toggleModuleVisibility?: (moduleName: string) => void;
}

const modulos = [
    "Terceros", "Pedidos de venta", "Soporte", "Cuentas por cobrar", "Cuentas por pagar",
    "Contabilidad", "Nomina", "Inventario", "Compras", "Produccion",
    "Reportes y analiticas", "Gestion de usuarios", "Configuracion"
];

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
    "Configuracion": "Configuración"
};


const GestionPermisos: React.FC<GestionPermisosProps> = ({ onClose = () => {}, visibleModules = {}, toggleModuleVisibility = (_moduleName) => {} }) => {
    const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const loadPermissions = () => {
        try {
            const savedPermissions = JSON.parse(localStorage.getItem("permisosUsuarios") || '{}');
            setPermissions(savedPermissions);
        } catch (e) {
            console.error("Failed to load permissions from localStorage", e);
            setPermissions({});
        }
    };

    useEffect(() => {
        loadPermissions();
    }, []);

    const handleToggle = (modulo: string, permiso: string) => {
        setPermissions(prev => {
            const newPermissions = JSON.parse(JSON.stringify(prev)); // Deep copy to avoid state mutation issues
            if (!newPermissions[modulo]) {
                newPermissions[modulo] = {};
            }
            newPermissions[modulo][permiso] = !newPermissions[modulo][permiso];
            return newPermissions;
        });
    };

    const isChecked = (modulo: string, permiso: string) => {
        return permissions[modulo]?.[permiso] || false;
    };

    const handleSave = () => {
        localStorage.setItem("permisosUsuarios", JSON.stringify(permissions));
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
                .permissions-container h2 {
                  text-align: left;
                  color: var(--text-primary);
                  margin-bottom: 20px;
                  flex-shrink: 0;
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
                <h2>Permisos Roles de Usuario</h2>
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
                            {modulos.map((modulo, i) => {
                                const mappedModuleName = moduleNameMapping[modulo];
                                return (
                                <tr key={modulo}>
                                    <td>{i + 1}</td>
                                    <td>{modulo}</td>
                                    <td>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={visibleModules[mappedModuleName] ?? true}
                                                onChange={() => toggleModuleVisibility(mappedModuleName)}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                    {["crear", "actualizar", "eliminar"].map(permiso => (
                                        <td key={permiso}>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked(modulo, permiso)}
                                                    onChange={() => handleToggle(modulo, permiso)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            )})}
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
