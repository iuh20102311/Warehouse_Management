import React, {useEffect, useRef, useState} from 'react';
import HeaderModal from "@/components/Modal/HeaderModal";
import BodyModal from "@/components/Modal/BodyModal";
import InputDefault from "@/components/Inputs/InputDefault";
import Image from "next/image";
import FooterModal from "@/components/Modal/FooterModal";
import ContainerModal from "@/components/Modal/ContainerModal";
import {getData} from "@/services/APIService";
import {API_GET_ALL_INVENTORY_PRODUCTS} from "@/config/api";
import {InventoryProduct, Product, ProductCart, ProductSearch} from "@/models/Product";

interface SearchProductInventoryModalProps {
    onClose: () => void;
    products: ProductCart[];
    setProducts: React.Dispatch<React.SetStateAction<ProductCart[]>>;
    warehouseId: string;
}

const columns: string[] = ["Sản phẩm", "Quy cách đóng gói", "Trọng lượng", "Sẵn có trong kho", "Giá (đ)"];

const SearchProductInventoryModal = ({onClose, products, setProducts, warehouseId}: SearchProductInventoryModalProps) => {
    const [productName, setProductName] = useState<string>("");
    const [productSearches, setProductSearches] = useState<ProductSearch[]>([])
    const [isAnyProductSelected, setIsAnyProductSelected] = useState<boolean>(false);
    const [selectAll, setSelectAll] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const convertProductToProductSearch = (inventoryProduct: InventoryProduct): ProductSearch => {
        const { product, quantity_available } = inventoryProduct;
        return {
            ...product,
            quantity: quantity_available,
            selected: false
        };
    };

    const handleSearchProductByProductName = async () => {
        if (productName !== '') {
            const data: InventoryProduct[] = await getData(API_GET_ALL_INVENTORY_PRODUCTS + "?warehouse_id=" + warehouseId);
            const newProducts: ProductSearch[] = data.map(d => convertProductToProductSearch(d));
            const filteredData = newProducts.filter(searchProduct =>
                !products.some(product => product.id === searchProduct.id) &&
                searchProduct.name.toLowerCase().includes(productName.toLowerCase())
            );
            setProductSearches(filteredData);
        }
    }

    const handleChangeSelectAll = () => {
        const updatedProducts = productSearches.map(product => ({
            ...product,
            selected: !selectAll
        }));
        setProductSearches(updatedProducts);
        setSelectAll(!selectAll);
    }

    const handleChangeSelectProduct = (index: number) => {
        const updatedProducts = [...productSearches];
        updatedProducts[index].selected = !updatedProducts[index].selected;
        setProductSearches(updatedProducts);

        if (selectAll && !updatedProducts.every(product => product.selected)) {
            setSelectAll(false);
        } else if (!selectAll && updatedProducts.every(product => product.selected)) {
            setSelectAll(true);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchProductByProductName();
        }
    }

    const convertProductSearchListToProductCartList = (searchList: ProductSearch[]): ProductCart[] => {
        return searchList.map(search => ({
            ...search,
            quantityInCart: 1,
        }));
    };

    const handleClickInsertToCart = () => {
        const selectedProducts = productSearches.filter(productSearch => productSearch.selected);
        const newProductCartList = convertProductSearchListToProductCartList(selectedProducts);
        setProducts(prevProducts => [...prevProducts, ...newProductCartList]);
        onClose();
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const anyProductSelected = productSearches.some(product => product.selected);
        setIsAnyProductSelected(anyProductSelected);
    }, [productSearches]);

    return (
        <ContainerModal>
            <HeaderModal title="Tìm kiếm sản phẩm" onClose={onClose}/>
            <BodyModal>
                <div className="flex flex-row gap-3">
                    <InputDefault placeholder="Nhập tên"
                                  ref={inputRef}
                                  onKeyDown={handleKeyDown}
                                  value={productName} type="text" name="search"
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
                    />
                    <button
                        onClick={handleSearchProductByProductName}
                        className="bg-blue-500 border border-blue-500 hover:bg-blue-700 text-white py-1 h-full px-10 rounded">
                        <span className="text-sm">Tìm</span>
                    </button>
                </div>
                <div className="overflow-auto sm:min-h-100 xsm:min-h-screen my-5">
                    <table className="w-full min-w-[950px] max-h-550 table-auto">
                        <thead>
                        <tr className="bg-gray-2 text-left text-xs dark:bg-meta-4">
                            <th className="min-w-[50px] px-2 py-2 font-medium text-black dark:text-white border-[#eee] border">
                                <div className="flex justify-center">
                                    <input type="checkbox" className="h-4 w-4 accent-blue-500" checked={selectAll}
                                           onChange={handleChangeSelectAll}/>
                                </div>
                            </th>
                            {
                                columns.map((modalColumns: string, index: number) => (
                                    <th key={"columns-" + index}
                                        className="min-w-[50px] px-2 py-2 font-medium text-black dark:text-white  border-[#eee] border text-center">
                                        {modalColumns}
                                    </th>
                                ))
                            }
                        </tr>
                        </thead>
                        <tbody className="text-left">
                        {productSearches.map((product: ProductSearch, index: number) => (
                            <tr key={index} className="text-xs border border-[#eee]">
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark border-x">
                                    <div className="flex justify-center">
                                        <input type="checkbox" className="h-4 w-4 accent-blue-500"
                                               checked={product.selected}
                                               onChange={() => handleChangeSelectProduct(index)}/>
                                    </div>
                                </td>
                                <td className="border border-[#eee] px-2 py-3 dark:border-strokedark">
                                    <div className="flex flex-row gap-2">
                                        <div>
                                            <Image src={"/images/default/no-image.png"} alt=""
                                                   width={50}
                                                   height={50}
                                                   className="rounded border border-opacity-30 aspect-square object-cover"/>
                                        </div>
                                        <div>
                                            <a href={`/products/${product.id}`} target="_blank"
                                               className="font-bold text-sm text-blue-600 block mb-1">{product.name}</a>
                                            <div>SKU: {product.sku}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                    {product.packing}
                                </td>
                                <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                    {product.weight} g
                                </td>
                                <td className="px-2 py-3 dark:border-strokedark border border-[#eee] text-center">
                                    {product.quantity}
                                </td>

                                <td className="px-2 py-3 dark:border-strokedark border border-[#eee]">
                                    <h5 className="font-medium text-black dark:text-white text-end">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(product.price)}
                                    </h5>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </BodyModal>
            <FooterModal onClose={onClose} disabledRightBtn={!isAnyProductSelected} onClickRightBtn={handleClickInsertToCart} messageRightBtn="Nhập"/>
        </ContainerModal>
    );
};

export default SearchProductInventoryModal;