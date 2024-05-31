<?php
require 'Database.php';

use App\Database;
use Dotenv\Dotenv;
use Lcobucci\JWT\Encoding\CannotDecodeContent;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\InvalidTokenStructure;
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\Token\Plain;
use Lcobucci\JWT\Token\UnsupportedHeaderFound;
use Phroute\Phroute\Dispatcher;
use Phroute\Phroute\RouteCollector;

header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: *');

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

new Database();

$router = new RouteCollector();

$router->filter('auth', function () {
    if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
        http_response_code(401);
        error_log("Không có giá trị Token");
        return false;
    }

    $parser = new Parser(new JoseEncoder());
    try {
        $authorizationHeader = $_SERVER['HTTP_AUTHORIZATION'];
        if (str_starts_with($authorizationHeader, 'Bearer ')) {
            $token = $parser->parse(substr($authorizationHeader, 7));
            assert($token instanceof Plain);
            $now = new DateTimeImmutable();
            if ($token->isExpired($now)) {
                error_log("Token is expired");
                http_response_code(401);
                return false;
            }
        }
    } catch (CannotDecodeContent | InvalidTokenStructure | UnsupportedHeaderFound $e) {
        error_log($e->getMessage());
        http_response_code(401);
        return false;
    }
});

$router->group(array('prefix' => '/api'), function (RouteCollector $router) {
    $router->group(array('prefix' => '/v1/export'), function (RouteCollector $router) {
        $router->post('/materials', ['App\Controllers\MaterialExportReceiptController', 'exportMaterials']);
        $router->post('/products', ['App\Controllers\ProductExportReceiptController', 'exportProducts']);
    });

    $router->group(array('prefix' => '/v1/import'), function (RouteCollector $router) {
        $router->post('/materials', ['App\Controllers\MaterialImportReceiptController', 'importMaterials']);
        $router->post('/products', ['App\Controllers\ProductImportReceiptController', 'importProducts']);
    });

    $router->group(array('prefix' => '/v1/auth'), function (RouteCollector $router) {
        $router->post('/changepassword', ['App\Controllers\AuthController', 'changePassword']);
        $router->post('/forgotpassword', ['App\Controllers\AuthController', 'forgotPassword']);
        $router->get('/reset_password', ['App\Controllers\AuthController', 'checkToken']);
        $router->post('/reset_password', ['App\Controllers\AuthController', 'resetPassword']);
        $router->post('/refreshtoken', ['App\Controllers\AuthController', 'refreshToken']);
        $router->get('/profile', ['App\Controllers\AuthController', 'getProfile']);
        $router->post('/register', ['App\Controllers\AuthController', 'register']);
        $router->post('/login', ['App\Controllers\AuthController', 'login']);
    });

    $router->group(array('prefix' => '/v1/products'), function (RouteCollector $router) {
        $router->get('/count', ['App\Controllers\ProductController', 'countProducts']);

        $router->get('/{id}/inventories', ['App\Controllers\ProductController', 'getProductIventoryByProduct']);
        $router->post('/{id}/categories', ['App\Controllers\ProductController', 'addCategoryToProduct']);
        $router->get('/{id}/categories', ['App\Controllers\ProductController', 'getCategoryByProduct']);
        $router->post('/{id}/discounts', ['App\Controllers\ProductController', 'addDiscountToProduct']);
        $router->get('/{id}/materials', ['App\Controllers\ProductController', 'getMaterialByProduct']);
        $router->get('/{id}/discounts', ['App\Controllers\ProductController', 'getDiscountByProduct']);
        $router->post('/{id}/orders', ['App\Controllers\ProductController', 'addOrderToProduct']);
        $router->get('/{id}/orders', ['App\Controllers\ProductController', 'getOrderByProduct']);
        $router->put('/{id}', ['App\Controllers\ProductController', 'updateProductById']);
        $router->delete('/{id}', ['App\Controllers\ProductController', 'deleteProduct']);
        $router->get('/{id}', ['App\Controllers\ProductController', 'getProductById']);
        $router->post('/', ['App\Controllers\ProductController', 'createProduct']);
        $router->get('/', ['App\Controllers\ProductController', 'getProducts']);
    });

    $router->group(array('prefix' => '/v1/product_prices'), function (RouteCollector $router) {
        $router->put('/{id}', ['App\Controllers\ProductPriceController', 'updateProductPriceById']);
        $router->delete('/{id}', ['App\Controllers\ProductPriceController', 'deleteProductPrice']);
        $router->get('/{id}', ['App\Controllers\ProductPriceController', 'getProductPriceById']);
        $router->post('/', ['App\Controllers\ProductPriceController', 'createProductPrice']);
        $router->get('/', ['App\Controllers\ProductPriceController', 'getProductPrices']);
    });

    $router->group(array('prefix' => '/v1/product_inventories'), function (RouteCollector $router) {
        $router->put('/{id}', ['App\Controllers\ProductInventoryController', 'updateProductInventoryById']);
        $router->delete('/{id}', ['App\Controllers\ProductInventoryController', 'deleteProductInventory']);
        $router->get('/{id}', ['App\Controllers\ProductInventoryController', 'getProductInventoryById']);
        $router->post('/', ['App\Controllers\ProductInventoryController', 'createProductInventory']);
        $router->get('/', ['App\Controllers\ProductInventoryController', 'getProductInventories']);
    });

    $router->group(array('prefix' => '/v1/categories'), function (RouteCollector $router) {
        $router->get('/{id}', ['App\Controllers\CategoryController', 'getCategoryById']);
        $router->post('/{id}/discounts', ['App\Controllers\CategoryController', 'addDiscountToCategory']);
        $router->post('/{id}/materials', ['App\Controllers\CategoryController', 'addMaterialToCategory']);
        $router->get('/{id}/materials', ['App\Controllers\CategoryController', 'getMaterialByCategory']);
        $router->get('/{id}/discounts', ['App\Controllers\CategoryController', 'getDiscountByCategory']);
        $router->post('/{id}/products', ['App\Controllers\CategoryController', 'addProductToCategory']);
        $router->get('/{id}/products', ['App\Controllers\CategoryController', 'getProductByCategory']);
        $router->put('/{id}', ['App\Controllers\CategoryController', 'updateCategoryById']);
        $router->delete('/{id}', ['App\Controllers\CategoryController', 'deleteCategory']);
        $router->post('/', ['App\Controllers\CategoryController', 'createCategory']);
        $router->get('/', ['App\Controllers\CategoryController', 'getCategories']);
    });

    $router->group(array('prefix' => '/v1/discounts'), function (RouteCollector $router) {
        $router->post('/{id}/categories', ['App\Controllers\DiscountController', 'addCategoryToDiscount']);
        $router->get('/{id}/categories', ['App\Controllers\DiscountController', 'getCategoryByDiscount']);
        $router->post('/{id}/products', ['App\Controllers\DiscountController', 'addProductToDiscount']);
        $router->get('/{id}/products', ['App\Controllers\DiscountController', 'getProductByDiscount']);
        $router->put('/{id}', ['App\Controllers\DiscountController', 'updateDiscountById']);
        $router->delete('/{id}', ['App\Controllers\DiscountController', 'deleteDiscount']);
        $router->get('/{id}', ['App\Controllers\DiscountController', 'getDiscountById']);
        $router->post('/', ['App\Controllers\DiscountController', 'createDiscount']);
        $router->get('/', ['App\Controllers\DiscountController', 'getDiscounts']);
    });

    $router->group(array('prefix' => '/v1/materials'), function (RouteCollector $router) {
        $router->get('/count', ['App\Controllers\MaterialController', 'countMaterials']);

        $router->post('/{id}/export_receipt_details', ['App\Controllers\MaterialController', 'addExportReceiptDetailToMaterial']);
        $router->get('/{id}/export_receipt_details', ['App\Controllers\MaterialController', 'getExportReceiptDetailsByMaterial']);
        $router->get('/{id}/import_receipt_details', ['App\Controllers\MaterialController', 'getImportReceiptDetailsByMaterial']);
        $router->post('/{id}/categories', ['App\Controllers\MaterialController', 'addCategoryToMaterial']);
        $router->post('/{id}/providers', ['App\Controllers\MaterialController', 'addProviderToMaterial']);
        $router->get('/{id}/categories', ['App\Controllers\MaterialController', 'getCategoryByMaterial']);
        $router->get('/{id}/providers', ['App\Controllers\MaterialController', 'getProviderByMaterial']);
        $router->put('/{id}', ['App\Controllers\MaterialController', 'updateMaterialById']);
        $router->delete('/{id}', ['App\Controllers\MaterialController', 'deleteMaterial']);
        $router->get('/{id}', ['App\Controllers\MaterialController', 'getMaterialById']);
        $router->post('/', ['App\Controllers\MaterialController', 'createMaterial']);
        $router->get('/', ['App\Controllers\MaterialController', 'getMaterials']);
    });

    $router->group(array('prefix' => '/v1/material_inventories'), function (RouteCollector $router) {
        $router->put('/{id}', ['App\Controllers\MaterialInventoryController', 'updateMaterialInventoryById']);
        $router->delete('/{id}', ['App\Controllers\MaterialInventoryController', 'deleteMaterialInventory']);
        $router->get('/{id}', ['App\Controllers\MaterialInventoryController', 'getMaterialInventoryById']);
        $router->post('/', ['App\Controllers\MaterialInventoryController', 'createMaterialInventory']);
        $router->get('/', ['App\Controllers\MaterialInventoryController', 'getMaterialInventories']);
    });

    $router->group(array('prefix' => '/v1/providers'), function (RouteCollector $router) {
        $router->post('/{id}/materials', ['App\Controllers\ProviderController', 'addMaterialToProvider']);
        $router->get('/{id}/materials', ['App\Controllers\ProviderController', 'getMaterialByProvider']);
        $router->put('/{id}', ['App\Controllers\ProviderController', 'updateProviderById']);
        $router->delete('/{id}', ['App\Controllers\ProviderController', 'deleteProvider']);
        $router->get('/{id}', ['App\Controllers\ProviderController', 'getProviderById']);
        $router->post('/', ['App\Controllers\ProviderController', 'createProvider']);
        $router->get('/', ['App\Controllers\ProviderController', 'getProviders']);
    });

    $router->group(array('prefix' => '/v1/material_export_receipts'), function (RouteCollector $router) {
        $router->post('/count', ['App\Controllers\MaterialExportReceiptController', 'countTotalReceipts']);


        $router->get('/{id}/details', ['App\Controllers\MaterialExportReceiptController', 'getExportReceiptDetailsByExportReceipt']);
        $router->put('/{id}', ['App\Controllers\MaterialExportReceiptController', 'updateMaterialExportReceiptById']);
        $router->delete('/{id}', ['App\Controllers\MaterialExportReceiptController', 'deleteMaterialExportReceipt']);
        $router->get('/{id}', ['App\Controllers\MaterialExportReceiptController', 'getMaterialExportReceiptById']);
        $router->post('/', ['App\Controllers\MaterialExportReceiptController', 'createMaterialExportReceipt']);
        $router->get('/', ['App\Controllers\MaterialExportReceiptController', 'getMaterialExportReceipts']);
    });

    $router->group(array('prefix' => '/v1/material_import_receipts'), function (RouteCollector $router) {
        $router->post('/count', ['App\Controllers\MaterialImportReceiptController', 'countTotalReceipts']);

        $router->get('/{id}/details', ['App\Controllers\MaterialImportReceiptController', 'getImportReceiptDetailsByImportReceipt']);
        $router->put('/{id}', ['App\Controllers\MaterialImportReceiptController', 'updateMaterialImportReceiptById']);
        $router->delete('/{id}', ['App\Controllers\MaterialImportReceiptController', 'deleteMaterialImportReceipt']);
        $router->get('/{id}', ['App\Controllers\MaterialImportReceiptController', 'getMaterialImportReceiptById']);
        $router->post('/', ['App\Controllers\MaterialImportReceiptController', 'createMaterialImportReceipt']);
        $router->get('/', ['App\Controllers\MaterialImportReceiptController', 'getMaterialImportReceipts']);
    });

    $router->group(array('prefix' => '/v1/product_export_receipts'), function (RouteCollector $router) {
        $router->post('/count', ['App\Controllers\ProductExportReceiptController', 'countTotalReceipts']);

        $router->get('/{id}/details', ['App\Controllers\ProductExportReceiptController', 'getExportReceiptDetailsByExportReceipt']);
        $router->put('/{id}', ['App\Controllers\ProductExportReceiptController', 'updateProductExportReceiptById']);
        $router->delete('/{id}', ['App\Controllers\ProductExportReceiptController', 'deleteProductExportReceipt']);
        $router->get('/{id}', ['App\Controllers\ProductExportReceiptController', 'getProductExportReceiptById']);
        $router->post('/', ['App\Controllers\ProductExportReceiptController', 'createProductExportReceipt']);
        $router->get('/', ['App\Controllers\ProductExportReceiptController', 'getProductExportReceipts']);
    });

    $router->group(array('prefix' => '/v1/product_import_receipts'), function (RouteCollector $router) {
        $router->post('/count', ['App\Controllers\ProductImportReceiptController', 'countTotalReceipts']);

        $router->get('/{id}/details', ['App\Controllers\ProductImportReceiptController', 'getImportReceiptDetailsByExportReceipt']);
        $router->put('/{id}', ['App\Controllers\ProductImportReceiptController', 'updateProductImportReceiptById']);
        $router->delete('/{id}', ['App\Controllers\ProductImportReceiptController', 'deleteProductImportReceipt']);
        $router->get('/{id}', ['App\Controllers\ProductImportReceiptController', 'getProductImportReceiptById']);
        $router->post('/', ['App\Controllers\ProductImportReceiptController', 'createProductImportReceipt']);
        $router->get('/', ['App\Controllers\ProductImportReceiptController', 'getProductImportReceipts']);
    });

    $router->group(array('prefix' => '/v1/warehouses'), function (RouteCollector $router) {
        $router->get('/{id}/inventories', ['App\Controllers\WarehouseController', 'getProductInventoryByWarehouse']);
        $router->put('/{id}', ['App\Controllers\WarehouseController', 'updateWarehouseById']);
        $router->delete('/{id}', ['App\Controllers\WarehouseController', 'deleteWarehouse']);
        $router->get('/{id}', ['App\Controllers\WarehouseController', 'getWarehouseById']);
        $router->post('/', ['App\Controllers\WarehouseController', 'createWarehouse']);
        $router->get('/', ['App\Controllers\WarehouseController', 'getWarehouses']);
    });

    $router->group(array('prefix' => '/v1/orders'), function (RouteCollector $router) {
        $router->get('/{id}/details', ['App\Controllers\OrderController', 'getOrderDetailByOrder']);
        $router->post('/{id}/products', ['App\Controllers\OrderController', 'addProductToOrder']);
        $router->get('/{id}/products', ['App\Controllers\OrderController', 'getProductByOrder']);
        $router->put('/{id}', ['App\Controllers\OrderController', 'updateOrderById']);
        $router->delete('/{id}', ['App\Controllers\OrderController', 'deleteOrder']);
        $router->get('/{id}', ['App\Controllers\OrderController', 'getOrderById']);
        $router->post('/', ['App\Controllers\OrderController', 'createOrder']);
        $router->get('/', ['App\Controllers\OrderController', 'getOrders']);
    });

    $router->group(array('prefix' => '/v1/order_details'), function (RouteCollector $router) {
        $router->delete('/{id}', ['App\Controllers\OrderController', 'deleteOrder']);
        $router->get('/', ['App\Controllers\OrderController', 'getOrderDetails']);
    });

    $router->group(array('prefix' => '/v1/users'), function (RouteCollector $router) {
        $router->get('/{id}/inventorytransactions', ['App\Controllers\UserController', 'getInventoryTransactionByUser']);
        $router->get('/{id}/profile', ['App\Controllers\UserController', 'getProfileByUser']);
        $router->get('/{id}/orders', ['App\Controllers\UserController', 'getOrderByUser']);
        $router->put('/{id}', ['App\Controllers\UserController', 'updateUserById']);
        $router->delete('/{id}', ['App\Controllers\UserController', 'deleteUser']);
        $router->get('/{id}', ['App\Controllers\UserController', 'getUserById']);
        $router->get('/', ['App\Controllers\UserController', 'getUsers']);
    });

    $router->group(array('prefix' => '/v1/profiles'), function (RouteCollector $router) {
        $router->put('/{id}', ['App\Controllers\ProfileController', 'updateProfileById']);
        $router->delete('/{id}', ['App\Controllers\ProfileController', 'deleteProfile']);
        $router->get('/{id}', ['App\Controllers\ProfileController', 'getProfileById']);
        $router->post('/', ['App\Controllers\ProfileController', 'createProfile']);
        $router->get('/', ['App\Controllers\ProfileController', 'getProfile']);
    });

    $router->group(array('prefix' => '/v1/group_customers'), function (RouteCollector $router) {
        $router->get('/{id}/customers', ['App\Controllers\GroupCustomerController', 'getCustomerByGroupCustomer']);
        $router->put('/{id}', ['App\Controllers\GroupCustomerController', 'updateGroupCustomerById']);
        $router->delete('/{id}', ['App\Controllers\GroupCustomerController', 'deleteGroupCustomer']);
        $router->get('/{id}', ['App\Controllers\GroupCustomerController', 'getGroupCustomerById']);
        $router->post('/', ['App\Controllers\GroupCustomerController', 'createGroupCustomer']);
        $router->get('/', ['App\Controllers\GroupCustomerController', 'getGroupCustomers']);
    });

    $router->group(array('prefix' => '/v1/customers'), function (RouteCollector $router) {
        $router->get('/{id}/orders', ['App\Controllers\CustomerController', 'getOrderByCustomer']);
        $router->put('/{id}', ['App\Controllers\CustomerController', 'updateCustomerById']);
        $router->delete('/{id}', ['App\Controllers\CustomerController', 'deleteCustomer']);
        $router->get('/{id}', ['App\Controllers\CustomerController', 'getCustomerById']);
        $router->post('/', ['App\Controllers\CustomerController', 'createCustomer']);
        $router->get('/', ['App\Controllers\CustomerController', 'getCustomers']);
    });

    $router->group(array('prefix' => '/v1/roles'), function (RouteCollector $router) {
        $router->get('/{id}/users', ['App\Controllers\RoleController', 'getUserByRole']);
        $router->put('/{id}', ['App\Controllers\RoleController', 'updateRoleById']);
        $router->delete('/{id}', ['App\Controllers\RoleController', 'deleteRole']);
        $router->get('/{id}', ['App\Controllers\RoleController', 'getRoleById']);
        $router->post('/', ['App\Controllers\RoleController', 'createRole']);
        $router->get('/', ['App\Controllers\RoleController', 'getRoles']);
    });
});


$dispatcher = new Dispatcher($router->getData());

$response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

echo $response;
