
import React, { useState, useEffect } from 'react';
// FIX: Refactored to use styled-components to resolve style parsing errors and align with project patterns.
import styled, { keyframes } from 'styled-components';

// Define la estructura de datos para una única onda (ripple).
interface Ripple {
    key: number; // Identificador único para que React pueda rastrear cada onda en la lista.
    top: number;   // Posición vertical inicial (coordenada Y).
    left: number;  // Posición horizontal inicial (coordenada X).
}

// Define las propiedades (props) que el componente puede recibir para personalizar el efecto.
interface RippleEffectProps {
    color?: string;     // Color de la onda.
    duration?: number;  // Duración de la animación en segundos.
    size?: number;      // Tamaño final de la onda en píxeles.
    interval?: number;  // Tiempo en milisegundos entre la creación de cada nueva onda.
}

// Define los pasos de la animación de la onda.
const rippleAnimation = (size: number) => keyframes`
    /* Estado inicial de la animación. */
    0% {
        width: 0;
        height: 0;
        opacity: 1; /* Comienza con algo de opacidad para ser visible. */
    }
    /* Estado al 90% de la animación. */
    90% {
        width: ${size}px; /* Crece hasta el tamaño máximo definido en las props. */
        height: ${size}px;
        opacity: 0.7; /* Mantiene la opacidad. */
    }
    /* Estado final: se mantiene en el tamaño máximo antes de ser eliminado del DOM. */
    100% {
        width: ${size}px;
        height: ${size}px;
        opacity: 0.1;
    }
`;

// Estilo base para cada elemento de onda.
const RippleSpan = styled.span<{ color: string; duration: number; size: number; left: number; top: number; }>`
    position: absolute; /* Posicionamiento absoluto para colocarlo según las coordenadas \`top\` y \`left\`. */
    border-radius: 50%; /* Lo hace un círculo. */
    transform: translate(-50%, -50%); /* Ajuste para centrar mejor el origen de la onda. */
    animation-name: ${props => rippleAnimation(props.size)}; /* Asigna la animación definida en @keyframes. */
    animation-timing-function: linear; /* La animación progresa a una velocidad constante. */
    
    /* Las siguientes propiedades se establecen dinámicamente desde las props del componente. */
    box-shadow: 0 0 25px ${props => props.color}, inset 0 0 25px ${props => props.color}; /* Crea un efecto de resplandor usando el color de la prop. */
    animation-duration: ${props => props.duration}s; /* Establece la duración de la animación. */
    left: ${props => props.left}px;
    top: ${props => props.top}px;
`;

// El componente funcional principal. Se le asignan valores por defecto a las props.
const RippleEffect: React.FC<RippleEffectProps> = ({
    color = '#97b3e9',
    duration = 5, // en segundos
    size = 4500, // en píxeles
    interval = 4000, // en milisegundos
}) => {
    // Estado para almacenar el array de ondas activas en la pantalla.
    // Inicialmente, el array está vacío.
    const [ripples, setRipples] = useState<Ripple[]>([]);

    // Hook de efecto que se ejecuta cuando el componente se monta y cada vez que `duration` o `interval` cambian.
    useEffect(() => {
        // Inicia un temporizador que se ejecuta repetidamente cada `interval` milisegundos.
        const intervalId = setInterval(() => {
            // Crea un nuevo objeto de onda.
            const newRipple = {
                key: Date.now(), // Usa la marca de tiempo actual como una clave única.
                left: window.innerWidth / 2, // Posiciona la onda en el centro horizontal de la ventana.
                top: window.innerHeight / 2,  // Posiciona la onda en el centro vertical de la ventana.
            };

            // Actualiza el estado `ripples` añadiendo la nueva onda al array existente.
            // Esto provoca que el componente se vuelva a renderizar.
            setRipples(prevRipples => [...prevRipples, newRipple]);

            // Inicia otro temporizador para eliminar esta onda del estado después de que su animación haya terminado.
            // Esto es crucial para el rendimiento, para evitar que el DOM se llene de elementos invisibles.
            // La duración se multiplica por 1000 para convertir los segundos de la prop a milisegundos.
            setTimeout(() => {
                // Actualiza el estado `ripples` filtrando el array para eliminar la onda que acaba de terminar.
                setRipples(currentRipples => currentRipples.filter(r => r.key !== newRipple.key));
            }, duration * 1000); 

        }, interval); // El intervalo de creación de nuevas ondas.

        // Función de limpieza del useEffect: se ejecuta cuando el componente se desmonta.
        // Detiene el `setInterval` para evitar fugas de memoria.
        return () => clearInterval(intervalId);
    }, [duration, interval]); // El array de dependencias: el efecto se volverá a ejecutar si alguna de estas props cambia.

    return (
        <>
            {/* Mapea el array de `ripples` del estado para renderizar un <span> por cada onda. */}
            {ripples.map(ripple => (
                <RippleSpan
                    key={ripple.key} // Clave única para que React identifique cada elemento.
                    // Aplica el posicionamiento y estilo inicial de la onda.
                    color={color}
                    duration={duration}
                    size={size}
                    left={ripple.left}
                    top={ripple.top}
                />
            ))}
        </>
    );
};

export default RippleEffect;
