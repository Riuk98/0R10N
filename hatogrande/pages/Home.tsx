import React from 'react';
import { useAppContext } from '../context/AppContext';
import { products, testimonials } from '../data';
import ProductIcon from '../components/ProductIcon';

const ProductCard: React.FC<{ product: any; }> = ({ product }) => {
    const { showProductDetail } = useAppContext();
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2" onClick={() => showProductDetail(product)}>
             <div className="relative cursor-pointer bg-gray-100">
                <div className="w-full h-56 flex items-center justify-center p-8">
                    <ProductIcon category={product.category} className="w-full h-full" />
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[var(--color-light-gray)] font-bold border-2 border-white px-4 py-2 rounded-full">Ver Detalle</span>
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                    {product.bestseller && <span className="bg-[var(--color-primary)] text-[var(--color-dark)] text-xs font-bold px-2 py-1 rounded-full shadow-md">MÁS VENDIDO</span>}
                    {product.offer && <span className="bg-[var(--color-accent)] text-[var(--color-dark)] text-xs font-bold px-2 py-1 rounded-full shadow-md">OFERTA</span>}
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-lg font-semibold text-[var(--color-dark)] truncate">{product.name}</h3>
                <p className="text-xl font-bold text-[var(--color-secondary)] mt-2">${product.price.toLocaleString('es-CO')}</p>
            </div>
        </div>
    );
};


const Home: React.FC = () => {
    const { navigateTo } = useAppContext();

    const bestsellers = products.filter(p => p.bestseller);
    const offers = products.filter(p => p.offer);

    return (
        <div className="">
            {/* Banners Section */}
            <section className="bg-white text-center py-3 text-[var(--color-text)] text-sm font-semibold">
                <p>¡Envío gratis en pedidos superiores a $100.000!</p>
            </section>

            {/* Hero Section */}
            <section 
                className="relative bg-cover bg-center text-white"
                style={{ backgroundImage: "url('https://i.postimg.cc/wBcYvM1c/A-como-esta-el-kilo-de-queso-en-Colombia.png')" }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                <div className="relative container mx-auto px-2 sm:px-4 lg:px-4 py-8 sm:py-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Left Column: Text Content */}
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                                <span className="block text-2xl md:text-3xl lg:text-4xl font-semibold opacity-90">Sabor y Tradición</span>
                                Directo del Campo
                            </h1>
                            <p className="mt-4 text-base md:text-lg max-w-xl mx-auto md:mx-0">
                                Descubre la frescura y calidad de nuestros productos lácteos, elaborados con amor y la mejor leche de Hato Grande.
                            </p>
                            <button 
                                onClick={() => navigateTo('products')} 
                                className="mt-6 px-8 py-3 bg-[var(--color-primary)] text-[var(--color-dark)] font-bold rounded-full hover:bg-[var(--color-accent)] transition-all duration-300 text-base transform hover:scale-105 shadow-lg"
                            >
                                Ver Productos
                            </button>
                        </div>

                        {/* Right Column: Image */}
                        <div className="flex justify-center md:justify-end items-center mt-5 md:mt-0">
                            <img 
                                src="https://i.postimg.cc/MZVdPpF7/Generated-Image-October-20-2025-3-45-PM-1.png"
                                alt="Empaque de producto Hato Grande" 
                                className="rounded-lg w-full max-w-md md:max-w-lg lg:max-w-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>
            
      
            {/* Bestsellers Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-[var(--color-dark)] mb-10">Nuestros Más Vendidos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bestsellers.slice(0, 3).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
            
             {/* Offers Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-[var(--color-dark)] mb-10">Ofertas Especiales</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                        {offers.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-[var(--color-dark)] mb-12">Lo que dicen nuestros clientes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map(testimonial => (
                            <div key={testimonial.id} className="bg-white p-8 rounded-xl text-center shadow-lg transition-transform hover:scale-105 border-2 border-transparent hover:border-[var(--color-primary)]">
                                <img src={testimonial.image} alt={testimonial.name} className="w-24 h-24 rounded-full mx-auto mb-5 border-4 border-white shadow-md" />
                                <p className="text-[var(--color-text)] italic mb-4">"{testimonial.quote}"</p>
                                <h4 className="font-semibold text-[var(--color-dark)]">{testimonial.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WhatsApp Floating Button */}
            <a href="https://wa.me/573101234567" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110 z-30" title="Chatea con nosotros">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.512 1.924 6.344l-1.651 6.022 6.05-1.623z" /></svg>
            </a>
        </div>
    );
};

export default Home;
