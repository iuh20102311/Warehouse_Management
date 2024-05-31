<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Exception;
use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class ProductInventory extends Model
{
    use HasFactory;
    protected $table = 'product_inventories';
    protected $fillable = ['product_id','warehouse_id','provider_id','quantity_available','minimum_stock_level','status','created_at','updated_at'];
    protected $primaryKey = 'id';
    public $timestamps = true;


    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @throws Exception
     */
    public function validate(array $data, bool $isUpdate = false) : string
    {
        $validators = [
            'product_id' => v::notEmpty()->setName('product_id')->setTemplate('Khách hàng không được rỗng'),
            'warehouse_id' => v::notEmpty()->setName('warehouse_id')->setTemplate('Nhà kho không được rỗng'),
            'quantity_available' => v::notEmpty()->numericVal()->positive()->setName('quantity_available')->setTemplate('Số lượng hiện có không hợp lệ. Số lượng hiện có không được trống và phải là số dương.'),
            'minimum_stock_level' => v::notEmpty()->numericVal()->positive()->setName('minimum_stock_level')->setTemplate('Mức tồn kho tối thiểu không hợp lệ. Mức tồn kho tối thiểu không được trống và phải là số dương.'),
            'status' => v::notEmpty()->in(['ACTIVE', 'DELETED'])->setName('status')->setTemplate('Trạng thái không hợp lệ. Trạng thái chỉ có thể là ACTIVE hoặc DELETED.'),
        ];

        $error = "";
        foreach ($validators as $field => $validator) {
            if ($isUpdate && !array_key_exists($field, $data)) {
                continue;
            }

            try {
                $validator->assert(isset($data[$field]) ? $data[$field] : null);
            } catch (ValidationException $exception) {
                $error = $exception->getMessage();
                break;
            }
        }
        return $error;
    }
}