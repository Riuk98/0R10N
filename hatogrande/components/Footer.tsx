import React from 'react';
import { useAppContext } from '../context/AppContext';

const Footer: React.FC = () => {
    const { navigateTo } = useAppContext();

    return (
        <footer className="text-[var(--color-text)] pt-6 pb-20">
            <div className="container mx-auto max-w-6xl bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Left Column */}
                    <div className="space-y-20">
                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-bold text-[var(--color-dark)] mb-2 tracking-wider">CONTACTO</h3>
                            <p className="text-sm text-[var(--color-text)] mb-1">Finca Hato Grande, Suesca</p>
                            <p className="text-sm text-[var(--color-text)] mb-1">Email: ventas@hatogrande.com</p>
                            <p className="text-sm text-[var(--color-text)] mb-1">Teléfono: +57 310 123 4567</p>
                        </div>
                        
                        {/* Payment Methods */}
                        <div>
                             <h3 className="text-lg font-bold text-[var(--color-dark)] mb-2 tracking-wider">MÉTODOS DE PAGO</h3>
                             <p className="text-sm text-[var(--color-text)]">Aceptamos todos los métodos de pago principales.</p>
                        </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-bold text-[var(--color-dark)] mb-2 tracking-wider">ENLACES</h3>
                            <ul className="space-y-1 text-sm">
                                <li><a href="#" onClick={(e) => {e.preventDefault(); navigateTo('about')}} className="text-[var(--color-text)] hover:opacity-80 transition-opacity">Acerca de Nosotros</a></li>
                                <li><a href="#" className="text-[var(--color-text)] hover:opacity-80 transition-opacity">Preguntas Frecuentes</a></li>
                                <li><a href="#" className="text-[var(--color-text)] hover:opacity-80 transition-opacity">Política de Privacidad</a></li>
                                <li><a href="#" className="text-[var(--color-text)] hover:opacity-80 transition-opacity">Términos y Condiciones</a></li>
                            </ul>
                        </div>
                        
                        {/* Social Media & ERP */}
                        <div>
                            <h3 className="text-lg font-bold text-[var(--color-dark)] mb-2 tracking-wider">SÍGUENOS</h3>
                            <div className="flex space-x-4 mb-4">
                                <a href="#" className="text-[var(--color-dark)] hover:opacity-80 transition-opacity">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h5.713c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z" /></svg>
                                </a>
                                 <a href="#" className="text-[var(--color-dark)] hover:opacity-80 transition-opacity">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.585.069-4.85c.149-3.225 1.664 4.771 4.919 4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" /></svg>
                                </a>                           
                            </div>                
                             <button 
                                 onClick={() => navigateTo('orion-login')} 
                                 className="transition-transform duration-300 hover:scale-105"
                                 title="Acceder al Sistema ORION"
                             >
                                <img 
                                    src="https://i.postimg.cc/TYmLPPGk/Generated-Image-October-17-2025-12-49-AM-2.png" 
                                    alt="Acceder a Sistema ORION ERP" 
                                    className="h-12 w-auto"
                                />
                             </button>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-[var(--color-text)]">
                    <p>&copy; 2025 Hato Grande. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;