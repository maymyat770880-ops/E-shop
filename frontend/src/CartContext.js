import React, { createContext, useState, useContext } from 'react';
export const CartContext = createContext();



export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems([...cartItems, product]);
        alert(`${product.name} added to cart!`);
    };

   

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };
     const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart,clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);