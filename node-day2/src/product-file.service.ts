import { readFile } from "node:fs/promises";

export interface Product {
    id: number;
    name: string;
    price: number;
}

export async function getProducts(): Promise<Product[]> {
    const content = await readFile(
        "data/products.json",
        "utf8"
    );

    const products: Product[] = JSON.parse(content);

    return products;
}