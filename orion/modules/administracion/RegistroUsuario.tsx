import React, { useState, useEffect } from 'react';
import { OrionUser } from '../../data/internalUsers';
import { roles } from '../../data/permissions';

interface RegistroUsuarioProps {
    onRegisterSuccess?: (newUser: OrionUser) => void;
    onUpdateSuccess?: (updatedUser: OrionUser) => void;
    onClose: () => void;
    userToEdit?: OrionUser;
    permissions?: Record<string, boolean>;
}

// --- ICONS ---
const SuccessIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PadlockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);


const RegistroUsuario: React.FC<RegistroUsuarioProps> = ({ onRegisterSuccess, onUpdateSuccess, onClose, userToEdit, permissions }) => {
    const isEditMode = !!userToEdit;
    const canSubmit = isEditMode ? permissions?.actualizar : permissions?.crear;

    const initialFormData = {
        nombre: '',
        apellidos: '',
        cedula: '',
        correoPersonal: '',
        celular: '',
        fechaNacimiento: '',
        direccion: '',
        rol: '',
        departamento: '',
        supervisor: '',
        fechaIngreso: '',
        tipoContrato: '',
        usuario: '',
        password: '',
        confirmarPassword: '',
        '2fa': 'no',
        estadoCuenta: 'Activo',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState<any>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedUsername, setSubmittedUsername] = useState('');

    useEffect(() => {
        if (isEditMode && userToEdit) {
            setFormData({
                ...initialFormData,
                ...userToEdit,
                usuario: userToEdit.username,
                confirmarPassword: userToEdit.password,
            });
        }
    }, [isEditMode, userToEdit]);


    useEffect(() => {
        if (isEditMode) return; // Don't regenerate username in edit mode

        const generateUsername = () => {
            const nombre = formData.nombre.trim().toLowerCase();
            const apellidos = formData.apellidos.trim().toLowerCase();
            const cedula = formData.cedula.trim();

            if (nombre && apellidos && cedula.length >= 4) {
                const firstInitial = nombre.charAt(0);
                const firstLastName = apellidos.split(' ')[0];
                const lastCedulaDigits = cedula.slice(-4);
                
                const newUsername = `${firstInitial}${firstLastName}${lastCedulaDigits}`.replace(/\s/g, '');
                
                setFormData(prev => ({...prev, usuario: newUsername}));
            } else {
                setFormData(prev => ({...prev, usuario: ''}));
            }
        };
        generateUsername();
    }, [formData.nombre, formData.apellidos, formData.cedula, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, '2fa': e.target.value }));
    }

    const validate = () => {
        const newErrors: any = {};
        if (!formData.nombre) newErrors.nombre = 'Nombre es requerido.';
        if (!formData.apellidos) newErrors.apellidos = 'Apellidos son requeridos.';
        if (!formData.cedula) newErrors.cedula = 'Cédula es requerida.';
        if (!formData.correoPersonal) newErrors.correoPersonal = 'Correo es requerido.';
        if (!formData.rol) newErrors.rol = 'Rol es requerido.';
        if (!formData.usuario) newErrors.usuario = 'Usuario no se pudo generar. Verifique Nombre, Apellidos y Cédula.';
        if (!formData.password) newErrors.password = 'Contraseña es requerida.';
        if (formData.password !== formData.confirmarPassword) {
            newErrors.confirmarPassword = 'Las contraseñas no coinciden.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setSubmittedUsername(formData.usuario);
            if (isEditMode && onUpdateSuccess && userToEdit) {
                const updatedUser: OrionUser = {
                    ...userToEdit,
                    ...formData,
                };
                onUpdateSuccess(updatedUser);
                setIsSubmitted(true); // Show success screen on update as well
            } else if (onRegisterSuccess) {
                 const newUser: OrionUser = {
                    id: Date.now(),
                    username: formData.usuario,
                    password: formData.password,
                    role: formData.rol,
                    nombre: formData.nombre,
                    apellidos: formData.apellidos,
                    cedula: formData.cedula,
                    correoPersonal: formData.correoPersonal,
                    celular: formData.celular,
                    fechaNacimiento: formData.fechaNacimiento,
                    direccion: formData.direccion,
                    departamento: formData.departamento,
                    supervisor: formData.supervisor,
                    fechaIngreso: formData.fechaIngreso,
                    tipoContrato: formData.tipoContrato,
                    '2fa': formData['2fa'],
                    estadoCuenta: formData.estadoCuenta,
                };
                onRegisterSuccess(newUser);
                setIsSubmitted(true);
            }
        }
    };
    
    const handleRegisterAnother = () => {
        setFormData(initialFormData);
        setErrors({});
        setSubmittedUsername('');
        setIsSubmitted(false);
    };

    const handleOpenPermissions = () => {
        window.dispatchEvent(new CustomEvent('createOrionWindow', {
            detail: { title: 'Gestión de Permisos' }
        }));
    };

    if (isSubmitted) {
        return (
            <div className="p-4 bg-[var(--bg-card)] text-[var(--text-primary)] h-full flex flex-col items-center justify-center">
                 <SuccessIcon className="w-24 h-24 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-[var(--secondary-green)]">
                    {isEditMode ? '¡Actualización Exitosa!' : '¡Registro Exitoso!'}
                </h3>
                <p className="mt-2 text-[var(--text-primary)] text-center">
                    {isEditMode ? 'Los datos del usuario' : 'El usuario'} <strong>{submittedUsername}</strong> {isEditMode ? 'han sido actualizados correctamente.' : 'ha sido creado correctamente.'}
                </p>
                <div className="mt-8 flex gap-4">
                    {!isEditMode && (
                        <button 
                            onClick={handleRegisterAnother} 
                            className="px-6 py-2 bg-[var(--secondary-green)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
                            Registrar Otro Usuario
                        </button>
                    )}
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-[var(--bg-main)] text-[var(--text-primary)] font-semibold rounded-lg hover:opacity-80 transition-opacity border border-[var(--border-color)]">
                        Cerrar
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="p-4 bg-[var(--bg-card)] text-[var(--text-primary)] h-full flex flex-col">
            <style>{`
                .form-container-erp { 
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .form-container-erp h2 { text-align: center; color: var(--text-primary); margin-bottom: 25px; flex-shrink: 0; }
                .form-container-erp form {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }
                .form-content-grid {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding-right: 10px; /* Space for scrollbar */
                }
                .form-container-erp fieldset { border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 20px; padding: 20px; }
                .form-container-erp legend { padding: 0 10px; font-weight: bold; color: var(--secondary-green); }
                .form-container-erp label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.9em; }
                .form-container-erp input, .form-container-erp select { width: 100%; padding: 8px 10px; margin-bottom: 15px; border: 1px solid var(--border-color); border-radius: 4px; box-sizing: border-box; background-color: var(--bg-main); color: var(--text-primary); }
                .form-container-erp input[readOnly] { background-color: var(--border-color); cursor: not-allowed; opacity: 0.7; }
                .form-container-erp .submit-button { width: 100%; background-color: var(--secondary-green); color: white; font-size: 16px; border: none; cursor: pointer; transition: background 0.3s; padding: 10px 20px; border-radius: 5px;}
                .form-container-erp .submit-button:hover { opacity: 0.9; }
                .form-container-erp .submit-button:disabled { background-color: var(--secondary-green); opacity: 0.6; cursor: not-allowed; }
                .form-container-erp .inline-group { display: flex; gap: 20px; }
                .form-container-erp .inline-group > div { flex: 1; }
                .form-container-erp .checkbox-group { display: flex; gap: 15px; align-items: center; margin-bottom: 15px;}
                .form-container-erp .checkbox-group label { display: flex; align-items: center; gap: 5px; margin-bottom: 0; }
                .form-container-erp .checkbox-group input { width: auto; margin-bottom: 0; }
                .form-container-erp .error-text { color: #d9534f; font-size: 0.8em; margin-top: -10px; margin-bottom: 10px; }
            `}</style>
            <div className="form-container-erp">
                 <h2 className="text-xl font-bold">{isEditMode ? `Editando Usuario: ${userToEdit.username}` : 'Registro de Nuevo Usuario'}</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-content-grid grid md:grid-cols-2 gap-x-6">
                        {/* --- COLUMNA IZQUIERDA --- */}
                        <div>
                            <fieldset>
                                <legend>Datos Personales</legend>
                                <div className="inline-group">
                                    <div>
                                        <label htmlFor="nombre">Nombre:</label>
                                        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                        {errors.nombre && <p className="error-text">{errors.nombre}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="apellidos">Apellidos:</label>
                                        <input type="text" id="apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                                        {errors.apellidos && <p className="error-text">{errors.apellidos}</p>}
                                    </div>
                                </div>
                                <label htmlFor="cedula">Número de Cédula:</label>
                                <input type="text" id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} required />
                                {errors.cedula && <p className="error-text">{errors.cedula}</p>}
                                <label htmlFor="correoPersonal">Correo Personal:</label>
                                <input type="email" id="correoPersonal" name="correoPersonal" value={formData.correoPersonal} onChange={handleChange} required />
                                {errors.correoPersonal && <p className="error-text">{errors.correoPersonal}</p>}
                                <label htmlFor="celular">Número de Celular:</label>
                                <input type="tel" id="celular" name="celular" value={formData.celular} onChange={handleChange} />
                                <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
                                <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
                                <label htmlFor="direccion">Dirección de Residencia:</label>
                                <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} />
                            </fieldset>
                        </div>

                         {/* --- COLUMNA DERECHA --- */}
                        <div>
                            <fieldset>
                                <legend>Datos Laborales</legend>
                                <div>
                                    <label htmlFor="rol">Rol de Usuario:</label>
                                    <div className="flex items-center gap-2 mb-[15px]">
                                        <select 
                                            id="rol" 
                                            name="rol" 
                                            value={formData.rol} 
                                            onChange={handleChange} 
                                            required 
                                            style={{ flexGrow: 1, marginBottom: 0 }}
                                        >
                                            <option value="">Seleccione un rol</option>
                                            {roles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                        <button 
                                            type="button" 
                                            onClick={handleOpenPermissions} 
                                            className="flex-shrink-0 p-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md hover:opacity-80 transition-opacity"
                                            style={{ height: '37px', width: '37px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            title="Gestionar permisos granulares"
                                        >
                                            <PadlockIcon className="w-5 h-5 text-[var(--text-primary)]"/>
                                        </button>
                                    </div>
                                    {errors.rol && <p className="error-text" style={{ marginTop: '-10px' }}>{errors.rol}</p>}
                                </div>
                                <label htmlFor="departamento">Departamento / Área:</label>
                                <input type="text" id="departamento" name="departamento" value={formData.departamento} onChange={handleChange} />
                                <label htmlFor="supervisor">Supervisor Directo:</label>
                                <input type="text" id="supervisor" name="supervisor" value={formData.supervisor} onChange={handleChange} />
                                <label htmlFor="fechaIngreso">Fecha de Ingreso:</label>
                                <input type="date" id="fechaIngreso" name="fechaIngreso" value={formData.fechaIngreso} onChange={handleChange} />
                                <label htmlFor="tipoContrato">Tipo de Contrato:</label>
                                <select id="tipoContrato" name="tipoContrato" value={formData.tipoContrato} onChange={handleChange}>
                                    <option value="">Seleccione</option>
                                    <option value="Fijo">Fijo</option>
                                    <option value="Temporal">Temporal</option>
                                </select>
                            </fieldset>
                            <fieldset>
                                <legend>Datos de Acceso</legend>
                                <label htmlFor="usuario">Usuario (autogenerado):</label>
                                <input type="text" id="usuario" name="usuario" value={formData.usuario} required readOnly={isEditMode} />
                                {errors.usuario && <p className="error-text">{errors.usuario}</p>}
                                <label htmlFor="password">Contraseña:</label>
                                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                                {errors.password && <p className="error-text">{errors.password}</p>}
                                <label htmlFor="confirmarPassword">Confirmar Contraseña:</label>
                                <input type="password" id="confirmarPassword" name="confirmarPassword" value={formData.confirmarPassword} onChange={handleChange} required />
                                {errors.confirmarPassword && <p className="error-text">{errors.confirmarPassword}</p>}
                            </fieldset>
                             <fieldset>
                                <legend>Seguridad y Estado</legend>
                                <label>Autenticación de Dos Factores (2FA):</label>
                                <div className="checkbox-group">
                                    <label><input type="radio" name="2fa" value="correo" checked={formData['2fa'] === 'correo'} onChange={handleCheckboxChange} /> Correo</label>
                                    <label><input type="radio" name="2fa" value="celular" checked={formData['2fa'] === 'celular'} onChange={handleCheckboxChange} /> Celular</label>
                                    <label><input type="radio" name="2fa" value="no" checked={formData['2fa'] === 'no'} onChange={handleCheckboxChange} /> No activar</label>
                                </div>
                                <label htmlFor="estadoCuenta">Estado de usuario:</label>
                                <select id="estadoCuenta" name="estadoCuenta" value={formData.estadoCuenta} onChange={handleChange}>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </fieldset>
                        </div>
                    </div>
                     <div className="mt-auto pt-4 flex-shrink-0">
                        <input 
                            type="submit"
                            className="submit-button"
                            value={isEditMode ? 'Guardar Cambios' : 'Registrar Usuario'}
                            disabled={!canSubmit}
                            title={!canSubmit ? "No tiene permisos para realizar esta acción" : ""}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistroUsuario;