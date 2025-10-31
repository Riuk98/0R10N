


import React, { useState, useCallback, useEffect } from 'react';

// Orion components
import OrionLogin from './orion/components/Login';
import OrionDashboard from './orion/components/Dashboard';
import OrionPreloader from './orion/components/Preloader';

// Hato Grande components and pages
import Header from './hatogrande/components/Header';
import Footer from './hatogrande/components/Footer';
import CartSidebar from './hatogrande/components/CartSidebar';
import Home from './hatogrande/pages/Home';
import Products from './hatogrande/pages/Products';
import Contact from './hatogrande/pages/Contact';
import About from './hatogrande/pages/About';
import LoginRegister from './hatogrande/pages/LoginRegister';
import Checkout from './hatogrande/pages/Checkout';
import Account from './hatogrande/pages/Account';
import ProductDetail from './hatogrande/pages/ProductDetail';


// Context
import { AppProvider, Page, User, CartItem } from './hatogrande/context/AppContext';

const USER_STORAGE_KEY = 'hatoGrandeClientes';

function App() {
    // Orion state
    const [isOrionLoggedIn, setIsOrionLoggedIn] = useState(false);
    const [showOrionPreloader, setShowOrionPreloader] = useState(false);
    const [isShowingLoginPreloader, setIsShowingLoginPreloader] = useState(false);


    // Hato Grande state
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [users, setUsers] = useState<User[]>(() => {
        try {
            const storedUsers = localStorage.getItem(USER_STORAGE_KEY);
            return storedUsers ? JSON.parse(storedUsers) : [];
        } catch (error) {
            console.error("Failed to parse users from localStorage", error);
            return [];
        }
    });
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    
    // Effect to save users to localStorage whenever the list changes
    useEffect(() => {
        try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
        } catch (error) {
            console.error("Failed to save users to localStorage", error);
        }
    }, [users]);

    // Effect to manage global body styles based on the current app view
    useEffect(() => {
        const HATO_GRANDE_BG_COLOR = '#e5ddc1';
        const isHatoGrandeActive = currentPage !== 'orion-login' && !isOrionLoggedIn && !showOrionPreloader && !isShowingLoginPreloader;

        if (isHatoGrandeActive) {
            document.body.style.backgroundColor = HATO_GRANDE_BG_COLOR;
            // Clean up any lingering classes from the Orion module to prevent style conflicts
            document.body.classList.remove('dark-mode', 'sidebar-collapsed', 'sidebar-force-open', 'sidebar-partially-collapsed');
        } else {
            // When in Orion view, remove the inline style to let Orion's CSS control the background
            document.body.style.backgroundColor = '';
        }
        
        // Cleanup on component unmount
        return () => {
            document.body.style.backgroundColor = '';
        }
    }, [currentPage, isOrionLoggedIn, showOrionPreloader, isShowingLoginPreloader]);


    // Navigation logic
    const navigateTo = useCallback((page: Page) => {
        if (page === 'orion-login') {
            setShowOrionPreloader(true);
            return;
        }
        setCurrentPage(page);
        window.scrollTo(0, 0);
        if (page !== 'product-detail') {
            setSelectedProduct(null);
        }
    }, []);

    // Auth logic for Hato Grande
    const login = useCallback(async (credentials: { email: string; password: string }): Promise<{ success: boolean; message?: string }> => {
        // --- SIMULACIÓN DE LLAMADA A BACKEND ---
        // En una aplicación real, el inicio de sesión debe validarse contra un backend
        // que tenga acceso seguro a la base de datos PostgreSQL.
        console.log("Enviando credenciales de login al backend:", credentials.email);

        try {
            // EJEMPLO DE CÓDIGO REAL:
            // const response = await fetch('/api/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(credentials),
            // });

            // if (!response.ok) {
            //     return { success: false, message: "Usuario o contraseña incorrectos." };
            // }
            
            // const loggedInUser = await response.json(); // El backend devolvería los datos del usuario.

            // --- Simulación para que la app funcione ---
            // Simulamos la verificación contra nuestra "base de datos" local (localStorage).
            const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password);

            if (user) {
                const { password, ...userWithoutPassword } = user;
                setCurrentUser(userWithoutPassword);
                navigateTo('home');
                return { success: true };
            } else {
                return { success: false, message: "Los datos de ingreso no existen o son incorrectos, por favor verificar los datos e intentar nuevamente" };
            }

        } catch (error) {
            console.error("Error al conectar con el backend (simulado):", error);
            return { success: false, message: "No se pudo conectar con el servidor. Inténtalo más tarde." };
        }
    }, [users, navigateTo]);

    const registerUser = useCallback(async (newUser: User): Promise<{ success: boolean; message?: string }> => {
        // --- SIMULACIÓN DE LLAMADA A BACKEND ---
        // En una aplicación real, no se puede conectar directamente a PostgreSQL desde el frontend.
        // Se debe enviar la información a un endpoint de la API en tu backend.
        // El backend se encargaría de validar y guardar el usuario en la base de datos PostgreSQL.
        console.log("Enviando datos de registro al backend:", newUser);

        try {
            // EJEMPLO DE CÓDIGO REAL:
            // const response = await fetch('/api/register', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(newUser),
            // });

            // if (!response.ok) {
            //     const errorData = await response.json();
            //     // El backend debería devolver un mensaje de error claro, por ejemplo si el email ya existe.
            //     return { success: false, message: errorData.message || "Error al registrar el usuario." };
            // }
            
            // const registeredUser = await response.json(); // El backend devolvería el usuario creado (sin la contraseña).

            // --- Simulación para que la app funcione ---
            // El backend se encargaría de verificar si el correo ya existe.
            // Simulamos esa lógica aquí para que la app siga funcionando como se espera.
            const existingUser = users.find(u => u.email.toLowerCase() === newUser.email.toLowerCase());
            if (existingUser) {
                return { success: false, message: "Este correo electrónico ya está registrado." };
            }

            // Si la llamada al backend fuera exitosa, actualizamos el estado local para reflejar el cambio en la UI.
            const { password, ...registeredUser } = newUser;
            setUsers(prevUsers => [...prevUsers, newUser]); // Guardamos el usuario con contraseña en nuestra simulación local
            setCurrentUser(registeredUser); // Establecemos el usuario actual sin la contraseña
            navigateTo('home');
            
            return { success: true };

        } catch (error) {
            console.error("Error al conectar con el backend (simulado):", error);
            return { success: false, message: "No se pudo conectar con el servidor. Inténtalo más tarde." };
        }
    }, [users, navigateTo]);

    const logout = useCallback(() => {
        setCurrentUser(null);
        navigateTo('home');
    }, [navigateTo]);

    // Cart logic
    const addToCart = useCallback((product: any, quantity: number, options: any) => {
        setCart(prevCart => {
            const variantId = `${product.id}-${options[product.options.type]}`;
            const existingItem = prevCart.find(item => item.variantId === variantId);

            if (existingItem) {
                return prevCart.map(item =>
                    item.variantId === variantId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [
                    ...prevCart,
                    {
                        id: product.id,
                        variantId,
                        name: product.name,
                        price: product.price,
                        quantity,
                        category: product.category,
                        options,
                    },
                ];
            }
        });
        setIsCartOpen(true);
    }, []);
    
    const removeFromCart = useCallback((variantId: string) => {
        setCart(prevCart => prevCart.filter(item => item.variantId !== variantId));
    }, []);

    const updateCartQuantity = useCallback((variantId: string, newQuantity: number) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.variantId === variantId ? { ...item, quantity: newQuantity } : item
            ).filter(item => item.quantity > 0)
        );
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const showProductDetail = useCallback((product: any) => {
        setSelectedProduct(product);
        navigateTo('product-detail');
    }, [navigateTo]);


    // Orion Login/Logout handlers
    const handleOrionLoginSuccess = () => {
        setIsShowingLoginPreloader(true);
    };

    const handleOrionLogout = () => {
        sessionStorage.removeItem('orionCurrentUser');
        setIsOrionLoggedIn(false);
        navigateTo('home'); 
    };

    const handleNavToLoginPreloadComplete = () => {
        setShowOrionPreloader(false);
        setCurrentPage('orion-login');
    };
    
    const handleLoginToDashboardPreloadComplete = () => {
        setIsShowingLoginPreloader(false);
        setIsOrionLoggedIn(true);
    };

    // Render logic
    const renderHatoGrandePage = () => {
        let pageContent;
        switch (currentPage) {
            case 'home': pageContent = <Home />; break;
            case 'products': pageContent = <Products />; break;
            case 'contact': pageContent = <Contact />; break;
            case 'about': pageContent = <About />; break;
            case 'login': pageContent = <LoginRegister />; break;
            case 'checkout': pageContent = <Checkout />; break;
            case 'account': pageContent = <Account />; break;
            case 'product-detail': pageContent = selectedProduct ? <ProductDetail product={selectedProduct} /> : <Products />; break;
            default: pageContent = <Home />;
        }
        
        return (
             <div className="hatogrande-app flex flex-col min-h-screen">
                <div className="relative z-[1] flex flex-col flex-grow">
                    <Header />
                    <main className="flex-grow">{pageContent}</main>
                    <Footer />
                </div>
                <CartSidebar />
            </div>
        );
    };
    
    const renderContent = () => {
        if (showOrionPreloader) {
            return <OrionPreloader onLoadingComplete={handleNavToLoginPreloadComplete} />;
        }

        if (isShowingLoginPreloader) {
            return <OrionPreloader onLoadingComplete={handleLoginToDashboardPreloadComplete} />;
        }

        if (isOrionLoggedIn) {
            return <OrionDashboard onLogout={handleOrionLogout} />;
        }
        
        if (currentPage === 'orion-login') {
            return (
                <div className="orion-login-background">
                     <OrionLogin onLoginSuccess={handleOrionLoginSuccess} />
                </div>
            );
        }
        
        return renderHatoGrandePage();
    };

    // The context value
    const appContextValue = {
        currentPage,
        navigateTo,
        currentUser,
        login,
        registerUser,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        isCartOpen,
        setIsCartOpen,
        showProductDetail,
        clearCart,
    };
    
    const GlobalStyles =  `
        :root {
            --color-primary: #D9B814;      /* Main Yellow */
            --color-secondary: #594302;     /* Dark Brown/Olive */
            --color-accent: #D9A50B;       /* Darker Yellow/Gold */
            --color-dark: #403434;         /* Dark Gray/Brown for titles */
            --color-light-gray: #D9D1D0;   /* Light Gray for text on dark backgrounds */
            --color-text: #403434;         /* Dark Gray/Brown for body text */
            --color-background: #e5ddc1;   /* Light yellow background */
        }
    `;

    return (
        <AppProvider value={appContextValue}>
            <style>{GlobalStyles}</style>
            {renderContent()}
        </AppProvider>
    );
}

export default App;