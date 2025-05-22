import { createSlice } from "@reduxjs/toolkit";

// Helper function to parse price
const parsePrice = (price) => {
    // If price is already a number, return it
    if (typeof price === 'number') return price;

    // If price is a string, remove '$' and convert to number
    if (typeof price === 'string') {
        // Remove '$' and any commas, then convert to number
        const cleanPrice = price.replace('$', '').replace(',', '');
        return parseFloat(cleanPrice) || 0;
    }

    // If price can't be parsed, return 0
    return 0;
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        total: 0,
    },
    reducers: {
        addToCart: (state, action) => {
            const existingItemIndex = state.items.findIndex(
                (item) => item._id === action.payload._id
            );

            if (existingItemIndex > -1) {
                // If item exists, increase quantity
                state.items[existingItemIndex].quantity += 1;
            } else {
                // If item doesn't exist, add to cart with quantity 1
                state.items.push({ ...action.payload, quantity: 1 });
            }

            // Recalculate total
            state.total = state.items.reduce(
                (total, item) => total + (parsePrice(item.price) * item.quantity),
                0
            );
        },
        removeFromCart: (state, action) => {
            const itemIndex = state.items.findIndex(
                (item) => item._id === action.payload._id
            );

            if (itemIndex > -1) {
                if (state.items[itemIndex].quantity > 1) {
                    state.items[itemIndex].quantity -= 1;
                } else {
                    state.items.splice(itemIndex, 1);
                }

                // Recalculate total
                state.total = state.items.reduce(
                    (total, item) => total + (parsePrice(item.price) * item.quantity),
                    0
                );
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        },
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;