import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { products } from '../data'; // For related products
import ProductIcon from '../components/ProductIcon';

interface ProductDetailProps {
    product: any;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
    const { addToCart, navigateTo, showProductDetail } = useAppContext();
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState(product.options.values[0]);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product, quantity, { [product.options.type]: selectedOption });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    return (
        <div className="">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
                    {/* Product Image */}
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-center min-h-[300px]">
                        <ProductIcon category={product.category} className="w-full h-auto max-w-sm max-h-96" />
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-dark)] mb-3">{product.name}</h1>
                        <p className="text-2xl font-bold text-[var(--color-secondary)] mb-5">${product.price.toLocaleString('es-CO')}</p>
                        <p className="text-[var(--color-text)] leading-relaxed mb-6">{product.description}</p>

                        {/* Options */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[var(--color-dark)] mb-2 capitalize">{product.options.type}</label>
                            <div className="flex flex-wrap gap-3">
                                {product.options.values.map((value: string) => (
                                    <button
                                        key={value}
                                        onClick={() => setSelectedOption(value)}
                                        className={`px-4 py-2 border rounded-full text-sm font-semibold transition-all ${
                                            selectedOption === value
                                                ? 'bg-[var(--color-primary)] text-[var(--color-dark)] border-[var(--color-primary)]'
                                                : 'bg-white text-[var(--color-text)] border-gray-300 hover:border-gray-500'
                                        }`}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center border rounded-full">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-xl font-bold">-</button>
                                <span className="px-5 text-lg font-semibold">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-xl font-bold">+</button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 py-3 px-6 font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                                    isAdded ? 'bg-green-500 text-white' : 'bg-[var(--color-primary)] text-[var(--color-dark)] hover:bg-[var(--color-accent)]'
                                }`}
                            >
                                {isAdded ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        ¡Añadido!
                                    </>
                                ) : 'Añadir al Carrito'}
                            </button>
                        </div>

                         {/* Back to products button */}
                         <button onClick={() => navigateTo('products')} className="text-sm text-[var(--color-secondary)] hover:underline">
                            &larr; Volver a todos los productos
                        </button>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 pt-10 border-t">
                        <h2 className="text-2xl font-bold text-center text-[var(--color-dark)] mb-8">También te podría interesar</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(related => (
                                 <div key={related.id} className="bg-white rounded-lg shadow overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer" onClick={() => showProductDetail(related)}>
                                    <div className="relative bg-gray-100">
                                        <div className="w-full h-40 flex items-center justify-center p-4">
                                            <ProductIcon category={related.category} className="w-full h-full" />
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-semibold text-[var(--color-dark)] truncate">{related.name}</h3>
                                        <p className="text-md font-bold text-[var(--color-secondary)] mt-1">${related.price.toLocaleString('es-CO')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
