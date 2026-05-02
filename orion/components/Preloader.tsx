import React, { useEffect, useState, useRef } from 'react'; // Importamos hooks básicos de React para efectos, estado y referencias
import { motion } from 'motion/react'; // Importamos la librería motion para animaciones fluidas
import { Loader2 } from 'lucide-react'; // Importamos el icono de carga de lucide-react

/**
 * Interface para las propiedades del componente OrionPreloader
 */
interface PreloaderProps {
    onLoadingComplete: () => void; // Función callback que se ejecuta al terminar la carga
}

/**
 * BeamsBackground Component
 * Renderiza una animación de fondo con rayos de luz en movimiento usando Canvas.
 */
const BeamsBackground: React.FC = () => { // Definimos el componente funcional para el fondo animado
    const canvasRef = useRef<HTMLCanvasElement>(null); // Creamos una referencia para acceder al elemento canvas del DOM

    useEffect(() => { // Hook para inicializar y gestionar la animación del canvas al montar el componente
        const canvas = canvasRef.current; // Obtenemos el elemento canvas actual de la referencia
        if (!canvas) return; // Si el canvas no existe, salimos de la función
        const ctx = canvas.getContext('2d'); // Obtenemos el contexto 2D para dibujar en el canvas
        if (!ctx) return; // Si no hay contexto, salimos de la función
        
        let beams: any[] = []; // Array para almacenar los objetos que representan cada rayo de luz
        let animationFrameId: number; // Variable para almacenar el ID de la solicitud de animación

        // Configuración de los rayos de luz
        const config = {
            beamCount: 25, // Cantidad total de rayos de luz en pantalla
            speed: 1.2, // Velocidad base de movimiento de los rayos
            hueBase: 220, // Tono base de color (Cyan/Azul)
            width: 20, // Ancho base de cada rayo
            blur: 8 // Nivel de desenfoque aplicado al canvas
        };

        const resizeCanvas = () => { // Función para ajustar el tamaño del canvas al contenedor
            const rect = canvas.parentElement?.getBoundingClientRect(); // Obtenemos las dimensiones del padre
            if (!rect) return; // Si no hay dimensiones, salimos
            // Escalado para resoluciones nativas (Retina/High DPI)
            canvas.width = rect.width * window.devicePixelRatio; // Ajustamos el ancho interno del canvas
            canvas.height = rect.height * window.devicePixelRatio; // Ajustamos el alto interno del canvas
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio); // Escalamos el contexto para nitidez
            canvas.style.width = '100%'; // El estilo CSS siempre al 100%
            canvas.style.height = '100%'; // El estilo CSS siempre al 100%
        };

        const createBeam = () => { // Función para crear un objeto de rayo individual
            const width = canvas.offsetWidth; // Ancho visible del canvas
            const height = canvas.offsetHeight; // Alto visible del canvas
            return {
                x: Math.random() * width, // Posición X aleatoria
                y: (Math.random() + 0.2) * height, // Posición Y aleatoria
                width: config.width + Math.random() * config.width, // Ancho aleatorio basado en config
                length: height * 9, // Longitud del rayo (larga para efecto de fondo)
                angle: -35 + Math.random() * 10, // Ángulo de inclinación aleatorio
                speed: config.speed * (0.6 + Math.random() * 0.8), // Velocidad individual aleatoria
                opacity: 0.2 + Math.random() * 0.3, // Opacidad base aleatoria
                hue: config.hueBase + Math.random() * 30, // Color individual dentro del rango
                pulse: Math.random() * Math.PI * 2, // Fase inicial de la pulsación
                pulseSpeed: 0.04 + Math.random() * 0.06 // Velocidad de la pulsación de opacidad
            };
        };

        const drawBeam = (beam: any) => { // Función para dibujar un rayo específico en el canvas
            ctx.save(); // Guardamos el estado actual del contexto
            ctx.translate(beam.x, beam.y); // Movemos el origen al punto del rayo
            ctx.rotate((beam.angle * Math.PI) / 180); // Rotamos el contexto según el ángulo
            
            const pulsingOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2); // Calculamos opacidad con seno
            const gradient = ctx.createLinearGradient(0, 0, 0, beam.length); // Creamos gradiente lineal
            
            const color = (opacity: number) => `hsla(${beam.hue}, 90%, 60%, ${opacity})`; // Función de ayuda para color HSL
            
            gradient.addColorStop(0, color(0)); // Inicio del gradiente (transparente)
            gradient.addColorStop(0.4, color(pulsingOpacity)); // Parte brillante inicial
            gradient.addColorStop(0.6, color(pulsingOpacity)); // Parte brillante final
            gradient.addColorStop(1, color(0)); // Fin del gradiente (transparente)
            
            ctx.fillStyle = gradient; // Asignamos el gradiente al estilo de relleno
            ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length); // Dibujamos el rectángulo del rayo
            ctx.restore(); // Restauramos el estado del contexto
        };

        const animate = () => { // Bucle principal de animación
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiamos el canvas antes de cada frame
            ctx.filter = `blur(${config.blur}px)`; // Aplicamos el filtro de desenfoque configurado
            
            beams.forEach(beam => { // Iteramos sobre cada rayo
                beam.y -= beam.speed; // Movemos el rayo hacia arriba
                beam.pulse += beam.pulseSpeed; // Avanzamos la fase de pulsación
                
                if (beam.y + beam.length < -100) { // Si el rayo sale completamente de la pantalla por arriba
                    beam.y = canvas.offsetHeight + 100; // Lo reposicionamos debajo para que reaparezca
                    beam.x = Math.random() * canvas.offsetWidth; // Cambiamos su posición X aleatoriamente
                }
                drawBeam(beam); // Dibujamos el rayo actualizado
            });
            
            animationFrameId = requestAnimationFrame(animate); // Solicitamos el siguiente frame de animación
        };

        window.addEventListener('resize', resizeCanvas); // Escuchamos cambios de tamaño de ventana
        resizeCanvas(); // Ejecutamos el redimensionamiento inicial
        beams = Array.from({ length: config.beamCount }, createBeam); // Inicializamos el array de rayos
        
        animate(); // Iniciamos el bucle de animación

        return () => { // Función de limpieza al desmontar
            window.removeEventListener('resize', resizeCanvas); // Quitamos el listener de redimensionamiento
            cancelAnimationFrame(animationFrameId); // Cancelamos la solicitud de animación pendiente
        };
    }, []); // Array de dependencias vacío para ejecutar solo una vez al montar

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />; // Retornamos el elemento canvas
};

/**
 * OrionPreloader Component
 * Componente principal que muestra el logo y la barra de progreso de carga.
 */
const OrionPreloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => { // Definimos el componente con sus props
    const [percentage, setPercentage] = useState(0); // Estado para controlar el porcentaje de carga (0-100)

    useEffect(() => { // Hook para simular el proceso de carga real o con temporizador
        const DURATION = 9000; // Duración total de la carga en milisegundos

        const completeTimer = setTimeout(() => { // Temporizador para finalizar la carga
            onLoadingComplete(); // Ejecutamos el callback de finalización
        }, DURATION + 600); // Añadimos un pequeño margen después de llegar al 100%

        const percentageInterval = setInterval(() => { // Intervalo para incrementar el porcentaje progresivamente
            setPercentage(prev => { // Función de actualización basada en el estado anterior
                const next = prev + 1; // Incrementamos en 1
                if (next > 100) { // Si llegamos a 100, detenemos el intervalo
                    clearInterval(percentageInterval); // Limpiamos el intervalo
                    return 100; // Devolvemos 100
                }
                return next; // Devolvemos el nuevo valor incrementado
            });
        }, DURATION / 100); // Calculamos el tiempo por cada 1% para que dure exactamente DURATION

        return () => { // Función de limpieza al desmontar
            clearTimeout(completeTimer); // Cancelamos el temporizador de finalización
            clearInterval(percentageInterval); // Limpiamos el intervalo de porcentaje
        };
    }, [onLoadingComplete]); // Re-ejecutar si la función callback cambia

    return (
        <div className="fixed inset-0 z-[9999] bg-[#0B0B0B] flex flex-col items-center justify-center overflow-hidden font-sans"> {/* Contenedor principal a pantalla completa */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0"> {/* Capa de fondo absoluto */}
                <BeamsBackground /> {/* Insertamos el fondo de rayos animados */}
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6"> {/* Contenedor de contenido central */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} // Estado inicial para animación de entrada
                    animate={{ opacity: 1, y: 0 }} // Estado final animado
                    transition={{ duration: 0.6, ease: "easeOut" }} // Configuración de la transición
                    className="text-center w-full"
                >
                    <img 
                        src='https://i.postimg.cc/CxKZJXKz/logo.gif' // Fuente de la imagen del logo gif
                        alt="Orion ERP Logo" // Texto alternativo para accesibilidad
                        className="w-72 mx-auto mb-12 drop-shadow-[0_0_15px_rgba(24,190,219,0.3)]" // Estilos y sombra brillante
                    />

                    <div className="mb-8 relative w-full flex flex-col items-center"> {/* Contenedor de barra de progreso */}
                        <div className="flex items-center justify-between w-full mb-3 px-1"> {/* Textos arriba de la barra */}
                            <span className="text-[#18bedb] text-sm font-bold tracking-widest uppercase">Cargando Módulos</span> {/* Etiqueta de estado */}
                            <span className="text-white text-sm font-bold">{percentage}%</span> {/* Indicador numérico actual */}
                        </div>
                        
                        <div className="w-full h-1.5 bg-[#143e88] rounded-full overflow-hidden"> {/* Fondo de la barra de progreso */}
                            <motion.div 
                                className="h-full bg-[#18bedb] rounded-full" // Color de la barra activa
                                initial={{ width: "0%" }} // Comienza sin ancho
                                animate={{ width: `${percentage}%` }} // Se estira según el porcentaje actual
                                transition={{ duration: 0.1, ease: "linear" }} // Transición suave y lineal
                            />
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0 }} // Animación de aparición suave para el texto extra
                        animate={{ opacity: 1 }} // Estado visible
                        transition={{ delay: 0.4, duration: 0.5 }} // Retraso para que el logo aparezca primero
                        className="flex items-center justify-center gap-2 text-blue-200/70" // Estilos de contenedor flex
                    >
                        <Loader2 className="animate-spin w-4 h-4" /> {/* Icono de spinner rotando */}
                        <span className="text-xs tracking-wider uppercase font-medium">Iniciando plataforma segura...</span> {/* Mensaje secundario */}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrionPreloader; // Exportación por defecto para usar en el resto de la aplicación
