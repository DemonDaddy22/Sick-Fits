const getTotalQuantity = cart => !cart || !Array.isArray(cart) || (Array.isArray(cart) && cart.length === 0)
    ? 0
    : cart.reduce((acc, curr) => acc + curr.quantity, 0);

export default getTotalQuantity;