import React from 'react';

// SVG Icons as React components
const CheeseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4.5,33.5 L59.5,33.5 C60.9,33.5 62,32.4 62,31 L62,16.8 C62,14.7 60.3,13 58.2,13 L8.8,13 C6.7,13 5,14.7 5,16.8 L5,31 C5,32.4 6.1,33.5 7.5,33.5 Z" fill="#FFD700" stroke="#DAA520" strokeLinejoin="round" />
        <path d="M32,33.5 L32,50.5 C32,51.9 30.9,53 29.5,53 L7.8,53 C5.7,53 4,51.3 4,49.2 L4,45" stroke="#DAA520" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="23" r="3" fill="#DAA520" opacity="0.7" />
        <circle cx="28" cy="24" r="2" fill="#DAA520" opacity="0.7" />
        <circle cx="42" cy="22" r="4" fill="#DAA520" opacity="0.7" />
    </svg>
);

const YogurtIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13,24 L51,24 L51,54 C51,56.2 49.2,58 47,58 L17,58 C14.8,58 13,56.2 13,54 Z" fill="#F0F8FF" stroke="#4682B4" />
        <path d="M13,24 L13,18 C13,15.8 14.8,14 17,14 L47,14 C49.2,14 51,15.8 51,18 L51,24 Z" fill="#E6E6FA" stroke="#4682B4" />
        <path d="M24 34 C28.5 38.5, 39.5 38.5, 44 34" stroke="#FF69B4" strokeLinecap="round" strokeWidth="3" />
    </svg>
);

const DessertIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5,48 L59,48 L59,56 L5,56 Z" fill="#D2B48C" stroke="#8B4513" />
        <path d="M10,48 L32,12 L54,48 Z" fill="#F5DEB3" stroke="#8B4513" />
        <path d="M32,12 C34,16 34,20 32,24 C30,20 30,16 32,12 Z" fill="#FF6347" stroke="#8B4513" />
    </svg>
);

const OtherIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10,12 L54,12 L54,52 L10,52 Z" fill="#FFFFFF" stroke="#333" />
        <rect x="16" y="22" width="32" height="10" rx="2" fill="#ADD8E6" stroke="#4682B4"/>
        <path d="M20,38 L44,38" stroke="#333" strokeLinecap="round"/>
        <path d="M20,44 L44,44" stroke="#333" strokeLinecap="round"/>
    </svg>
);

interface ProductIconProps {
    category: 'quesos' | 'yogures' | 'postres' | 'otros' | string;
    className?: string;
}

const ProductIcon: React.FC<ProductIconProps> = ({ category, className }) => {
    switch (category) {
        case 'quesos':
            return <CheeseIcon className={className} />;
        case 'yogures':
            return <YogurtIcon className={className} />;
        case 'postres':
            return <DessertIcon className={className} />;
        case 'otros':
            return <OtherIcon className={className} />;
        default:
            return <OtherIcon className={className} />;
    }
};

export default ProductIcon;