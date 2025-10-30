import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductIcon from './ProductIcon';

const CartSidebar: React.FC = () => {
    const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateCartQuantity, navigateTo } = useAppContext();

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigateTo('checkout');
    };

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsCartOpen(false)}
            ></div>
            <aside 
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-5 border-b">
                        <h2 className="text-xl font-bold text-[var(--color-dark)]">Carrito de Compras</h2>
                        <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-800">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-grow p-5 overflow-y-auto">
                        {cart.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10">
                                <p>Tu carrito está vacío.</p>
                                <button onClick={() => { setIsCartOpen(false); navigateTo('products'); }} className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-dark)] font-bold rounded hover:bg-[var(--color-accent)] transition-colors">
                                    Ver Productos
                                </button>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {cart.map(item => (
                                    <li key={item.variantId} className="flex items-start gap-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center p-2 flex-shrink-0">
                                            <ProductIcon category={item.category} className="w-full h-full" />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-sm text-[var(--color-dark)]">{item.name}</h3>
                                            <p className="text-xs text-gray-500 capitalize">{Object.values(item.options)[0]}</p>
                                            <p className="font-bold text-sm text-[var(--color-secondary)] mt-1">${item.price.toLocaleString('es-CO')}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border rounded-md">
                                                    <button onClick={() => updateCartQuantity(item.variantId, item.quantity - 1)} className="px-2 py-1 text-lg">-</button>
                                                    <span className="px-3 text-sm">{item.quantity}</span>
                                                    <button onClick={() => updateCartQuantity(item.variantId, item.quantity + 1)} className="px-2 py-1 text-lg">+</button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.variantId)} className="text-red-500 hover:text-red-700 text-xs font-semibold">ELIMINAR</button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="p-5 border-t">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-[var(--color-dark)]">Subtotal:</span>
                                <span className="text-xl font-bold text-[var(--color-dark)]">${subtotal.toLocaleString('es-CO')}</span>
                            </div>
                            <button onClick={handleCheckout} className="w-full py-3 bg-[var(--color-primary)] text-[var(--color-dark)] font-bold rounded-lg hover:bg-[var(--color-accent)] transition-colors text-lg">
                                Finalizar Compra
                            </button>
                             <p className="text-xs text-center text-gray-500 mt-2">Los gastos de envío se calculan en la pantalla de pago.</p>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default CartSidebar;