export const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'quesos', name: 'Quesos' },
    { id: 'yogures', name: 'Yogures' },
    { id: 'postres', name: 'Postres' },
    { id: 'otros', name: 'Otros Lácteos' },
];

export const products = [
    {
        id: 1,
        name: 'Queso Campesino',
        category: 'quesos',
        price: 12500,
        image: 'https://i.postimg.cc/kX4DR5Fv/queso-campesino.png',
        description: 'Fresco y suave, nuestro Queso Campesino es perfecto para acompañar arepas, panes o para disfrutar solo. Elaborado con leche 100% pura de vaca.',
        options: {
            type: 'peso',
            values: ['250g', '500g', '1kg']
        },
        bestseller: true,
    },
    {
        id: 2,
        name: 'Yogur de Fresa',
        category: 'yogures',
        price: 4500,
        image: 'https://i.postimg.cc/tJ1g2P2V/yogur-fresa.png',
        description: 'Cremoso yogur artesanal con trozos de fresas frescas. Una opción deliciosa y saludable para cualquier momento del día.',
        options: {
            type: 'peso',
            values: ['150g', '500g', '1L']
        },
        offer: true,
    },
    {
        id: 3,
        name: 'Arequipe Hato Grande',
        category: 'postres',
        price: 8000,
        image: 'https://i.postimg.cc/pXkGjRys/arequipe.png',
        description: 'El tradicional dulce de leche con la receta de la casa. Su textura suave y sabor inconfundible lo hacen el postre ideal.',
        options: {
            type: 'peso',
            values: ['200g', '450g']
        },
        bestseller: true,
    },
    {
        id: 4,
        name: 'Queso Mozzarella',
        category: 'quesos',
        price: 15000,
        image: 'https://i.postimg.cc/wMPZvj3t/queso-mozzarella.png',
        description: 'Ideal para pizzas, lasañas o cualquier plato que requiera un queso que derrita a la perfección. Sabor suave y textura elástica.',
        options: {
            type: 'peso',
            values: ['400g', '800g']
        },
    },
    {
        id: 5,
        name: 'Kumis',
        category: 'otros',
        price: 5500,
        image: 'https://i.postimg.cc/J0bQzY9X/kumis.png',
        description: 'Bebida láctea fermentada con un sabor ligeramente ácido y dulce. Perfecto para mejorar la digestión y disfrutar de una bebida refrescante.',
        options: {
            type: 'peso',
            values: ['1L']
        },
    },
    {
        id: 6,
        name: 'Yogur Griego Natural',
        category: 'yogures',
        price: 6000,
        image: 'https://i.postimg.cc/8PtnCgH8/yogur-griego.png',
        description: 'Alto en proteína y con una textura extra cremosa. Disfrútalo solo, con frutas o como base para salsas y aderezos.',
        options: {
            type: 'peso',
            values: ['200g', '500g']
        },
        bestseller: true,
    },
    {
        id: 7,
        name: 'Postre de Natas',
        category: 'postres',
        price: 7500,
        image: 'https://i.postimg.cc/Hxb3Vz6f/postre-natas.png',
        description: 'Un postre tradicional colombiano, cremoso y delicioso, hecho con la nata de la mejor leche de nuestras fincas.',
        options: {
            type: 'peso',
            values: ['220g']
        },
        offer: true,
    },
     {
        id: 8,
        name: 'Mantequilla sin Sal',
        category: 'otros',
        price: 9000,
        image: 'https://i.postimg.cc/G30f3vjJ/mantequilla.png',
        description: 'Mantequilla pura y cremosa, elaborada a partir de la nata de leche fresca. Perfecta para cocinar, hornear o untar.',
        options: {
            type: 'peso',
            values: ['250g', '500g']
        },
    },
];

export const testimonials = [
    {
        id: 1,
        name: 'Ana Pérez',
        quote: 'El queso campesino de Hato Grande es el mejor que he probado, ¡me recuerda a mi infancia en el campo!',
        image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
        id: 2,
        name: 'Carlos Rodríguez',
        quote: 'El arequipe tiene el punto perfecto de dulce y una cremosidad increíble. ¡Es adictivo!',
        image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
        id: 3,
        name: 'Sofía Gómez',
        quote: 'Me encanta la calidad de los productos. El yogur griego es mi favorito para empezar el día con energía.',
        image: 'https://randomuser.me/api/portraits/women/65.jpg'
    }
];
