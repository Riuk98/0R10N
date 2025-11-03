import React from 'react';
import { useAppContext } from '../context/AppContext';

const About: React.FC = () => {
    const { navigateTo } = useAppContext();
    return (
        <div className="hg-auth">
            <div className="hg-backdrop" aria-hidden="true">
                <div className="hg-backdrop__sun" />
                <div className="hg-backdrop__hill hg-backdrop__hill--near" />
                <div className="hg-backdrop__hill hg-backdrop__hill--far" />
                <div className="hg-backdrop__grain" />
            </div>
            <div className="hg-stage">
                <div className="hg-about">
                    <div className="hg-hero">
                        <h1>Acerca de Nosotros</h1>
                        <div className="hg-underline" />
                    </div>
                    <div className="hg-glass">
                        <h2>Lácteos Hato Grande S.A.S</h2>
                        <p>
                            Desde 1985, Hato Grande ha sido sinónimo de tradición y calidad. Somos una familia dedicada a producir los mejores lácteos, cuidando cada detalle desde el campo hasta tu mesa. Combinamos técnicas artesanales heredadas por generaciones con tecnología moderna para asegurar la frescura y pureza de cada producto.
                        </p>
                    </div>
                    <div className="hg-grid-2">
                        <div className="hg-glass">
                            <h3>Misión</h3>
                            <p>
                                Ofrecer productos lácteos de la más alta calidad, elaborados con leche pura y procesos artesanales, que nutran y deleiten a las familias colombianas, manteniendo siempre un compromiso con la sostenibilidad y el bienestar de nuestra comunidad y entorno.
                            </p>
                        </div>
                        <div className="hg-glass">
                            <h3>Visión</h3>
                            <p>
                                Ser la marca líder y de mayor confianza en productos lácteos artesanales a nivel nacional, reconocida por nuestro sabor inigualable, innovación constante y un modelo de negocio que inspira y genera un impacto positivo en el campo colombiano.
                            </p>
                        </div>
                    </div>
                    <div className="hg-glass">
                        <h3>Compromisos y regulaciones</h3>
                        <div className="hg-policies">
                            <div>
                                <h4>Política de Privacidad</h4>
                                <a href="#">Leer política</a>
                            </div>
                            <div>
                                <h4>Términos y Condiciones</h4>
                                <a href="#">Leer términos</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .hg-auth { position: relative; min-height: calc(100vh - 160px); display: flex; align-items: center; justify-content: center; padding: 48px 16px; overflow: hidden; }
                .hg-stage { position: relative; z-index: 2; width: 100%; max-width: 1100px; }
                .hg-backdrop { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
                .hg-backdrop__sun { position: absolute; width: 520px; height: 520px; left: -120px; top: -160px; background: radial-gradient(circle at 60% 50%, rgba(217,184,20,0.35), rgba(217,165,11,0.15) 45%, rgba(217,165,11,0.05) 70%, transparent 75%); filter: blur(2px); border-radius: 50%; }
                .hg-backdrop__hill { position: absolute; left: -10%; right: -10%; height: 38%; bottom: -8%; background: linear-gradient(180deg, rgba(89,67,2,0.15), rgba(89,67,2,0.28)); border-top-left-radius: 50% 100%; border-top-right-radius: 50% 100%; }
                .hg-backdrop__hill--far { transform: translateY(18px) scale(1.08); opacity: 0.65; }
                .hg-backdrop__hill--near { transform: translateY(0); opacity: 0.9; }
                .hg-backdrop__grain { position: absolute; inset: 0; background-image: linear-gradient(transparent 96%, rgba(0,0,0,0.02) 100%), radial-gradient(rgba(0,0,0,0.02) 1px, transparent 1px); background-size: 100% 6px, 6px 6px; mix-blend-mode: multiply; opacity: 0.6; }
                .hg-about { display: flex; flex-direction: column; gap: 16px; }
                .hg-hero { text-align: center; margin-bottom: 6px; }
                .hg-hero h1 { margin: 0; font-size: 40px; color: var(--color-dark); font-weight: 800; }
                .hg-underline { width: 84px; height: 4px; background: var(--color-primary); border-radius: 999px; margin: 10px auto 0; }
                .hg-glass { background: linear-gradient(135deg, rgba(255,255,255,0.58), rgba(255,255,255,0.36)); border: 1px solid rgba(255,255,255,0.35); box-shadow: 0 20px 50px rgba(64,52,52,0.16), inset 0 1px 0 rgba(255,255,255,0.4); backdrop-filter: saturate(120%) blur(14px); -webkit-backdrop-filter: saturate(120%) blur(14px); border-radius: 16px; padding: 22px; }
                .hg-glass h2, .hg-glass h3 { margin: 0 0 8px; color: var(--color-dark); }
                .hg-glass p { margin: 0; color: var(--color-text); }
                .hg-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .hg-policies { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .hg-policies h4 { margin: 0; color: var(--color-dark); }
                .hg-policies a { color: var(--color-primary); text-decoration: none; font-weight: 700; }
                .hg-policies a:hover { text-decoration: underline; }
                @media (max-width: 960px) { .hg-grid-2, .hg-policies { grid-template-columns: 1fr; } .hg-hero h1 { font-size: 32px; } }
            `}</style>
        </div>
    );
};

export default About;
