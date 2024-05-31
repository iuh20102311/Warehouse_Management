import {Material, Provider, Warehouse} from "@/models/Model";

export interface InventoryMaterial {
    id: number;
    quantity_available: number;
    minimum_stock_level: number;
    created_at: string;
    updated_at: string;
    status: string;
    provider: Provider;
    Material: Material;
    warehouse: Warehouse;
}