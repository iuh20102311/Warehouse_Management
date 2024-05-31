import {Warehouse} from "@/models/Model";

export interface Product {
    id: number;
    sku: string;
    name: string;
    packing: string;
    price: number;
    description: string;
    status: string;
    quantity: number;
    weight: number;
    created_at: Date;
    updated_at: Date;
}

export interface InventoryProduct {
    id: number;
    quantity_available: number;
    minimum_stock_level: number;
    status: string;
    created_at: string;
    updated_at: string;
    product: Product;
    warehouse: Warehouse;
}
export interface ProductCart {
    id: number;
    sku: string;
    name: string;
    packing: string;
    price: number;
    description: string;
    status: string;
    quantity: number;
    weight: number;
    quantityInCart: number;
    created_at: Date;
    updated_at: Date;
}

export interface ProductSearch {
    id: number;
    sku: string;
    name: string;
    packing: string;
    price: number;
    description: string;
    status: string;
    quantity: number;
    weight: number;
    selected: boolean;
    created_at: Date;
    updated_at: Date;
}