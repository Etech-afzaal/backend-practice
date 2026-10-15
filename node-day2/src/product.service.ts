export function getProductPrice(
    price: number,
    quantity: number
): number {
    return price * quantity;
}

export function applyDiscount(
    total: number,
    discount: number
): number {
    return total - (total * discount) / 100;
}

export function isProductAvailable(
    stock: number
): boolean {
    return stock > 0;
}