import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
}

export default function Button({
  children,
  onClick,
  className = '',
  type = 'button',
  variant = 'primary',
}: ButtonProps) {
  const baseStyles = 'py-2 px-6 rounded-md transition-colors';
  
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-700',
    secondary: 'bg-gray-800 text-blue-400 border border-blue-500 hover:bg-gray-700',
  };
  
  // Use inline styles instead of Tailwind classes
  const inlineStyles = {
    backgroundColor: variant === 'primary' ? '#3b82f6' : '#1f2937',
    color: variant === 'primary' ? '#ffffff' : '#60a5fa',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.375rem',
    transition: 'background-color 0.2s',
    border: variant === 'secondary' ? '1px solid #3b82f6' : 'none',
    cursor: 'pointer',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      style={inlineStyles}
      className={className}
    >
      {children}
    </button>
  );
}