import React, { createContext, useContext } from 'react';

export type Page = 'home' | 'products' | 'contact' | 'about' | 'login' | 'cart' | 'checkout' | 'account' | 'dashboard' | 'orion-login' | 'product-detail';

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string; // only for registration
}

export interface CartItem {
    id: number;
    variantId: string; // e.g., '1-500g'
    name: string;
    price: number;
    quantity: number;
    category: string;
    options: { [key: string]: string };
}

interface AppContextType {
    currentPage: Page;
    navigateTo: (page: Page) => void;
    currentUser: User | null;
    login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
    registerUser: (user: User) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    cart: CartItem[];
    addToCart: (product: any, quantity: number, options: any) => void;
    removeFromCart: (variantId: string) => void;
    updateCartQuantity: (variantId: string, newQuantity: number) => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    showProductDetail: (product: any) => void;
    clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = AppContext.Provider;

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
