import React from 'react';
import { useAppContext } from '../context/AppContext';

const About: React.FC = () => {
    const { navigateTo } = useAppContext();
    return (
        <div className="">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-[var(--color-dark)]">Acerca de Nosotros</h1>
                    <div className="inline-block w-20 h-1 bg-[var(--color-primary)] mt-4"></div>
                </div>

                {/* Main Description */}
                <div className="max-w-4xl mx-auto bg-gray-50 p-8 sm:p-10 rounded-xl shadow-lg mb-12">
                    <h2 className="text-3xl font-bold text-center text-[var(--color-dark)] mb-4">Lácteos Hato Grande S.A.S</h2>
                     <p className="text-lg text-center text-[var(--color-text)]">
                        Desde 1985, Hato Grande ha sido sinónimo de tradición y calidad. Somos una familia dedicada a producir los mejores lácteos, cuidando cada detalle desde el campo hasta tu mesa. Combinamos técnicas artesanales heredadas por generaciones con tecnología moderna para asegurar la frescura y pureza de cada producto.
                    </p>
                </div>

                {/* Mission and Vision */}
                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-16">
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                        <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-3">Misión</h3>
                        <p className="text-[var(--color-text)]">
                           Ofrecer productos lácteos de la más alta calidad, elaborados con leche pura y procesos artesanales, que nutran y deleiten a las familias colombianas, manteniendo siempre un compromiso con la sostenibilidad y el bienestar de nuestra comunidad y entorno.
                        </p>
                    </div>
                     <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                        <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-3">Visión</h3>
                        <p className="text-[var(--color-text)]">
                           Ser la marca líder y de mayor confianza en productos lácteos artesanales a nivel nacional, reconocida por nuestro sabor inigualable, innovación constante y un modelo de negocio que inspira y genera un impacto positivo en el campo colombiano.
                        </p>
                    </div>
                </div>
                
                 {/* Policies */}
                <div className="text-center max-w-4xl mx-auto border-t pt-10">
                    <h3 className="text-xl text-[var(--color-dark)] mb-6">Conoce más sobre nuestros compromisos y regulaciones:</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="font-bold text-lg text-[var(--color-dark)]">Política de Privacidad</h4>
                            <a href="#" className="text-[var(--color-primary)] hover:underline mt-2 inline-block">Leer política</a>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                             <h4 className="font-bold text-lg text-[var(--color-dark)]">Términos y Condiciones</h4>
                            <a href="#" className="text-[var(--color-primary)] hover:underline mt-2 inline-block">Leer términos</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
