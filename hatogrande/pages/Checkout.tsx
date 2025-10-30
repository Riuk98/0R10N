
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

interface AccordionSectionProps {
    title: string;
    number?: number;
    total?: number;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

const getNewOrderId = () => {
    let lastId = parseInt(localStorage.getItem('lastOrderId') || '0', 10);
    lastId++;
    localStorage.setItem('lastOrderId', lastId.toString());
    return `CO-${String(lastId).padStart(6, '0')}`;
};


const AccordionSection: React.FC<AccordionSectionProps> = ({ title, number, total, isOpen, onToggle, children }) => (
    <div className="border rounded-lg overflow-hidden">
        <button onClick={onToggle} className="w-full flex justify-between items-center p-5 bg-gray-100 hover:bg-gray-200 transition-colors">
            <h2 className="text-lg font-bold text-[var(--color-dark)]">
                {number && `${number} DE 3 | `}{title}
            </h2>
            {total ? <span className="font-bold text-lg text-[var(--color-dark)]">${total.toLocaleString('es-CO')}</span> : (
                 <svg className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            )}
        </button>
        <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
            <div className="p-6 border-t">{children}</div>
        </div>
    </div>
);

const Checkout: React.FC = () => {
    const { cart, currentUser, clearCart } = useAppContext();
    const [openSection, setOpenSection] = useState('info');
    const [deliveryMethod, setDeliveryMethod] = useState('domicilio');
    const [paymentMethod, setPaymentMethod] = useState('electronico');
    const [errors, setErrors] = useState<any>({});
    const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', address: '', city: '', department: '', comments: '', acceptTerms: false
    });

    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                email: currentUser.email,
                phone: currentUser.phone
            }));
        }
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const validate = () => {
        const newErrors: any = {};
        if (!formData.firstName) newErrors.firstName = "Campo Obligatorio";
        if (!formData.lastName) newErrors.lastName = "Campo Obligatorio";
        if (!formData.email) newErrors.email = "Campo Obligatorio";
        if (!formData.phone) newErrors.phone = "Campo Obligatorio";
        if (!formData.acceptTerms) newErrors.acceptTerms = "Debe aceptar los términos";

        if (deliveryMethod === 'domicilio') {
            if (!formData.address) newErrors.address = "Campo Obligatorio";
            if (!formData.city) newErrors.city = "Campo Obligatorio";
            if (!formData.department) newErrors.department = "Campo Obligatorio";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handlePurchase = async () => {
        setSubmissionStatus(null);
        if (validate()) {
            setIsProcessing(true);
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newOrderId = getNewOrderId();
            const newOrder = {
                id: newOrderId,
                creationDate: new Date().toISOString(),
                clientName: `${formData.firstName} ${formData.lastName}`,
                clientEmail: formData.email,
                clientPhone: formData.phone,
                clientAddress: deliveryMethod === 'domicilio' ? `${formData.address}, ${formData.city}, ${formData.department}` : 'Entrega en Tienda',
                paymentMethod: paymentMethod === 'electronico' ? 'Electrónico' : 'Contra Entrega',
                items: cart.map(item => ({
                    productId: item.id,
                    productName: item.name,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    totalPrice: item.price * item.quantity,
                    options: item.options,
                })),
                subtotal: cartTotal,
                discount: 0,
                total: cartTotal,
                observations: formData.comments,
                source: 'Web',
                status: 'Abierto',
            };

            const storedPedidos = JSON.parse(localStorage.getItem('hatoGrandePedidos') || '[]');
            storedPedidos.push(newOrder);
            localStorage.setItem('hatoGrandePedidos', JSON.stringify(storedPedidos));
            window.dispatchEvent(new Event("storage"));
            
            clearCart();
            setIsProcessing(false);
            setSubmissionStatus({ type: 'success', text: `¡Compra realizada con éxito! Tu número de pedido es ${newOrderId}.` });
            window.scrollTo(0, 0);
        } else {
            setSubmissionStatus({ type: 'error', text: 'Por favor, complete todos los campos obligatorios marcados en rojo.' });
        }
    }

    return (
        <div className="">
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="text-4xl font-bold text-left text-[var(--color-dark)] mb-8">Finalizar Compra</h1>

                {submissionStatus && (
                    <div
                        className={`p-4 rounded-md mb-6 text-center font-semibold ${
                            submissionStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {submissionStatus.text}
                    </div>
                )}
                
                <div className="space-y-4">
                    <AccordionSection title="RESUMEN DE PEDIDO" total={cartTotal} isOpen={openSection === 'summary'} onToggle={() => setOpenSection('summary')}>
                         <div className="space-y-3 text-[var(--color-text)]">
                            {cart.map(item => (
                                <div key={item.variantId} className="flex justify-between items-center text-sm">
                                    <p>{item.name} ({Object.values(item.options)[0]}) x {item.quantity}</p>
                                    <p className="font-semibold">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                                </div>
                            ))}
                        </div>
                    </AccordionSection>

                    <AccordionSection title="TU INFORMACIÓN" number={1} isOpen={openSection === 'info'} onToggle={() => setOpenSection('info')}>
                        {!currentUser && <p className="text-sm text-center bg-blue-50 p-3 rounded-md mb-4 text-[var(--color-text)]">Inicia sesión para autocompletar tu información.</p>}
                         <div className="grid grid-cols-2 gap-4">
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombres" className={`col-span-1 p-2 border rounded ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}/>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellidos" className={`col-span-1 p-2 border rounded ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}/>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Correo electrónico" className={`col-span-2 p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}/>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono de contacto" className={`col-span-2 p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}/>
                            <div className="col-span-2 flex items-start">
                                 <input type="checkbox" id="terms" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className={`mt-1 ${errors.acceptTerms ? 'border-red-500' : ''}`} />
                                 <label htmlFor="terms" className="ml-2 text-xs text-[var(--color-text)] opacity-80">Autorizo el tratamiento de mis datos personales. <a href="#" className="underline">Ver política</a>.</label>
                            </div>
                             {errors.acceptTerms && <p className="text-red-500 text-xs col-span-2">{errors.acceptTerms}</p>}
                        </div>
                    </AccordionSection>

                    <AccordionSection title="INFORMACIÓN DE ENVÍO" number={2} isOpen={openSection === 'shipping'} onToggle={() => setOpenSection('shipping')}>
                        <div className="flex gap-4 mb-6">
                            <button onClick={() => setDeliveryMethod('domicilio')} className={`flex-1 p-3 rounded-lg border-2 ${deliveryMethod === 'domicilio' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : ''}`}>Envío a Domicilio</button>
                            <button onClick={() => setDeliveryMethod('tienda')} className={`flex-1 p-3 rounded-lg border-2 ${deliveryMethod === 'tienda' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : ''}`}>Entrega en Tienda</button>
                        </div>
                        {deliveryMethod === 'domicilio' ? (
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Departamento" className={`col-span-1 p-2 border rounded ${errors.department ? 'border-red-500' : 'border-gray-300'}`}/>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Ciudad" className={`col-span-1 p-2 border rounded ${errors.city ? 'border-red-500' : 'border-gray-300'}`}/>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Dirección" className={`col-span-2 p-2 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}/>
                                <textarea name="comments" value={formData.comments} onChange={handleChange} placeholder="Instrucciones o comentarios adicionales" rows={3} className="col-span-2 p-2 border rounded border-gray-300" />
                            </div>
                        ) : (
                            <div className="text-[var(--color-text)]">
                                 <p className="font-semibold">Recoge tu pedido en:</p>
                                 <p>Finca Hato Grande, Suesca</p>
                                 <div className="mt-4 h-48 bg-gray-200 rounded-lg flex items-center justify-center"> (Mapa de ubicación aquí) </div>
                            </div>
                        )}
                    </AccordionSection>

                    <AccordionSection title="FORMAS DE PAGO" number={3} isOpen={openSection === 'payment'} onToggle={() => setOpenSection('payment')}>
                        <div className="space-y-4">
                             <button onClick={() => setPaymentMethod('electronico')} className={`w-full p-4 rounded-lg border-2 text-left ${paymentMethod === 'electronico' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : ''}`}>
                                <p className="font-bold text-[var(--color-dark)]">Pago electrónico</p>
                                <p className="text-sm text-[var(--color-text)]">PSE, TARJETA, NEQUI, ENTRE OTROS</p>
                             </button>
                             <button onClick={() => setPaymentMethod('entrega')} className={`w-full p-4 rounded-lg border-2 text-left ${paymentMethod === 'entrega' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : ''}`}>
                                 <p className="font-bold text-[var(--color-dark)]">Pagar al momento de la entrega</p>
                             </button>
                        </div>
                    </AccordionSection>

                    <button 
                        onClick={handlePurchase} 
                        disabled={isProcessing || cart.length === 0}
                        className="w-full mt-8 py-4 bg-[var(--color-primary)] text-[var(--color-dark)] font-bold text-lg rounded-lg hover:bg-[var(--color-accent)] transition-colors disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isProcessing ? 'PROCESANDO COMPRA...' : 'REALIZAR COMPRA'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
