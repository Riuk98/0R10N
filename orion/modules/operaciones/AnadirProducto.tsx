
import React, { useState } from 'react';
import { OrionProduct } from './Inventario';

interface AnadirProductoProps {
    onClose: () => void;
}

const ORION_PRODUCTS_STORAGE_KEY = 'orionProducts';

const AnadirProducto: React.FC<AnadirProductoProps> = ({ onClose }) => {
    const [formData, setFormData] = useState<Omit<OrionProduct, 'id'>>({
        codigo: '',
        nombre: '',
        cantidad: 0,
        valorUnitario: 0,
        categoria: '',
        fechaLote: '',
        fechaVencimiento: '',
        stockMin: 0,
        stockMax: 0,
    });

    const [errors, setErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const validate = () => {
        const newErrors: any = {};
        if (!formData.codigo) newErrors.codigo = 'Código es requerido.';
        if (!formData.nombre) newErrors.nombre = 'Nombre es requerido.';
        if (formData.cantidad < 0) newErrors.cantidad = 'Cantidad no puede ser negativa.';
        if (formData.valorUnitario <= 0) newErrors.valorUnitario = 'Valor debe ser positivo.';
        if (!formData.categoria) newErrors.categoria = 'Categoría es requerida.';
        if (formData.stockMin < 0 || formData.stockMax < 0) newErrors.stock = 'Stock no puede ser negativo.';
        if (formData.stockMax > 0 && formData.stockMin > formData.stockMax) newErrors.stock = 'Stock Mín. no puede ser mayor al Máx.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            try {
                const storedProductsRaw = localStorage.getItem(ORION_PRODUCTS_STORAGE_KEY);
                const storedProducts: OrionProduct[] = storedProductsRaw ? JSON.parse(storedProductsRaw) : [];

                const existingProduct = storedProducts.find(p => p.id === formData.codigo);
                if (existingProduct) {
                    setErrors({ codigo: 'Este código de producto ya existe.' });
                    return;
                }

                const newProduct: OrionProduct = {
                    id: formData.codigo, // Using codigo as the unique ID
                    ...formData
                };
                
                storedProducts.push(newProduct);
                localStorage.setItem(ORION_PRODUCTS_STORAGE_KEY, JSON.stringify(storedProducts));
                window.dispatchEvent(new Event('storage')); // Notify other windows
                onClose();
            } catch (error) {
                console.error("Failed to save product:", error);
                alert("Hubo un error al guardar el producto.");
            }
        }
    };

    const renderError = (fieldName: string) => {
        if (errors[fieldName]) {
            return <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>;
        }
        return null;
    };

    return (
        <div className="p-4 bg-[var(--bg-card)] text-[var(--text-primary)] h-full flex flex-col">
            <h2 className="text-xl font-bold text-center mb-4 flex-shrink-0">Anadir Nuevo Producto</h2>
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                        <label htmlFor="codigo" className="block text-sm font-medium mb-1">Código</label>
                        <input type="text" name="codigo" id="codigo" value={formData.codigo} onChange={handleChange} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" />
                        {renderError('codigo')}
                    </div>
                     <div>
                        <label htmlFor="nombre" className="block text-sm font-medium mb-1">Nombre del Producto</label>
                        <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" />
                         {renderError('nombre')}
                    </div>
                     <div>
                        <label htmlFor="cantidad" className="block text-sm font-medium mb-1">Cantidad</label>
                        <input type="number" name="cantidad" id="cantidad" value={formData.cantidad} onChange={handleChange} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" />
                         {renderError('cantidad')}
                    </div>
                     <div>
                        <label htmlFor="valorUnitario" className="block text-sm font-medium mb-1">Valor Unitario</label>
                        <input type="number" name="valorUnitario" id="valorUnitario" value={formData.valorUnitario} onChange={handleChange} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" />
                         {renderError('valorUnitario')}
                    </div>
                     <div>
                        <label htmlFor="categoria" className="block text-sm font-medium mb-1">Categoría</label>
                        <select name="categoria" id="categoria" value={formData.categoria} onChange={handleChange} className="w-full bg-[var(--bg-main)] p-2 border rounded-md">
                            <option value="">Seleccione...</option>
                            <option value="Quesos">Quesos</option>
                            <option value="Yogures">Yogures</option>
                            <option value="Postres">Postres</option>
                            <option value="Otros Lácteos">Otros Lácteos</option>
                        </select>
                         {renderError('categoria')}
                    </div>
                    <div></div>
                     <div>
                        <label htmlFor="fechaLote" className="block text-sm font-medium mb-1">Fecha de Lote</label>
                        <input type="date" name="fechaLote" id="fechaLote" value={formData.fechaLote} onChange={handleChange} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" />
                    </div>
                     <div>
                        <label htmlFor="fechaVencimiento" className="block text-sm font-medium mb-1">Fecha de Vencimiento</label>
                        <input type="date" name="fechaVencimiento" id="fechaVencimiento" value={formData.fechaVencimiento} onChange={handleChange} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="stockMin" className="block text-sm font-medium mb-1">Stock Mínimo</label>
                        <input type="number" name="stockMin" id="stockMin" value={formData.stockMin} onChange={handleChange} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" />
                        {renderError('stock')}
                    </div>
                    <div>
                        <label htmlFor="stockMax" className="block text-sm font-medium mb-1">Stock Máximo</label>
                        <input type="number" name="stockMax" id="stockMax" value={formData.stockMax} onChange={handleChange} className="w-full bg-[var(--bg-main)] p-2 border rounded-md" />
                    </div>
                </div>
            </form>
             <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex justify-end gap-4 flex-shrink-0">
                <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-[var(--secondary-green)] text-white font-semibold rounded-lg hover:opacity-90">Guardar</button>
            </div>
        </div>
    );
};

export default AnadirProducto;
