import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface Product {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
}

export async function getProducts(): Promise<Product[]> {
    const currentDirectory = path.dirname(
        fileURLToPath(import.meta.url)
    );

    const filePath = path.resolve(
        currentDirectory,
        "../data/products.json"
    );

    const content = await readFile(filePath, "utf8");

    const data: unknown = JSON.parse(content);

    if (
        !Array.isArray(data) ||
        !data.every(
            (item: unknown) =>
                typeof item === "object" &&
                item !== null &&
                "id" in item &&
                typeof item.id === "number" &&
                "name" in item &&
                typeof item.name === "string" &&
                "price" in item &&
                typeof item.price === "number" &&
                "inStock" in item &&
                typeof item.inStock === "boolean"
        )
    ) {
        throw new Error("Invalid products.json format");
    }

    return data as Product[];
}


export async function getAvailableProducts(): Promise<Product[]> {
    const products = await getProducts();

    return products.filter((product) => product.inStock);
}