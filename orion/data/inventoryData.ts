
import { OrionInsumo } from '../modules/operaciones/Inventario';

export interface UnifiedProduct {
    id: string; // The unique code from the form
    codigo: string;
    nombre: string;
    cantidad: number;
    valorUnitario: number;
    categoria: 'quesos' | 'yogures' | 'postres' | 'otros' | string;
    fechaLote: string;
    fechaVencimiento: string;
    stockMin: number;
    stockMax: number;
    // Hato Grande fields
    image?: string;
    description?: string;
    options?: {
        type: string;
        values: string[];
    };
    bestseller?: boolean;
    offer?: boolean;
}


export const initialUnifiedProducts: UnifiedProduct[] = [
    {
        id: "QCP-500",
        codigo: "QCP-500",
        nombre: "Queso Campesino",
        cantidad: 120,
        valorUnitario: 12500,
        categoria: "quesos",
        fechaLote: "2024-07-20",
        fechaVencimiento: "2024-08-20",
        stockMin: 50,
        stockMax: 200,
        image: 'https://i.postimg.cc/kX4DR5Fv/queso-campesino.png',
        description: 'Fresco y suave, nuestro Queso Campesino es perfecto para acompañar arepas, panes o para disfrutar solo. Elaborado con leche 100% pura de vaca.',
        options: { type: 'peso', values: ['250g', '500g', '1kg'] },
        bestseller: true,
    },
    {
        id: "YFR-1L",
        codigo: "YFR-1L",
        nombre: "Yogur de Fresa",
        cantidad: 80,
        valorUnitario: 4500,
        categoria: "yogures",
        fechaLote: "2024-07-22",
        fechaVencimiento: "2024-08-15",
        stockMin: 40,
        stockMax: 150,
        image: 'https://i.postimg.cc/tJ1g2P2V/yogur-fresa.png',
        description: 'Cremoso yogur artesanal con trozos de fresas frescas. Una opción deliciosa y saludable para cualquier momento del día.',
        options: { type: 'presentacion', values: ['150g', '500g', '1L'] },
        offer: true,
    },
    {
        id: "AQP-450",
        codigo: "AQP-450",
        nombre: "Arequipe Hato Grande",
        cantidad: 150,
        valorUnitario: 8000,
        categoria: "postres",
        fechaLote: "2024-07-15",
        fechaVencimiento: "2024-10-15",
        stockMin: 60,
        stockMax: 250,
        image: 'https://i.postimg.cc/pXkGjRys/arequipe.png',
        description: 'El tradicional dulce de leche con la receta de la casa. Su textura suave y sabor inconfundible lo hacen el postre ideal.',
        options: { type: 'peso', values: ['200g', '450g'] },
        bestseller: true,
    },
    {
        id: 'QMZ-400',
        codigo: 'QMZ-400',
        nombre: 'Queso Mozzarella',
        cantidad: 90,
        valorUnitario: 15000,
        categoria: 'quesos',
        fechaLote: '2024-07-18',
        fechaVencimiento: '2024-09-18',
        stockMin: 30,
        stockMax: 100,
        image: 'https://i.postimg.cc/wMPZvj3t/queso-mozzarella.png',
        description: 'Ideal para pizzas, lasañas o cualquier plato que requiera un queso que derrita a la perfección. Sabor suave y textura elástica.',
        options: { type: 'peso', values: ['400g', '800g'] },
    },
    {
        id: 'KUM-1L',
        codigo: 'KUM-1L',
        nombre: 'Kumis',
        cantidad: 75,
        valorUnitario: 5500,
        categoria: 'otros',
        fechaLote: '2024-07-21',
        fechaVencimiento: '2024-08-10',
        stockMin: 25,
        stockMax: 100,
        image: 'https://i.postimg.cc/J0bQzY9X/kumis.png',
        description: 'Bebida láctea fermentada con un sabor ligeramente ácido y dulce. Perfecto para mejorar la digestión y disfrutar de una bebida refrescante.',
        options: { type: 'presentacion', values: ['1L'] },
    },
    {
        id: 'YGN-200',
        codigo: 'YGN-200',
        nombre: 'Yogur Griego Natural',
        cantidad: 110,
        valorUnitario: 6000,
        categoria: 'yogures',
        fechaLote: '2024-07-23',
        fechaVencimiento: '2024-08-05',
        stockMin: 40,
        stockMax: 120,
        image: 'https://i.postimg.cc/8PtnCgH8/yogur-griego.png',
        description: 'Alto en proteína y con una textura extra cremosa. Disfrútalo solo, con frutas o como base para salsas y aderezos.',
        options: { type: 'peso', values: ['200g', '500g'] },
        bestseller: true,
    },
    {
        id: 'PDN-220',
        codigo: 'PDN-220',
        nombre: 'Postre de Natas',
        cantidad: 60,
        valorUnitario: 7500,
        categoria: 'postres',
        fechaLote: '2024-07-24',
        fechaVencimiento: '2024-08-01',
        stockMin: 20,
        stockMax: 80,
        image: 'https://i.postimg.cc/Hxb3Vz6f/postre-natas.png',
        description: 'Un postre tradicional colombiano, cremoso y delicioso, hecho con la nata de la mejor leche de nuestras fincas.',
        options: { type: 'peso', values: ['220g'] },
        offer: true,
    },
    {
        id: 'MNT-250',
        codigo: 'MNT-250',
        nombre: 'Mantequilla sin Sal',
        cantidad: 95,
        valorUnitario: 9000,
        categoria: 'otros',
        fechaLote: '2024-07-10',
        fechaVencimiento: '2024-09-10',
        stockMin: 30,
        stockMax: 100,
        image: 'https://i.postimg.cc/G30f3vjJ/mantequilla.png',
        description: 'Mantequilla pura y cremosa, elaborada a partir de la nata de leche fresca. Perfecta para cocinar, hornear o untar.',
        options: { type: 'peso', values: ['250g', '500g'] },
    },
];

export const initialInsumos: OrionInsumo[] = [
    {
        id: 'LTC-01',
        nombre: 'Leche Cruda Entera',
        cantidad: 5000,
        unidadMedida: 'Litro',
        costoUnitario: 1800,
    },
    {
        id: 'CJO-01',
        nombre: 'Cuajo',
        cantidad: 1000,
        unidadMedida: 'Gramo',
        costoUnitario: 800,
    },
     {
        id: 'SAL-01',
        nombre: 'Sal',
        cantidad: 500,
        unidadMedida: 'Kg',
        costoUnitario: 1200,
    },
    {
        id: 'ENV-Y-1L',
        nombre: 'Envase Yogur 1L',
        cantidad: 2500,
        unidadMedida: 'Unidad',
        costoUnitario: 550,
    },
    {
        id: 'FRT-FR-KG',
        nombre: 'Fruta Fresa',
        cantidad: 150,
        unidadMedida: 'Kg',
        costoUnitario: 7500,
    },
    {
        id: 'AZC-KG',
        nombre: 'Azúcar',
        cantidad: 800,
        unidadMedida: 'Kg',
        costoUnitario: 4000,
    }
];
