import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { categories } from '../data';

const Header: React.FC = () => {
    const { navigateTo, currentUser, isCartOpen, setIsCartOpen, cart, logout } = useAppContext();
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const productsMenuRef = useRef<HTMLDivElement>(null);


    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    const navItems = [
        { name: 'INICIO', page: 'home', accessKey: '1' },
        { name: 'PRODUCTOS', page: 'products', accessKey: '2' },
        { name: 'CONTACTO', page: 'contact', accessKey: '3' },
        { name: 'ACERCA DE NOSOTROS', page: 'about', accessKey: '4' },
    ];
    
    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (productsMenuRef.current && !productsMenuRef.current.contains(event.target as Node)) {
                setIsProductsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProductNavigation = (category: string) => {
        console.log(`Navigating to products with category: ${category}`);
        navigateTo('products');
        setIsProductsOpen(false);
        setIsMobileMenuOpen(false);
    }
    
    const handleNavClick = (page: any) => {
        navigateTo(page);
        setIsMobileMenuOpen(false);
    }
    
    const MobileNavMenu = () => {
        const [showMobileProducts, setShowMobileProducts] = useState(false);

        return (
            <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm md:hidden">
                <div className="flex justify-between items-center p-4 border-b">
                     <button onClick={() => handleNavClick('home')} className="flex items-center">
                        <img src="https://i.postimg.cc/kDrPRRWy/Gemini-Generated-Image-s055fas055fas055.png" alt="Hato Grande Logo" className="h-12 w-auto" />
                    </button>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--color-dark)]">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <nav className="flex flex-col p-4 space-y-2">
                    {navItems.map(item => (
                        <div key={item.name}>
                            {item.name === 'PRODUCTOS' ? (
                                <>
                                    <button onClick={() => setShowMobileProducts(!showMobileProducts)} className="w-full text-left text-lg font-semibold text-[var(--color-dark)] p-3 rounded-md hover:bg-gray-100 flex justify-between items-center">
                                        {item.name}
                                        <svg className={`w-5 h-5 transform transition-transform ${showMobileProducts ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    {showMobileProducts && (
                                        <div className="pl-4 mt-2 space-y-2">
                                             {categories.map(cat => (
                                                <a key={cat.id} href="#" onClick={(e) => { e.preventDefault(); handleProductNavigation(cat.id); }} className="block px-4 py-2 text-md text-[var(--color-text)] hover:bg-gray-100 rounded-md">{cat.name}</a>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button onClick={() => handleNavClick(item.page as any)} className="w-full text-left text-lg font-semibold text-[var(--color-dark)] p-3 rounded-md hover:bg-gray-100">
                                    {item.name}
                                </button>
                            )}
                        </div>
                    ))}
                    <hr className="my-4"/>
                    {currentUser ? (
                         <>
                            <button onClick={() => { handleNavClick('account'); setIsUserMenuOpen(false); }} className="w-full text-left text-lg font-semibold text-[var(--color-dark)] p-3 rounded-md hover:bg-gray-100">MI CUENTA</button>
                            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left text-lg font-semibold text-[var(--color-dark)] p-3 rounded-md hover:bg-gray-100">CERRAR SESIÓN</button>
                         </>
                    ) : (
                        <button onClick={() => handleNavClick('login')} className="w-full text-left text-lg font-semibold text-[var(--color-dark)] p-3 rounded-md hover:bg-gray-100">
                            INGRESAR
                        </button>
                    )}
                </nav>
            </div>
        )
    }

    return (
        <>
        <header className="sticky top-0 z-40 w-full py-3">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white/80 backdrop-blur-lg rounded-full shadow-lg flex items-center justify-between px-6 py-2 transition-all duration-300 hover:bg-white">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <button onClick={() => navigateTo('home')} className="flex items-center transition-transform duration-300 hover:scale-105" title="Ir al Inicio">
                            <img src="https://i.postimg.cc/kDrPRRWy/Gemini-Generated-Image-s055fas055fas055.png" alt="Hato Grande Logo" className="h-12 w-auto" />
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
                        {navItems.map(item => (
                             <div key={item.name} className="relative group" ref={item.name === 'PRODUCTOS' ? productsMenuRef : null}>
                                <button
                                    onClick={() => item.name === 'PRODUCTOS' ? setIsProductsOpen(prev => !prev) : navigateTo(item.page as any)}
                                    className="text-base font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors duration-300 pb-2"
                                    title={`Alt + ${item.accessKey}`}
                                    accessKey={item.accessKey}
                                >
                                    {item.name}
                                     <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                                </button>
                                {item.name === 'PRODUCTOS' && isProductsOpen && (
                                     <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-md shadow-xl py-2 z-50 ring-1 ring-black ring-opacity-5">
                                         {categories.map(cat => (
                                             <a key={cat.id} href="#" onClick={(e) => { e.preventDefault(); handleProductNavigation(cat.id); }} className="block px-4 py-3 text-sm text-[var(--color-text)] hover:bg-gray-100 hover:text-[var(--color-dark)] transition-colors">{cat.name}</a>
                                         ))}
                                     </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                         <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors" title="Ver Carrito de Compras">
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-red-600 text-white text-xs font-bold rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                        
                        <div className="relative hidden md:block" ref={userMenuRef}>
                            {currentUser ? (
                                <div>
                                    <button 
                                        onClick={() => setIsUserMenuOpen(prev => !prev)}
                                        className="text-base font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors duration-300 flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                        {currentUser.firstName.toUpperCase()}
                                    </button>
                                    {isUserMenuOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 z-50 ring-1 ring-black ring-opacity-5">
                                            <button onClick={() => { navigateTo('account'); setIsUserMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-gray-100 transition-colors">MI CUENTA</button>
                                            <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-gray-100 transition-colors">CERRAR SESIÓN</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button 
                                    onClick={() => navigateTo('login')} 
                                    className="text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors"
                                    title="Ingresar o Registrarse"
                                >
                                    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </button>
                            )}
                        </div>
                        
                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="text-[var(--color-dark)]">
                                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        {isMobileMenuOpen && <MobileNavMenu />}
        </>
    );
};

export default Header;