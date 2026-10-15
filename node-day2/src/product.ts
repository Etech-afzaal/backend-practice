interface Product {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
}

const products: Product[] = [
    {
        id: 1,
        name: "Laptop",
        price: 120000,
        inStock: true
    },
    {
        id: 2,
        name: "Keyboard",
        price: 5000,
        inStock: false
    },
    {
        id: 3,
        name: "Mouse",
        price: 2500,
        inStock: true
    }
];

function getAvailableProducts(
    products: Product[]
): Product[] {
    return products.filter(
        (product) => product.inStock
    );
}

console.log(getAvailableProducts(products));