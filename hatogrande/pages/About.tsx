import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, Heart, Leaf, FileText, Lock, ArrowRight, Award } from 'lucide-react';

const About: React.FC = () => {
    const { navigateTo } = useAppContext();

    return (
        <div 
            className="min-h-screen font-sans text-[#403434] overflow-x-hidden"
            style={{ 
                backgroundImage: `linear-gradient(rgba(255, 254, 249, 0.95), rgba(255, 254, 249, 0.95)), url('https://i.postimg.cc/YCdXmj2h/front-view-delicious-fresh-cheese.jpg')`,
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* 1. Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 sm:px-12 lg:px-24 border-b border-gray-100 bg-white/40">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-gray-400">Nuestra Trayectoria</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--color-dark)] leading-[1.05] tracking-tight mb-8"
                    >
                        Dedicada al Sabor <br className="hidden md:block" /> Original del Llano
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-500 max-w-2xl font-light leading-relaxed"
                    >
                        Desde 1985, Hato Grande ha sido sinónimo de tradición y calidad, cuidando cada detalle desde el campo hasta tu mesa.
                    </motion.p>
                </div>
            </section>

            {/* 2. Story Section */}
            <section className="py-24 px-6 sm:px-12 lg:px-24 w-full">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2 relative"
                    >
                        <div className="absolute -inset-4 bg-[var(--color-primary)] opacity-10 rounded-2xl -rotate-2" />
                        <img 
                            src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80" 
                            alt="Granja Hato Grande" 
                            className="relative w-full h-[50vh] md:h-[60vh] object-cover rounded-2xl shadow-2xl"
                        />
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden lg:block border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[var(--color-bg-soft)] rounded-full text-[var(--color-secondary)]">
                                    <Award size={32} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[var(--color-dark)]">35+</p>
                                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Años de Calidad</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2 flex flex-col gap-8"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-[var(--color-dark)] leading-tight">
                            Lácteos Hato Grande: Una Herencia de Pureza.
                        </h2>
                        <div className="flex flex-col gap-6 text-gray-500 text-base md:text-lg leading-relaxed font-light">
                            <p>
                                Somos una familia dedicada a producir los mejores lácteos, cuidando cada detalle desde el campo hasta tu mesa. Combinamos técnicas artesanales heredadas por generaciones con tecnología moderna para asegurar la frescura y pureza de cada producto.
                            </p>
                            <p>
                                Nuestro compromiso va más allá del sabor; se trata de preservar la cultura del llano colombiano y ofrecer nutrición real sin conservantes ni procesos industriales agresivos.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm text-sm font-medium">
                                <ShieldCheck className="text-[var(--color-primary)]" size={18} />
                                100% Natural
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm text-sm font-medium">
                                <Heart className="text-red-400" size={18} />
                                Producción Ética
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm text-sm font-medium">
                                <Leaf className="text-green-500" size={18} />
                                Sostenibilidad
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. Mission & Vision */}
            <section className="py-24 px-6 sm:px-12 lg:px-24 bg-white/30 backdrop-blur-sm border-y border-gray-100 w-full">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 md:p-14 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
                        >
                            <div className="w-14 h-14 bg-[var(--color-bg-soft)] rounded-2xl flex items-center justify-center text-[var(--color-secondary)] mb-8 group-hover:scale-110 transition-transform">
                                <Award size={32} />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">Nuestra Misión</h3>
                            <p className="text-gray-500 text-base md:text-lg leading-relaxed font-light">
                                Ofrecer productos lácteos de la más alta calidad, elaborados con leche pura y procesos artesanales, que nutran y deleiten a las familias colombianas, manteniendo siempre un compromiso con la sostenibilidad y el bienestar de nuestra comunidad y entorno.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 md:p-14 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
                        >
                            <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 mb-8 group-hover:scale-110 transition-transform">
                                <Leaf size={32} />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">Nuestra Visión</h3>
                            <p className="text-gray-500 text-base md:text-lg leading-relaxed font-light">
                                Ser la marca líder y de mayor confianza en productos lácteos artesanales a nivel nacional, reconocida por nuestro sabor inigualable, innovación constante y un modelo de negocio que inspira y genera un impacto positivo en el campo colombiano.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. Policies Section */}
            <section className="py-32 px-6 sm:px-12 lg:px-24 w-full">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-[var(--color-dark)] text-white rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-secondary)] opacity-10 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />
                        
                        <h3 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Transparencia y Confianza</h3>
                        <p className="text-stone-400 mb-12 max-w-xl mx-auto font-light leading-relaxed relative z-10">
                            En Hato Grande, nos tomamos en serio tu seguridad y privacidad tanto como la calidad de nuestros productos.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                            <a 
                                href="#" 
                                className="group flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-2xl transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <Lock size={24} className="text-[var(--color-primary)]" />
                                    </div>
                                    <span className="font-bold text-sm uppercase tracking-widest">Política de Privacidad</span>
                                </div>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a 
                                href="#" 
                                className="group flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-2xl transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <FileText size={24} className="text-[var(--color-primary)]" />
                                    </div>
                                    <span className="font-bold text-sm uppercase tracking-widest">Términos y Condiciones</span>
                                </div>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;

