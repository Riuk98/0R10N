import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { ArrowRight, Plus, Minus, Star, Zap } from 'lucide-react';
import { UnifiedProduct } from '../../orion/data/inventoryData';

const CarouselCard: React.FC<{ product: UnifiedProduct }> = ({ product }) => {
    const { showProductDetail } = useAppContext();
    return (
        <div 
            onClick={() => showProductDetail(product)}
            className="w-[280px] h-[360px] rounded-2xl overflow-hidden relative flex-shrink-0 cursor-pointer border border-gray-100 group shadow-lg transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_32px_64px_rgba(0,0,0,0.15)]"
        >
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${product.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)]/90 via-[var(--color-dark)]/40 to-transparent" />
            
            {product.bestseller && (
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-dark)] font-bold text-[10px] shadow-lg animate-pulse z-10">
                    <Zap size={16} fill="currentColor" />
                </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-primary)] text-[var(--color-dark)] text-[10px] font-bold uppercase tracking-widest mb-3 border border-white/20">
                    {product.categoria}
                </span>
                <h4 className="text-2xl font-bold text-white line-clamp-1 mb-1 font-['Bebas_Neue'] tracking-wider leading-none">
                    {product.nombre}
                </h4>
                <p className="text-xs text-gray-300 font-light italic opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Sabor artesanal único · ${product.valorUnitario.toLocaleString('es-CO')}
                </p>
            </div>
        </div>
    );
};

const ProductCard: React.FC<{ product: UnifiedProduct; index: number }> = ({ product, index }) => {
    const { showProductDetail } = useAppContext();
    return (
        <motion.a 
            href="#" 
            onClick={(e) => { e.preventDefault(); showProductDetail(product); }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            viewport={{ once: true, margin: "-10%" }}
            className="flex flex-col h-full bg-white group cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
        >
            <div className="relative w-full aspect-[3/2] bg-gray-100 overflow-hidden">
                <img 
                    src={product.image || "https://images.unsplash.com/photo-1620188467120-5042ed1ce5ea?auto=format&fit=crop&w=800&q=80"} 
                    alt={product.nombre} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col p-3 bg-white border-t border-gray-100">
                <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-900 line-clamp-1">{product.nombre}</span>
                    <span className="text-[10px] font-bold text-[var(--color-secondary)] ml-2 transition-colors group-hover:text-[var(--color-primary)]">
                        ${product.valorUnitario.toLocaleString('es-CO')}
                    </span>
                </div>
                <span className="text-[9px] uppercase text-gray-400 font-bold tracking-widest">{product.categoria}</span>
            </div>
        </motion.a>
    );
};

const FAQItem: React.FC<{ question: string, answer: string, index: number }> = ({ question, answer, index }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col w-full border-b border-gray-200/60 last:border-0"
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-6 text-left hover:bg-white/50 transition-colors px-4 rounded-xl"
            >
                <span className="text-lg md:text-xl font-medium text-[#403434] pr-8 tracking-tight">{question}</span>
                <span className="text-gray-400 flex-shrink-0 transition-transform duration-300">
                    {isOpen ? <Minus size={24} /> : <Plus size={24} />}
                </span>
            </button>
            <motion.div 
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden px-4"
            >
                <p className="pb-6 text-gray-500 text-base md:text-lg max-w-3xl leading-relaxed">
                    {answer}
                </p>
            </motion.div>
        </motion.div>
    );
};

const Home: React.FC = () => {
    const { navigateTo, products } = useAppContext();
    const featuredProducts = products.filter(p => p.bestseller).slice(0, 4);
    
    // If not enough products are bestseller, show any 4
    const displayProducts = featuredProducts.length >= 4 ? featuredProducts : products.slice(0, 4);
    
    const stickySectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: stickySectionRef,
        offset: ["start end", "end start"]
    });

    const parallaxY1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const parallaxY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

    return (
        <div 
            className="bg-[var(--color-bg-main)] font-sans text-[var(--color-text)] overflow-clip min-h-screen"
            style={{ 
                backgroundImage: `linear-gradient(rgba(255, 254, 249, 0.95), rgba(255, 254, 249, 0.95)), url('https://i.postimg.cc/YCdXmj2h/front-view-delicious-fresh-cheese.jpg')`,
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* 1. Hero Section */}
            <section className="relative w-full h-[100svh] flex flex-col justify-end bg-black">
                <img 
                    src="https://i.postimg.cc/wBcYvM1c/A-como-esta-el-kilo-de-queso-en-Colombia.png" 
                    alt="Hato Grande Productos"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                
                {/* Hero Content */}
                <div className="relative z-10 w-full px-6 sm:px-12 lg:px-24 mb-16 lg:mb-24 flex flex-col justify-end">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-3xl flex flex-col items-start gap-6"
                    >
                        <button 
                            onClick={() => navigateTo('products')}
                            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full pl-4 pr-2 py-2 hover:bg-white/20 transition-colors shadow-2xl"
                        >
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-bg-brand)]">Más Productos</span>
                            <span className="w-px h-4 bg-white/30 block mx-1"></span>
                            <span className="text-xs font-semibold opacity-90">Ver el catálogo</span>
                            <div className="bg-white text-black p-1.5 rounded-full">
                                <ArrowRight size={14} strokeWidth={3} />
                            </div>
                        </button>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-bold text-[var(--color-bg-main)] leading-[1.05] tracking-tight">
                            Elaborado a Mano.<br />Calidad Intacta.
                        </h1>
                    </motion.div>

                    {/* Circular Action Button (Bottom Right) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                        className="hidden md:flex absolute bottom-24 right-12 lg:right-24 w-[70vh] h-[70vh] min-w-[300px] min-h-[300px] items-center justify-center drop-shadow-2xl pointer-events-none"
                    >
                        <img 
                            src="https://i.postimg.cc/MZVdPpF7/Generated-Image-October-20-2025-3-45-PM-1.png" 
                            alt="Logo Hato Grande" 
                            className="w-full h-full object-contain pointer-events-auto"
                        />
                    </motion.div>
                </div>
            </section>

            {/* 2 & 3. Unified Intro & Products Section */}
            <section id="products-intro" className="bg-white w-full flex flex-col border-t border-gray-100 relative overflow-hidden noise-texture">
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
                    
                    @keyframes scroll-left {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    @keyframes scroll-right {
                        0%   { transform: translateX(-50%); }
                        100% { transform: translateX(0); }
                    }
                    .noise-texture::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
                        pointer-events: none;
                        z-index: 5;
                        opacity: 0.15;
                    }
                `}</style>
                <div className="w-full bg-[var(--color-bg-soft)] py-3 px-6 flex items-center justify-center border-b border-yellow-200/30 relative z-10">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text)]">
                        ¡Envío gratis en pedidos superiores a $100.000!
                    </span>
                </div>
                
                <div className="pt-12 pb-16 px-6 sm:px-12 lg:px-24 w-full bg-[var(--color-bg-main)]">
                    <div className="flex flex-col gap-10 md:gap-14">
                        {/* Intro Message */}
                        <div className="flex flex-col items-center text-center">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Artesanía Pura</span>
                                <div className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                            </div>
                            
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="text-2xl md:text-4xl lg:text-5xl font-medium text-[var(--color-dark)] max-w-[22ch] leading-[1.1] tracking-tight"
                            >
                                Colección curada de quesos y lácteos artesanales
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="mt-4 text-gray-500 text-sm md:text-base max-w-xl leading-relaxed"
                            >
                                Del llano a tu mesa: productos frescos elaborados con técnicas tradicionales para un sabor inigualable.
                            </motion.p>
                        </div>

                        {/* Product Header & Grid transformed into Marquee */}
                        <div className="flex flex-col gap-12 relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
                                <div className="flex flex-col gap-2">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-primary)]">Infinite Selection</p>
                                    <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--color-dark)] font-['Bebas_Neue'] leading-[0.85] italic">
                                        Nuestros <br /> <em>Productos</em>
                                    </h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => navigateTo('products')}
                                        className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] bg-[var(--color-dark)] text-white px-8 py-4 rounded-full hover:bg-[var(--color-primary)] hover:text-[var(--color-dark)] transition-all shadow-xl"
                                    >
                                        Explorar Todo
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-8 w-full overflow-hidden">
                                {/* Row 1: Leftward */}
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                                    
                                    <div className="flex gap-6 w-max animate-[scroll-left_45s_linear_infinite] hover:[animation-play-state:paused] py-4">
                                        {[...products, ...products, ...products].slice(0, 15).map((product, idx) => (
                                            <CarouselCard key={`${product.id}-r1-${idx}`} product={product} />
                                        ))}
                                    </div>
                                </div>

                                {/* Row 2: Rightward */}
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                                    
                                    <div className="flex gap-6 w-max animate-[scroll-right_50s_linear_infinite] hover:[animation-play-state:paused] py-4">
                                        {[...products, ...products, ...products].reverse().slice(0, 15).map((product, idx) => (
                                            <CarouselCard key={`${product.id}-r2-${idx}`} product={product} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Sticky / Scrolling Parallax Section */}
            <section ref={stickySectionRef} className="bg-[var(--color-bg-main)] relative pt-32 pb-32 md:pb-[25vh] px-6 md:px-12 lg:px-24 w-full flex flex-col md:flex-row gap-12 lg:gap-24">
                {/* Left: Sticky Image */}
                <div className="w-full md:w-1/2 h-auto md:h-[90vh] md:sticky md:top-[5vh] flex flex-col justify-center self-start">
                    <img src="https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1000&q=80" alt="Promoción de Quesos" className="w-full h-full max-h-[80vh] object-cover rounded-2xl shadow-2xl" />
                </div>

                {/* Right: Scrolling Images and Text */}
                <div className="w-full md:w-1/2 flex flex-col items-end gap-16 md:gap-32 pt-12 md:pt-0">
                    <motion.div style={{ y: parallaxY1 }} className="w-full max-w-[85%] rounded-2xl overflow-hidden shadow-2xl border border-black/5 bg-white">
                        <img src="https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=1000&q=80" alt="Process" className="w-full h-auto aspect-[4/3] object-cover" />
                    </motion.div>
                    
                    <div className="w-full flex flex-col justify-center self-start md:my-8 lg:my-16">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text)] mb-6 block">Fabricado artesanalmente</span>
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium leading-[1.05] tracking-tight mb-10 text-[var(--color-dark)] max-w-[10ch]">
                            Dedicación en cada pieza.
                        </h2>
                        <div className="flex flex-col gap-6 text-[var(--color-text)] text-lg md:text-xl max-w-md font-light leading-relaxed">
                            <p>
                                Nuestra granja se dedica a mantener las prácticas artesanales vivas. Garantizamos que cada pedazo de queso que llega a su casa tenga el mismo sabor inconfundible de nuestras tierras.
                            </p>
                            <p>
                                Desde 1984 apoyando el comercio local, los pequeños agricultores colombianos y el trabajo de campo.
                            </p>
                        </div>
                    </div>

                    <motion.div style={{ y: parallaxY2 }} className="w-full max-w-[65%] rounded-2xl overflow-hidden shadow-2xl border border-black/5 -ml-6 md:ml-0 self-start bg-white">
                        <img src="https://images.unsplash.com/photo-1488330890490-c291cb96d15c?auto=format&fit=crop&w=800&q=80" alt="Cow" className="w-full h-auto aspect-square object-cover" />
                    </motion.div>

                    <motion.div style={{ y: parallaxY1 }} className="w-full rounded-2xl overflow-hidden shadow-2xl border border-black/5 mt-8 md:mt-0 bg-white">
                        <img src="https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=1200&q=80" alt="Farm" className="w-full h-auto aspect-[16/9] object-cover" />
                    </motion.div>
                </div>
            </section>

            {/* 2.5 Galería de Productos (Bento) */}
            <section id="bento" className="bg-[var(--color-bg-main)] pb-24 px-6 md:px-12 lg:px-24 w-full pt-24 border-t border-gray-200/50 flex justify-center">
                <div className="flex flex-col gap-4 md:gap-6 w-full max-w-7xl">
                    {/* Bento Row 1 */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-auto md:h-[50vh]">
                        {/* Small Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="w-full md:w-[35%] h-[40vh] md:h-full rounded-2xl overflow-hidden border border-black/5 relative group bg-[#f5f0e1]"
                        >
                            <img src="https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=800" alt="Campo" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        </motion.div>
                        
                        {/* Big Card */}
                        <motion.a 
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigateTo('products'); }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="w-full md:w-[65%] h-[45vh] md:h-full rounded-2xl overflow-hidden border border-black/5 relative group p-8 md:p-12 flex flex-col justify-between bg-[#f5f0e1]"
                        >
                            <img src="https://images.unsplash.com/photo-1620188467120-5042ed1ce5ea?auto=format&fit=crop&w=1200&q=80" alt="Queso Madurado" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-[#f5f0e1] bg-opacity-70 group-hover:bg-opacity-80 transition-colors duration-500" />
                            
                            <div className="relative z-10 max-w-sm md:max-w-md">
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[var(--color-dark)] leading-[1.15] tracking-tight">
                                    Conoce nuestras ediciones maduradas y frescas.
                                </h3>
                            </div>
                            <div className="relative z-10 inline-flex items-center gap-3">
                                <span className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">Ver Detalles</span>
                                <ArrowRight className="text-[var(--color-text)] group-hover:translate-x-2 transition-transform duration-300" size={20} strokeWidth={2.5} />
                            </div>
                        </motion.a>
                    </div>

                    {/* Bento Row 2 */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-auto md:h-[50vh]">
                        {/* Big Card */}
                        <motion.a 
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigateTo('products'); }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="w-full md:w-[65%] h-[45vh] md:h-full rounded-2xl overflow-hidden border border-black/5 relative group p-8 md:p-12 flex flex-col justify-between order-2 md:order-1 bg-[#f5f0e1]"
                        >
                            <img src="https://images.unsplash.com/photo-1620188467472-35dfcfb65b05?auto=format&fit=crop&w=1200&q=80" alt="Lácteos" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-[#f5f0e1] bg-opacity-70 group-hover:bg-opacity-80 transition-colors duration-500" />
                            
                            <div className="relative z-10 max-w-sm md:max-w-md">
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[var(--color-dark)] leading-[1.15] tracking-tight">
                                    Ideales para acompañar en cada momento del día.
                                </h3>
                            </div>
                            <div className="relative z-10 inline-flex items-center gap-3">
                                <span className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">Comprar Ahora</span>
                                <ArrowRight className="text-[var(--color-text)] group-hover:translate-x-2 transition-transform duration-300" size={20} strokeWidth={2.5} />
                            </div>
                        </motion.a>

                        {/* Small Card Action */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="w-full md:w-[35%] h-[40vh] md:h-full rounded-2xl overflow-hidden border border-black/5 relative group order-1 md:order-2 bg-[#f5f0e1]"
                        >
                            <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80" alt="Granja" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/50 transition-colors group-hover:bg-black/40" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button 
                                    onClick={() => navigateTo('about')}
                                    className="bg-white text-[var(--color-secondary)] px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center gap-3 hover:-translate-y-1 shadow-xl hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-[var(--color-primary)]"
                                >
                                    Conocer Más <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4.5 Testimonios Section */}
            <section className="bg-[var(--color-bg-main)] py-24 px-6 md:px-12 lg:px-24 w-full border-t border-gray-200/50">
                <div className="flex flex-col items-center mb-16 lg:mb-24">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6 block">Testimonios</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-center max-w-[20ch]">
                        Lo que dicen nuestros clientes
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { name: "María Gómez", text: "Los mejores quesos madurados que he probado. La calidad es increíblemente consistente y el sabor es único. ¡Altamente recomendados a cualquier amante del queso!" },
                        { name: "Carlos Ruiz", text: "Me encanta saber que estoy apoyando productos locales artesanales. El queso fresco para el desayuno de los domingos se ha vuelto una tradición en mi hogar." },
                        { name: "Ana Martínez", text: "Excelente atención y productos de primera. El empaque cuida todos los detalles y la entrega fue muy rápida. Definitivamente volveré a comprar." }
                    ].map((testimonial, idx) => (
                        <div key={idx} className="bg-[#fcfcfc] p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6 hover:shadow-md transition-shadow">
                            <div className="flex text-[var(--color-primary)] gap-1">
                                {[1,2,3,4,5].map(star => <Star key={star} size={18} fill="currentColor" />)}
                            </div>
                            <p className="text-gray-600 text-lg italic leading-relaxed flex-grow">
                                "{testimonial.text}"
                            </p>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--color-bg-soft)] flex items-center justify-center text-[var(--color-secondary)] font-bold text-lg">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <span className="font-medium text-[var(--color-secondary)]">{testimonial.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. FAQ Section */}
            <section className="bg-[var(--color-bg-main)] py-32 px-6 md:px-12 lg:px-24 w-full flex flex-col items-center">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-medium text-center mb-16 tracking-tight"
                >
                    Preguntas Frecuentes
                </motion.h2>

                <div className="w-full flex flex-col gap-2 bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100">
                    <FAQItem 
                        index={1}
                        question="¿Cuál es la frescura de sus productos?"
                        answer="Nuestros productos lácteos se elaboran diariamente y se procesan de forma artesanal para garantizar que lleguen a su mesa tan frescos como si estuviera en la misma granja, sin conservantes químicos."
                    />
                    <FAQItem 
                        index={2}
                        question="¿Realizan envíos a nivel nacional?"
                        answer="Sí, realizamos envíos a todo el territorio nacional asegurándonos de usar empaques especiales de cadena de frío para que el queso madurado y fresco llegue en óptimas condiciones y mantenga sus sabores intactos."
                    />
                    <FAQItem 
                        index={3}
                        question="¿Venden al por mayor para negocios?"
                        answer="Claro que sí. Tenemos condiciones especiales y descuentos corporativos para restaurantes, hoteles y negocios locales que requieran volúmenes mayores. Por favor contáctenos a nuestro WhatsApp para más información."
                    />
                    <FAQItem 
                        index={4}
                        question="¿Tienen políticas de devolución?"
                        answer="Al ser productos perecederos, no podemos aceptar devoluciones en lácteos abiertos o manipulados, a menos que presenten algún problema de calidad comprobable el día de la entrega."
                    />
                </div>
            </section>
            
            {/* WhatsApp Floating Button */}
            <a 
                href="https://wa.me/573101234567" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#1EBE5D] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 z-50 flex items-center justify-center" 
                title="Chatea con nosotros"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.512 1.924 6.344l-1.651 6.022 6.05-1.623z" />
                </svg>
            </a>
        </div>
    );
};

export default Home;
