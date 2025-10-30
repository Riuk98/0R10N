

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Switch from './Switch'; // Import the new Switch component

// --- TYPE DEFINITIONS ---
interface WindowState {
  id: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  animationState?: 'opening' | 'closing-for-close';
}

// Import all the new module components
import ClientesCRM from '../modules/comercial/ClientesCRM';
import PedidosVenta from '../modules/comercial/PedidosVenta';
import SoportePQR from '../modules/comercial/SoportePQR';
import CrearPedido from '../modules/comercial/CrearPedido';


import CuentasCobrar from '../modules/financiero/CuentasCobrar';
import CuentasPagar from '../modules/financiero/CuentasPagar';
import Contabilidad from '../modules/financiero/Contabilidad';
import Nomina from '../modules/financiero/Nomina';

import Inventario from '../modules/operaciones/Inventario';
import Compras from '../modules/operaciones/Compras';
import Produccion from '../modules/operaciones/Produccion';

import ReportesAnaliticas from '../modules/administracion/ReportesAnaliticas';
import GestionUsuarios from '../modules/administracion/GestionUsuarios';
import Configuracion from '../modules/administracion/Configuracion';
import RegistroUsuario from '../modules/administracion/RegistroUsuario';
import { OrionUser, INTERNAL_USERS } from '../data/internalUsers';


// --- SVG ICONS (as React components for easier use) ---
const Icons = {
    Menu: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    ),
    User: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    ),
    Profile: (props: React.SVGProps<SVGSVGElement>) => (
         <svg {...props} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    ),
    Password: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    ),
    Logout: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
    ),
    Commercial: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>),
    Financial: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>),
    Operations: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>),
    Admin: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>),
    ArrowLeft: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>),
    // FIX: Corrected typo in viewBox attribute from "0 0 24" 24" to "0 0 24 24".
    Trash: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>),
};

// --- NAVIGATION DATA ---
const navData = [
    { title: "Comercial", icon: Icons.Commercial, items: ["Terceros (CRM)", "Pedidos de Venta", "Soporte (PQR)"] },
    { title: "Financiero", icon: Icons.Financial, items: ["Cuentas por Cobrar", "Cuentas por Pagar", "Contabilidad", "Nómina"] },
    { title: "Operaciones", icon: Icons.Operations, items: ["Inventario", "Compras", "Producción"] },
    { title: "Administración", icon: Icons.Admin, items: ["Reportes y Analíticas", "Gestión de Usuarios", "Configuración"] },
];


// New component to render module content
const ModuleContent: React.FC<{ 
    title: string; 
    onClose?: () => void;
    visibleModules?: Record<string, boolean>;
    toggleModuleVisibility?: (moduleName: string) => void;
    users: OrionUser[];
    onRegisterSuccess: (newUser: OrionUser) => void;
}> = ({ title, onClose = () => {}, visibleModules, toggleModuleVisibility, users, onRegisterSuccess }) => {
    switch (title) {
        case 'Terceros (CRM)': return <ClientesCRM />;
        case 'Pedidos de Venta': return <PedidosVenta />;
        case 'Soporte (PQR)': return <SoportePQR />;
        case 'Crear Pedido': return <CrearPedido onClose={onClose} />;

        case 'Cuentas por Cobrar': return <CuentasCobrar />;
        case 'Cuentas por Pagar': return <CuentasPagar />;
        case 'Contabilidad': return <Contabilidad />;
        case 'Nómina': return <Nomina />;
        
        case 'Inventario': return <Inventario />;
        case 'Compras': return <Compras />;
        case 'Producción': return <Produccion />;
        
        case 'Reportes y Analíticas': return <ReportesAnaliticas />;
        case 'Gestión de Usuarios': return <GestionUsuarios users={users} />;
        case 'Configuración': return <Configuracion visibleModules={visibleModules} toggleModuleVisibility={toggleModuleVisibility} />;
        case 'Registro de Usuario': return <RegistroUsuario onRegisterSuccess={onRegisterSuccess} onClose={onClose} />;

        
        default: return <p>Contenido para {title} no encontrado.</p>;
    }
};


// --- WINDOW COMPONENT ---
const Window: React.FC<{
    win: WindowState,
    onClose: (id: string) => void,
    onMinimize: (id: string) => void,
    onFocus: (id: string) => void,
    onUpdate: (id: string, updates: Partial<WindowState>) => void,
    isFocused: boolean;
    onAnimationEnd: (id: string) => void;
    visibleModules?: Record<string, boolean>;
    toggleModuleVisibility?: (moduleName: string) => void;
    users: OrionUser[];
    onRegisterSuccess: (newUser: OrionUser) => void;
}> = ({ win, onClose, onMinimize, onFocus, onUpdate, isFocused, onAnimationEnd, visibleModules, toggleModuleVisibility, users, onRegisterSuccess }) => {
    
    const headerRef = useRef<HTMLDivElement>(null);

    const handleDrag = useCallback((e: MouseEvent) => {
        const startPos = { x: e.clientX, y: e.clientY };
        const startPosition = win.position;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const newX = startPosition.x + moveEvent.clientX - startPos.x;
            let newY = startPosition.y + moveEvent.clientY - startPos.y;

            // Constrain the vertical position so the window header cannot go above the top bar.
            if (newY < 0) {
                newY = 0;
            }

            onUpdate(win.id, { position: { x: newX, y: newY } });
        };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }, [win.id, win.position, onUpdate]);

    const handleMaximize = () => onUpdate(win.id, { isMaximized: !win.isMaximized });
    
    useEffect(() => {
        const header = headerRef.current;
        const onMouseDown = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('.window-controls')) return;
            if (win.isMaximized) return;
            handleDrag(e);
        };
        header?.addEventListener('mousedown', onMouseDown);
        return () => header?.removeEventListener('mousedown', onMouseDown);
    }, [handleDrag, win.isMaximized]);

    const style: React.CSSProperties = {
        zIndex: win.zIndex,
        borderColor: 'var(--secondary-green)',
    };
    
    const animationClass = win.animationState?.startsWith('closing')
        ? 'window-fade-out'
        : win.animationState === 'opening'
        ? 'window-fade-in'
        : '';

    return (
        <div
            id={win.id}
            onMouseDown={() => onFocus(win.id)}
            onAnimationEnd={() => onAnimationEnd(win.id)}
            className={`internal-window ${win.isMaximized ? 'maximized' : ''} ${animationClass}`}
            style={{
                ...style,
                top: win.isMaximized ? undefined : win.position.y,
                left: win.isMaximized ? undefined : win.position.x,
                width: win.isMaximized ? undefined : win.size.width,
                height: win.isMaximized ? undefined : win.size.height,
            }}
        >
            <div
                ref={headerRef}
                onDoubleClick={handleMaximize}
                className="window-header"
            >
                <span className="window-title">{win.title}</span>
                <div className="window-controls">
                    <button onClick={() => onMinimize(win.id)} title="Minimizar">_</button>
                    <button onClick={handleMaximize} title="Maximizar">□</button>
                    <button onClick={() => onClose(win.id)} title="Cerrar">X</button>
                </div>
            </div>
            <div className={`window-content ${win.title === 'Crear Pedido' || win.title === 'Registro de Usuario' ? 'no-padding' : ''}`}>
                 <ModuleContent title={win.title} onClose={() => onClose(win.id)} visibleModules={visibleModules} toggleModuleVisibility={toggleModuleVisibility} users={users} onRegisterSuccess={onRegisterSuccess} />
            </div>
        </div>
    );
};


// --- MAIN DASHBOARD COMPONENT ---
interface DashboardProps {
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [isSidebarForceOpen, setSidebarForceOpen] = useState(false);
    const [isPartiallyCollapsed, setPartiallyCollapsed] = useState(false);
    const [openPillars, setOpenPillars] = useState<string[]>([]);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const [currentTime, setCurrentTime] = useState('');
    const [windows, setWindows] = useState<WindowState[]>([]);
    const [windowToCloseId, setWindowToCloseId] = useState<string | null>(null);
    const [showCloseAllConfirmation, setShowCloseAllConfirmation] = useState(false);
    const nextZIndex = useRef(100);
    const maxZIndex = windows.reduce((max, w) => Math.max(max, w.zIndex), 0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [internalUsers, setInternalUsers] = useState<OrionUser[]>([]);
    const ORION_USERS_STORAGE_KEY = 'orionInternalUsers';


    // Effect to load/initialize users
    useEffect(() => {
        try {
            const storedUsers = localStorage.getItem(ORION_USERS_STORAGE_KEY);
            if (storedUsers) {
                setInternalUsers(JSON.parse(storedUsers));
            } else {
                setInternalUsers(INTERNAL_USERS);
                localStorage.setItem(ORION_USERS_STORAGE_KEY, JSON.stringify(INTERNAL_USERS));
            }
        } catch (error) {
            console.error("Failed to manage Orion users in localStorage", error);
            setInternalUsers(INTERNAL_USERS);
        }
    }, []);

    const handleRegisterUser = (newUser: OrionUser) => {
        const updatedUsers = [...internalUsers, newUser];
        setInternalUsers(updatedUsers);
        localStorage.setItem(ORION_USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    };


    const allModules = navData.flatMap(pillar => pillar.items);
    const [visibleModules, setVisibleModules] = useState<Record<string, boolean>>(() => {
        try {
            const savedVisibility = localStorage.getItem('orion_module_visibility');
            if (savedVisibility) {
                const parsed = JSON.parse(savedVisibility);
                // Ensure all modules from navData are present in the state, default to true if new
                allModules.forEach(moduleName => {
                    if (parsed[moduleName] === undefined) {
                        parsed[moduleName] = true;
                    }
                });
                return parsed;
            }
        } catch (e) {
            console.error("Failed to parse module visibility from localStorage", e);
        }
        // Default to all visible
        return allModules.reduce((acc, moduleName) => {
            acc[moduleName] = true;
            return acc;
        }, {} as Record<string, boolean>);
    });

    useEffect(() => {
        localStorage.setItem('orion_module_visibility', JSON.stringify(visibleModules));
    }, [visibleModules]);
    
    const toggleModuleVisibility = (moduleName: string) => {
        setVisibleModules(prev => ({
            ...prev,
            [moduleName]: !prev[moduleName],
        }));
    };

    // Theme effect
    useEffect(() => {
        const body = document.body;
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    // Clock effect
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
            setCurrentTime(now.toLocaleDateString('es-ES', options));
        };
        updateDateTime();
        const timer = setInterval(updateDateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    // Click outside user menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Effect to manage initial load animation
    useEffect(() => {
        const timer = setTimeout(() => setIsInitialLoad(false), 50); // Short delay to apply initial styles
        return () => clearTimeout(timer);
    }, []);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    const togglePartialCollapse = () => setPartiallyCollapsed(!isPartiallyCollapsed);

    const toggleSidebar = (e: React.MouseEvent) => {
        e.stopPropagation();
         if (window.innerWidth <= 768) {
             setSidebarForceOpen(!isSidebarForceOpen);
         } else {
            setSidebarCollapsed(!isSidebarCollapsed);
         }
    };

    const handlePillarClick = (title: string) => {
        const togglePillar = () => {
            setOpenPillars(prevOpenPillars =>
                prevOpenPillars.includes(title)
                    ? prevOpenPillars.filter(p => p !== title)
                    : [...prevOpenPillars, title]
            );
        };

        if (isPartiallyCollapsed) {
            setPartiallyCollapsed(false);
            setTimeout(togglePillar, 50);
        } else {
            togglePillar();
        }
    };

    const createWindow = useCallback((title: string) => {
        if (window.innerWidth <= 768) {
            setSidebarForceOpen(false);
        }

        const existingWindow = windows.find(w => w.title === title);
        if (existingWindow) {
            if (existingWindow.isMinimized) {
                restoreWindow(existingWindow.id);
            } else {
                focusWindow(existingWindow.id);
            }
            return;
        }
        
        const newWindow: WindowState = {
            id: `win_${Date.now()}`,
            title,
            position: { x: 50 + windows.length * 20, y: 50 + windows.length * 20 },
            size: { width: 700, height: 500 },
            isMinimized: false,
            isMaximized: false,
            zIndex: nextZIndex.current++,
            animationState: 'opening',
        };
        setWindows([...windows, newWindow]);
        focusWindow(newWindow.id);
    }, [windows]);

    useEffect(() => {
        const handleCreateWindow = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail && customEvent.detail.title) {
                createWindow(customEvent.detail.title);
            }
        };

        window.addEventListener('createOrionWindow', handleCreateWindow);

        return () => {
            window.removeEventListener('createOrionWindow', handleCreateWindow);
        };
    }, [createWindow]);

    const updateWindow = (id: string, updates: Partial<WindowState>) => {
        setWindows(windows.map(w => w.id === id ? { ...w, ...updates } : w));
    };
    
    const closeWindow = (id: string) => setWindows(windows.filter(w => w.id !== id));
    
    const minimizeWindow = (id: string) => updateWindow(id, { isMinimized: true });
    
    const restoreWindow = (id: string) => {
         const winToRestore = windows.find(w => w.id === id);
         if (winToRestore) {
              setWindows(windows.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex.current++, animationState: 'opening' } : w));
         }
    };
    
    const focusWindow = (id: string) => {
        const currentMaxZIndex = windows.reduce((max, w) => Math.max(max, w.zIndex), 0);
        const winToFocus = windows.find(w => w.id === id);
        if (winToFocus && winToFocus.zIndex < currentMaxZIndex) {
            setWindows(windows.map(w => w.id === id ? { ...w, zIndex: currentMaxZIndex + 1 } : w));
            nextZIndex.current = currentMaxZIndex + 2;
        }
    };
    
    // Window close confirmation handlers
    const requestCloseWindow = (id: string) => {
        setWindowToCloseId(id);
    };

    const handleConfirmClose = () => {
        if (windowToCloseId) {
            const windowToClose = windows.find(w => w.id === windowToCloseId);
            if (windowToClose) {
                if (windowToClose.isMinimized) {
                    closeWindow(windowToCloseId);
                } else {
                    updateWindow(windowToCloseId, { animationState: 'closing-for-close' });
                }
            }
        }
        setWindowToCloseId(null);
    };

    const handleCancelClose = () => {
        setWindowToCloseId(null);
    };
    
    const handleConfirmCloseAll = () => {
        setWindows([]);
        setShowCloseAllConfirmation(false);
    };

    const handleAnimationEnd = (id: string) => {
        const win = windows.find(w => w.id === id);
        if (!win) return;

        if (win.animationState === 'opening') {
            updateWindow(id, { animationState: undefined });
        } else if (win.animationState === 'closing-for-close') {
            closeWindow(id);
        }
    };

    useEffect(() => {
        const body = document.body;
        // Add a class to prevent transitions on initial render
        body.classList.toggle('no-transition-on-load', isInitialLoad);
        
        // A safer way to toggle classes without overwriting others
        body.classList.toggle('dark-mode', theme === 'dark');
        body.classList.toggle('sidebar-collapsed', isSidebarCollapsed);
        body.classList.toggle('sidebar-force-open', isSidebarForceOpen);
        body.classList.toggle('sidebar-partially-collapsed', isPartiallyCollapsed);
    }, [theme, isSidebarCollapsed, isSidebarForceOpen, isPartiallyCollapsed, isInitialLoad]);

    const filteredNavData = navData.map(pillar => ({
        ...pillar,
        items: pillar.items.filter(item => visibleModules[item] ?? true)
    })).filter(pillar => pillar.items.length > 0);
    
    return (
        <div className={`erp-container`}>
           <style>{`
                 body.no-transition-on-load .sidebar,
                 body.no-transition-on-load .main-content,
                 body.no-transition-on-load .minimized-bar {
                    transition: none !important;
                 }
                 :root {
                    --primary-blue: #042940; --secondary-green: #005C53; --accent-green-soft: #A9DFBF;
                    --accent-green-bright: #18bedb; --bg-main: #e9eef2; --bg-card: #ffffff;
                    --bg-sidebar: #fafafa; --text-primary: #333333; --text-secondary: #555;
                    --text-on-dark: #f8f9fa; --border-color: #e0e0e0; --header-window-bg: #fafafa;
                    --sidebar-width-collapsed: 70px;
                    --sidebar-width: 190px; --topbar-height: 50px;
                    --dashboard-bg: #fffafa; --dashboard-text: var(--primary-blue);
                }
                body.sidebar-partially-collapsed {
                    --sidebar-width: var(--sidebar-width-collapsed);
                }
                body.dark-mode {
                    --bg-main: #1A202C; --bg-card: #2D3748; --bg-sidebar: #1A202C;
                    --text-primary: #E2E8F0; --text-secondary: #A0AEC0; --border-color: #4A5568;
                    --header-window-bg: #2D3748;
                    --dashboard-bg: #051d40; --dashboard-text: var(--text-on-dark);
                }
                body {
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    margin: 0; background-color: var(--bg-main); color: var(--text-primary);
                    overflow: hidden; transition: background-color 0.3s, color 0.3s;
                }
                /* --- Custom Scrollbar Styles --- */
                .erp-container ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .erp-container ::-webkit-scrollbar-track {
                    background-color: rgba(0,0,0,0.05); /* Light track for light mode */
                    border-radius: 10px;
                }
                .erp-container ::-webkit-scrollbar-thumb {
                    background-color: #c1c1c1; /* Mid-gray thumb */
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .erp-container ::-webkit-scrollbar-thumb:hover {
                    background-color: #a8a8a8; /* Darker thumb on hover */
                }
                body.dark-mode .erp-container ::-webkit-scrollbar-track {
                    background-color: rgba(255,255,255,0.1); /* Lighter track for dark mode */
                }
                body.dark-mode .erp-container ::-webkit-scrollbar-thumb {
                    background-color: #4A5568; /* Thumb color from dark theme variables */
                }
                body.dark-mode .erp-container ::-webkit-scrollbar-thumb:hover {
                    background-color: #718096; /* Lighter thumb on hover */
                }
                .top-bar { position: fixed; top: 0; left: 0; width: 100%; height: var(--topbar-height); background-color: var(--header-window-bg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 1000; border-bottom: 1px solid var(--border-color); transition: background-color 0.3s, border-color 0.3s; }
                .menu-toggle-container { position: absolute; left: 15px; }
                #menu-toggle { background: none; border: 1px solid var(--border-color); color: var(--text-secondary); font-size: 1em; cursor: pointer; display: flex; align-items: center; gap: 3px; padding: 5px 10px; border-radius: 5px; transition: background-color 0.2s, color 0.2s, border-color 0.2s; }
                #menu-toggle:hover { background-color: var(--bg-main); opacity: 0.8; }
                #datetime-container { font-size: 1.1em; font-weight: 500; color: var(--text-primary); }
                .header-actions { position: absolute; right: 20px; display: flex; align-items: center; gap: 20px; }
                #theme-toggle { background: none; border: none; cursor: pointer; padding: 5px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s; }
                #theme-toggle:hover { background-color: rgba(0,0,0,0.05); }
                .user-info { position: relative; display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 5px; border-radius: 8px; transition: background-color 0.2s; }
                .user-info:hover { background-color: rgba(0,0,0,0.05); }
                .user-name { font-weight: 500; color: var(--text-primary); }
                .user-icon { width: 32px; height: 32px; border-radius: 50%; background-color: var(--accent-green-bright); color: white; display: flex; align-items: center; justify-content: center; border: none; }
                .dropdown-panel { display: none; position: absolute; top: 50px; right: 0; background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); z-index: 1001; width: 220px; overflow: hidden; }
                .dropdown-panel.show { display: block; }
                .user-menu ul { list-style: none; padding: 0; margin: 0; }
                .user-menu li a { display: flex; align-items: center; gap: 10px; padding: 12px 15px; text-decoration: none; color: var(--text-primary); font-size: 0.95em; }
                .user-menu li a:hover { background-color: var(--bg-main); }
                .sidebar { width: var(--sidebar-width); background-color: var(--bg-sidebar); color: var(--text-primary); height: 100vh; position: fixed; top: 0; left: 0; display: flex; flex-direction: column; padding-top: var(--topbar-height); box-sizing: border-box; z-index: 999; transform: translateX(0); transition: width 0.3s ease-in-out, transform 0.3s ease-in-out, background-color 0.3s, color 0.3s; border-right: 1px solid var(--border-color); }
                body.sidebar-collapsed .sidebar { transform: translateX(calc(-1 * var(--sidebar-width))); }
                .sidebar-nav { list-style: none; padding: 0; margin: 0; flex-grow: 1; overflow-y: auto; overflow-x: hidden; }
                .nav-item { border-bottom: 1px solid var(--border-color); }
                .nav-item a, .pillar-toggle { display: flex; align-items: center; padding: 15px 20px; color: var(--text-primary); text-decoration: none; transition: background-color 0.3s, opacity 0.2s; gap: 20px; font-size: 1em; cursor: pointer; }
                .nav-item a:hover, .pillar-toggle:hover { background-color: var(--bg-main); opacity: 0.8; }
                .pillar-toggle .arrow { transition: transform 0.3s; color: var(--accent-green-bright); font-weight: bold; width: 10px; text-align: center; }
                .pillar-toggle.open .arrow { transform: rotate(90deg); }
                .pillar-content { display: flex; align-items: center; gap: 15px; white-space: nowrap;}
                .pillar-content .w-5 { display: none; }
                body.sidebar-partially-collapsed .pillar-content .w-5 { display: block; color: var(--accent-green-bright); }
                .submenu { list-style: none; padding: 0; background-color: #f8f9fa; max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
                body.dark-mode .submenu { background-color: #242c3b; }
                .submenu.open { max-height: 500px; }
                .submenu a { padding: 12px 20px 12px 45px; font-size: 0.9em; white-space: nowrap; }
                .submenu a:hover { background-color: var(--bg-main); opacity: 0.8;}
                .sidebar-footer { padding: 10px; border-top: 1px solid var(--border-color); margin-top: auto; flex-shrink: 0; }
                .sidebar-footer button { display: flex; align-items: center; gap: 15px; width: 100%; padding: 10px; border-radius: 5px; background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9em; font-weight: 500; text-align: left; }
                .sidebar-footer button:hover { background-color: var(--bg-main); }
                .sidebar-footer button.close-all-btn:hover { background-color: rgba(217, 83, 79, 0.1); color: #d9534f; }
                .sidebar-footer .collapse-arrow { transition: transform 0.3s ease; }
                body.sidebar-partially-collapsed .pillar-content span,
                body.sidebar-partially-collapsed .pillar-toggle .arrow,
                body.sidebar-partially-collapsed .submenu,
                body.sidebar-partially-collapsed .sidebar-footer button span { display: none; }
                body.sidebar-partially-collapsed .nav-item a, body.sidebar-partially-collapsed .pillar-toggle { justify-content: center; padding: 15px 10px; }
                body.sidebar-partially-collapsed .pillar-content { gap: 0; }
                body.sidebar-partially-collapsed .sidebar-footer button { justify-content: center; }
                body.sidebar-partially-collapsed .sidebar-footer .collapse-arrow { transform: rotate(180deg); }
                .main-content { margin-left: var(--sidebar-width); width: calc(100% - var(--sidebar-width)); height: calc(100vh - var(--topbar-height)); margin-top: var(--topbar-height); position: relative; transition: margin-left 0.3s ease-in-out, width 0.3s ease-in-out, background-color 0.3s, color 0.3s; background-color: var(--dashboard-bg); color: var(--dashboard-text); }
                .main-content::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 60%;
                    height: 60%;
                    background-image: url('https://i.postimg.cc/TYmLPPGk/Generated-Image-October-17-2025-12-49-AM-2.png');
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: contain;
                    z-index: 0;
                }
                body.sidebar-collapsed .main-content { margin-left: 0; width: 100%; }
                .internal-window { position: absolute; background-color: var(--bg-card); border: 1px solid var(--secondary-green); border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); display: flex; flex-direction: column; resize: both; overflow: auto; min-width: 350px; min-height: 250px; color: var(--text-primary); transition: background-color 0.3s, color 0.3s, border-color 0.3s; }
                .internal-window.maximized { top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; border-radius: 8px 8px 0 0; resize: none; border-color: var(--secondary-green); }
                .window-header { height: 40px; background-color: var(--header-window-bg); color: var(--text-primary); display: flex; align-items: center; justify-content: space-between; padding: 0 15px; cursor: move; flex-shrink: 0; border-bottom: 1px solid var(--border-color); transition: background-color 0.3s, color 0.3s, border-color 0.3s; }
                .window-title { font-weight: bold; }
                .window-controls { display: flex; gap: 10px; }
                .window-controls button { background: none; border: none; color: var(--text-primary); font-size: 1.2em; cursor: pointer; padding: 5px; border-radius: 4px; transition: background-color 0.2s; }
                .window-controls button:hover { background-color: rgba(0,0,0,0.1); }
                .window-content { padding: 20px; flex-grow: 1; overflow-y: auto;}
                .window-content.no-padding { padding: 0; }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                @keyframes fadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }
                .window-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                .window-fade-out { animation: fadeOut 0.3s ease-in forwards; }
                .ia-feature-box { margin-top: 20px; padding: 15px; border: 1px dashed var(--secondary-green); border-radius: 5px; background-color: #f0fff8; transition: background-color 0.3s; }
                body.dark-mode .ia-feature-box { background-color: rgba(0, 92, 83, 0.2); }
                .ia-feature-box button { background-color: var(--secondary-green); color: white; border: 1px dashed var(--secondary-green); padding: 8px 12px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: filter 0.2s; }
                .ia-feature-box button:hover { filter: brightness(90%); }
                .ia-feature-box textarea { width: calc(100% - 20px); margin-top: 10px; padding: 10px; border-radius: 5px; border: 1px solid var(--border-color); min-height: 80px; background-color: var(--bg-card); color: var(--text-primary); transition: background-color 0.3s, color 0.3s, border-color 0.3s; }
                .minimized-bar { position: fixed; bottom: 0; left: var(--sidebar-width); display: flex; gap: 5px; padding: 5px 5px 0 5px; z-index: 1001; transition: left 0.3s ease-in-out; }
                body.sidebar-collapsed .minimized-bar { left: 0; }
                .minimized-tab { background-color: var(--bg-card); color: var(--text-primary); padding: 8px 12px; border: 1px solid var(--secondary-green); border-bottom: none; border-radius: 5px 5px 0 0; cursor: pointer; display: flex; align-items: center; gap: 10px; box-shadow: 0 -2px 5px rgba(0,0,0,0.1); transition: background-color 0.3s, color 0.3s, border-color 0.3s; }
                .minimized-tab:hover { background-color: var(--bg-main); }
                .minimized-tab .close-minimized { font-weight: bold; font-size: 0.8em; padding: 2px; border-radius: 50%; }
                .minimized-tab .close-minimized:hover { color: #d9534f; background-color: rgba(217, 83, 79, 0.1); }
                .confirmation-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
                .confirmation-modal { background-color: var(--bg-card); padding: 25px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); text-align: center; max-width: 400px; width: 90%; border: 1px solid var(--border-color); }
                .confirmation-modal h4 { font-size: 1.25rem; font-weight: bold; color: var(--text-primary); margin-bottom: 15px; }
                .confirmation-modal-buttons { margin-top: 20px; display: flex; justify-content: center; gap: 15px; }
                .confirmation-modal-buttons button { padding: 10px 20px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; transition: opacity 0.2s; }
                .confirmation-modal-buttons button:hover { opacity: 0.8; }
                .confirm-btn { background-color: #d9534f; color: white; }
                .cancel-btn { background-color: var(--border-color); color: var(--text-primary); }
                @media (max-width: 768px) {
                    body:not(.sidebar-force-open) .sidebar { transform: translateX(calc(-1 * var(--sidebar-width))); }
                    body.sidebar-force-open .sidebar { transform: translateX(0); z-index: 1100; }
                    .main-content { margin-left: 0; width: 100%; }
                    .minimized-bar { left: 0; }
                    .internal-window { width: 95% !important; height: 80% !important; top: 5% !important; left: 2.5% !important; }
                    #datetime-container { display: none; }
                    .user-name { display: none; }
                    #menu-toggle span { display: none; }
                    .sidebar-footer { display: none; }
                    body.sidebar-partially-collapsed { --sidebar-width: 190px; }
                }
           `}</style>
            <header className="top-bar">
                <div className="menu-toggle-container">
                    <button id="menu-toggle" onClick={toggleSidebar}>
                        <Icons.Menu/> <span className="hidden md:inline">Menú</span>
                    </button>
                </div>
                <div id="datetime-container" className="hidden md:block">
                    {currentTime}
                </div>
                <div className="header-actions">
                    <Switch onChange={toggleTheme} checked={theme === 'dark'} />
                    <div className="relative" ref={userMenuRef}>
                        <div id="user-info-toggle" onClick={() => setUserMenuOpen(!userMenuOpen)} className="user-info">
                            <span className="user-name hidden md:inline">Martha Milena</span>
                            <div className="user-icon">
                                <Icons.User/>
                            </div>
                        </div>
                        {userMenuOpen && (
                            <div id="user-menu" className="dropdown-panel show">
                                <ul className="user-menu">
                                    <li><a href="#"><Icons.Profile/> Perfil</a></li>
                                    <li><a href="#"><Icons.Password/> Cambiar contraseña</a></li>
                                    <li><a href="#" id="logout-btn" onClick={(e) => { e.preventDefault(); onLogout(); }}><Icons.Logout/> Cerrar sesión</a></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <aside className="sidebar">
                <ul className="sidebar-nav">
                    {filteredNavData.map(pillar => (
                         <li key={pillar.title} className="nav-item">
                            <div onClick={() => handlePillarClick(pillar.title)} className={`pillar-toggle ${openPillars.includes(pillar.title) ? 'open' : ''}`}>
                                <span className="arrow">▶</span>
                                <div className="pillar-content">
                                    <pillar.icon className="w-5 h-5 flex-shrink-0" />
                                    <span>{pillar.title}</span>
                                </div>
                            </div>
                            <ul className={`submenu ${openPillars.includes(pillar.title) ? 'open' : ''}`} style={{maxHeight: openPillars.includes(pillar.title) ? '500px' : '0'}}>
                                {pillar.items.map(item => (
                                    <li key={item}>
                                        <a href="#" onClick={(e) => { e.preventDefault(); createWindow(item); }}>{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
                 <div className="sidebar-footer">
                    <button onClick={togglePartialCollapse} title="Contraer menú">
                        <Icons.ArrowLeft className="collapse-arrow w-5 h-5 flex-shrink-0" />
                        <span>Contraer</span>
                    </button>
                    <button onClick={() => setShowCloseAllConfirmation(true)} title="Cerrar todas las ventanas" className="close-all-btn">
                        <Icons.Trash className="w-5 h-5 flex-shrink-0" />
                        <span>Cerrar todo</span>
                    </button>
                </div>
            </aside>
            
            <main className="main-content">
                 <div className="relative w-full h-full overflow-hidden">
                    {windows.filter(w => !w.isMinimized).map(win => <Window key={win.id} win={win} onClose={requestCloseWindow} onMinimize={minimizeWindow} onFocus={focusWindow} onUpdate={updateWindow} isFocused={win.zIndex === maxZIndex} onAnimationEnd={handleAnimationEnd} visibleModules={visibleModules} toggleModuleVisibility={toggleModuleVisibility} users={internalUsers} onRegisterSuccess={handleRegisterUser} />)}
                 </div>
            </main>

            <div className="minimized-bar">
                {windows.filter(w => w.isMinimized).map(win => (
                    <div key={win.id} onClick={() => restoreWindow(win.id)} className="minimized-tab">
                        <span>{win.title}</span>
                         <button onClick={(e) => { e.stopPropagation(); requestCloseWindow(win.id); }} className="close-minimized">X</button>
                    </div>
                ))}
            </div>
            {windowToCloseId && (
                <div className="confirmation-modal-overlay">
                    <div className="confirmation-modal">
                        <h4>¿Estás seguro de que deseas cerrar esta ventana?</h4>
                        <div className="confirmation-modal-buttons">
                            <button onClick={handleCancelClose} className="cancel-btn">Cancelar</button>
                            <button onClick={handleConfirmClose} className="confirm-btn">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
            {showCloseAllConfirmation && (
                <div className="confirmation-modal-overlay">
                    <div className="confirmation-modal">
                        <h4>¿Estás seguro de que deseas cerrar TODAS las ventanas?</h4>
                         <p className="text-sm text-[var(--text-secondary)] mt-2">Esta acción no se puede deshacer.</p>
                        <div className="confirmation-modal-buttons">
                            <button onClick={() => setShowCloseAllConfirmation(false)} className="cancel-btn">Cancelar</button>
                            <button onClick={handleConfirmCloseAll} className="confirm-btn">Confirmar y Cerrar Todo</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;