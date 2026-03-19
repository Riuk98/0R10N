# Ecosistema Digital Hato Grande & Orion ERP

## Introducción
Este proyecto representa una solución tecnológica integral que fusiona un canal de ventas digital de alto impacto (Hato Grande) con un robusto sistema de gestión empresarial (Orion ERP). La plataforma ha sido diseñada para cerrar la brecha entre la experiencia del cliente final y la eficiencia operativa interna, permitiendo una administración fluida de todo el ciclo de vida comercial.

---

## ¿Para qué funciona?
El propósito fundamental de esta aplicación es proporcionar una infraestructura digital completa para empresas que requieren tanto una presencia comercial en línea como un control administrativo riguroso.

*   **Hato Grande (E-commerce):** Funciona como la vitrina comercial, permitiendo a los clientes explorar productos, gestionar su carrito de compras y realizar pedidos en una interfaz visualmente atractiva y optimizada para la conversión.
*   **Orion ERP (Gestión Interna):** Funciona como el motor operativo de la empresa, cubriendo áreas críticas como contabilidad, inventarios, nómina, producción y CRM. Permite a los administradores tomar decisiones basadas en datos en tiempo real.

## ¿Cómo funciona?
La arquitectura del sistema se basa en una aplicación de página única (SPA) desarrollada con **React** y **TypeScript**, utilizando **Tailwind CSS** para un diseño responsivo y moderno.

1.  **Navegación Híbrida:** El archivo principal `App.tsx` actúa como el orquestador, permitiendo la transición fluida entre la interfaz de usuario de Hato Grande y el panel de control de Orion ERP.
2.  **Sincronización de Datos:** El sistema utiliza un estado centralizado para productos e inventarios. Cuando se realiza una venta en Hato Grande o se añade stock en Orion, la información se mantiene consistente a través de una capa de datos compartida (actualmente persistida mediante `localStorage` para demostración).
3.  **Modularidad:** Orion ERP está estructurado en módulos independientes (Financiero, Comercial, Operaciones, Administración), lo que facilita el mantenimiento y la escalabilidad de funciones específicas sin afectar el resto del ecosistema.

## ¿Por qué funciona?
La efectividad de esta solución radica en tres pilares fundamentales:

*   **Centralización:** Al eliminar los silos de información entre el punto de venta y el almacén, se reducen errores humanos y se optimizan los tiempos de respuesta.
*   **Experiencia de Usuario (UX):** Mientras que Hato Grande se enfoca en la calidez y facilidad de uso para el consumidor, Orion ERP prioriza la densidad de información y la productividad para el usuario administrativo.
*   **Escalabilidad Técnica:** El uso de TypeScript garantiza un código robusto y tipado, mientras que la estructura de componentes permite añadir nuevas funcionalidades de manera ágil, adaptándose al crecimiento del negocio.

---

## Tecnologías Principales
*   **Frontend:** React 19, TypeScript.
*   **Estilos:** Tailwind CSS, Styled Components.
*   **Herramientas de Construcción:** Vite.
*   **Inteligencia Artificial:** Integración con Google GenAI para potenciar funcionalidades inteligentes en el ERP.
