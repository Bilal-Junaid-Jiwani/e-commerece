import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-cyan-500/50",
        secondary: "bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600",
        accent: "bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:shadow-rose-500/50",
        outline: "bg-transparent border-2 border-white text-white hover:bg-white/10",
        outlineDark: "bg-transparent border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
