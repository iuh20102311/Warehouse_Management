import {Product} from "@/models/Product";

export interface Order {
    id: number;
    profile: Profile;
    address: string;
    phone: string;
    quantity: number;
    packing: string;
    city: string;
    ward: string;
    district: string;
    total_price: number;
    customer: Customer;
    status: string;
    created_at: Date;
    updated_at: Date;
}

export interface Material {
    id: number;
    name: string;
    origin: string;
    unit: string;
    note: string;
    status: string;
    quantity: number;
    weight: string;
    created_at: Date;
    updated_at: Date;
}

export interface Customer {
    id: number;
    group_customer_id: number;
    name: string;
    city: string;
    district: string;
    ward: string;
    birthday: Date;
    gender: boolean;
    phone: string;
    email: string;
    address: string;
    note: string;
    created_at: Date;
    updated_at: Date;
}

export interface CustomerDetail {
    id: number;
    group_customer: GroupCustomer;
    name: string;
    city: string;
    district: string;
    ward: string;
    birthday: Date;
    gender: boolean;
    phone: string;
    email: string;
    address: string;
    note: string;
    created_at: Date;
    updated_at: Date;
}

export interface Provider {
    id: number;
    name: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    phone: string;
    email: string;
    note: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}
export interface GroupCustomer{
    id: number;
    name: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}
export interface Warehouse {
    id: number;
    name: string;
    status: string;
    city: string;
    district: string;
    ward: string;
    note: string;
    address: string;
    created_at: Date;
    updated_at: Date;
}

export interface Discount {
    id: number;
    coupon_code: string;
    minimum_order_value: number;
    note: string;
    maximum_discount_value: number;
    discount_value: number;
    discount_unit: string;
    status: string;
    valid_until: Date;
    valid_start: Date;
}

export interface Discount {
    id: number;
    coupon_code: string;
    minimum_order_value: number;
    note: string;
    maximum_discount_value: number;
    discount_value: number;
    discount_unit: string;
    status: string;
    valid_until: Date;
    valid_start: Date;
}

export interface Category {
    id: number;
    name: string;
    type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface ExportMaterialReceipt {
    id: number;
    note: string | null;
    receipt_date: Date;
    type: string;
    warehouse: Warehouse;
    created_at: Date;
    updated_at: Date;
}

export interface ImportMaterialReceipt{
    id: number;
    note: string | null;
    receipt_date: Date;
    type: string;
    total_price: number;
    warehouse: Warehouse;
    created_at: Date;
    updated_at: Date;
}

export interface ExportProductReceipt {
    id: number;
    note: string | null;
    receipt_date: Date;
    type: string;
    warehouse: Warehouse;
    created_at: Date;
    updated_at: Date;
}

export interface ImportProductReceipt{
    id: number;
    note: string | null;
    receipt_date: Date;
    type: string;
    warehouse: Warehouse;
    created_at: Date;
    updated_at: Date;
}
export interface ImportMaterialReceiptDetail {
    id: number,
    material_import_receipt_id: number,
    material: Material,
    quantity: number,
    price: number,
    created_at: Date,
    updated_at: Date
}
export interface ImportProductReceiptDetail {
    id: number,
    material_import_receipt_id: number,
    product: Product,
    quantity: number,
    price: number,
    created_at: Date,
    updated_at: Date
}

export interface ExportMaterialReceiptDetail{
    id: number,
    material_import_receipt_id: number,
    material_id: number,
    material: Material,
    quantity: number,
    created_at: Date,
    updated_at: Date
}
export interface ExportProductReceiptDetail{
    id: number,
    material_import_receipt_id: number,
    material_id: number,
    product: Product,
    quantity: number,
    created_at: Date,
    updated_at: Date
}

export interface Employee {
    id: number,
    name: string,
    email: string,
    email_verified_at: Date,
    status: string,
    birthday: Date;
    gender: boolean;
    address: string;
    city: string;
    district: string;
    ward: string;
    phone: string;
    note: string;
    profile: Profile;
    role: Role;
}

export interface Role{
    id: number,
    name: string,
    status: string;
    created_at: Date;
    updated_at: Date;
}

export interface Profile{
    id: number,
    user_id: number,
    first_name: string,
    last_name: string,
    phone: number,
    birthday: Date,
    avatar: String,
    gender: boolean;
    created_at: Date,
    updated_at: Date
}

