import React, { useState } from 'react';
import { products, categories } from '../data';
import { useAppContext } from '../context/AppContext';
import ProductIcon from '../components/ProductIcon';

// ProductCard component specific for this page
const ProductCard: React.FC<{ product: any }> = ({ product }) => {
    const { addToCart, showProductDetail } = useAppContext();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the detail view
        addToCart(product, 1, { [product.options.type]: product.options.values[0] });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    return (
        <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col"
        >
            <div className="relative cursor-pointer bg-gray-100" onClick={() => showProductDetail(product)}>
                 <div className="w-full h-56 flex items-center justify-center p-8">
                    <ProductIcon category={product.category} className="w-full h-full" />
                </div>
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 <div className="absolute top-2 right-2 flex flex-col gap-2">
                    {product.bestseller && <span className="bg-[var(--color-primary)] text-[var(--color-dark)] text-xs font-bold px-2 py-1 rounded-full shadow-md">MÁS VENDIDO</span>}
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors underline-offset-4 group-hover:underline">{product.name}</h3>
                <p className="text-[var(--color-text)] opacity-80 text-sm mt-1">{product.options.type}: {product.options.values.join(', ')}</p>
                <p className="text-xl font-bold text-[var(--color-secondary)] mt-4">${product.price.toLocaleString('es-CO')}</p>
                
                <div className="mt-auto pt-4 flex items-center gap-2">
                     <button onClick={() => showProductDetail(product)} className="flex-1 text-center px-4 py-2 border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] font-bold rounded hover:bg-[var(--color-secondary)] hover:text-[var(--color-light-gray)] transition-colors text-sm">
                        Ver más
                    </button>
                    <button 
                        onClick={handleAddToCart} 
                        className={`flex-1 text-center px-4 py-2 font-bold rounded transition-all duration-300 text-sm flex items-center justify-center gap-1 ${isAdded ? 'bg-green-500 text-white' : 'bg-[var(--color-primary)] text-[var(--color-dark)] hover:bg-[var(--color-accent)]'}`}
                    >
                        {isAdded ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                ¡Añadido!
                            </>
                        ) : (
                            'Añadir'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Products: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('todos');

    const filteredProducts = activeCategory === 'todos'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-center text-[var(--color-dark)] mb-4">Explora nuestros Productos</h1>
                
                {/* Category Filters */}
                <div className="flex justify-center flex-wrap gap-3 sm:gap-4 my-10 px-2">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-5 py-3 rounded-lg font-semibold transition-all duration-300 border-2 ${
                                activeCategory === category.id
                                    ? 'bg-[var(--color-primary)] text-[var(--color-dark)] border-[var(--color-primary)] shadow-lg'
                                    : 'bg-white text-[var(--color-text)] hover:bg-gray-100 hover:border-gray-400 border-gray-300'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;
