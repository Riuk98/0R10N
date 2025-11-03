
import { OrionProduct, OrionInsumo } from '../modules/operaciones/Inventario';

export const initialProducts: OrionProduct[] = [
    {
        id: "QCP-500",
        codigo: "QCP-500",
        nombre: "Queso Campesino 500g",
        cantidad: 120,
        valorUnitario: 12500,
        categoria: "Quesos",
        fechaLote: "2024-07-20",
        fechaVencimiento: "2024-08-20",
        stockMin: 50,
        stockMax: 200,
    },
    {
        id: "YFR-1L",
        codigo: "YFR-1L",
        nombre: "Yogur de Fresa 1L",
        cantidad: 80,
        valorUnitario: 4500,
        categoria: "Yogures",
        fechaLote: "2024-07-22",
        fechaVencimiento: "2024-08-15",
        stockMin: 40,
        stockMax: 150,
    },
    {
        id: "AQP-450",
        codigo: "AQP-450",
        nombre: "Arequipe Hato Grande 450g",
        cantidad: 150,
        valorUnitario: 8000,
        categoria: "Postres",
        fechaLote: "2024-07-15",
        fechaVencimiento: "2024-10-15",
        stockMin: 60,
        stockMax: 250,
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
