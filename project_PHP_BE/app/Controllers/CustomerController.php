<?php

namespace App\Controllers;

use App\Models\Customer;
use App\Models\GroupCustomer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class CustomerController
{
    public function getCustomers(): Collection
    {
        $customer = Customer::query()->where('status', '!=' , 'DELETED');

        if (isset($_GET['status'])) {
            $status = urldecode($_GET['status']);
            $customer->where('status', $status);
        }

        if (isset($_GET['name'])) {
            $name = urldecode($_GET['name']);
            $customer->where('name', 'like', $name . '%');
        }

        if (isset($_GET['gender'])) {
            $gender = urldecode($_GET['gender']);
            $customer->where('gender', $gender);
        }

        if (isset($_GET['email'])) {
            $email = urldecode($_GET['email']);
            $customer->where('email', 'like', $email . '%');
        }

        if (isset($_GET['phone'])) {
            $phone = urldecode($_GET['phone']);
            $length = strlen($phone);
            $customer->whereRaw('SUBSTRING(phone, 1, ?) = ?', [$length, $phone]);
        }

        if (isset($_GET['address'])) {
            $address = urldecode($_GET['address']);
            $customer->where('address', 'like', '%' . $address . '%');
        }

        if (isset($_GET['city'])) {
            $city = urldecode($_GET['city']);
            $customer->where('city', 'like', '%' . $city . '%');
        }

        if (isset($_GET['district'])) {
            $district = urldecode($_GET['district']);
            $customer->where('district', 'like', '%' . $district . '%');
        }

        if (isset($_GET['ward'])) {
            $ward = urldecode($_GET['ward']);
            $customer->where('ward', 'like', '%' . $ward . '%');
        }

        return $customer->get();
    }

    public function getCustomerById($id) : ?Model
    {
        $customer = Customer::query()->where('id',$id)->first();
        $group_customer = GroupCustomer::query()->where('id',$customer->group_customer_id)->first();
        if ($customer) {
            unset($customer->group_customer_id);
            $customer->group_customer = $group_customer;
            return $customer;
        } else {
            return null;
        }
    }

    public function getOrderByCustomer($id) : ?Collection
    {
        $customer = Customer::query()->where('id', $id)->first();

        if ($customer) {
            return $customer->orders()->get();
        } else {
            return null;
        }
    }
    public function createCustomer(): Model | string
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $customer = new Customer();
        $error = $customer->validate($data);
        if ($error != "") {
            http_response_code(404);
            error_log($error);
            return json_encode(["error" => $error]);
        }
        $customer->fill($data);
        $customer->save();
        return $customer;
    }

    public function updateCustomerById($id): bool | int | string
    {
        $customer = Customer::find($id);

        if (!$customer) {
            http_response_code(404);
            return json_encode(["error" => "Provider not found"]);
        }

        $data = json_decode(file_get_contents('php://input'), true);
        $error = $customer->validate($data, true);

        if ($error != "") {
            http_response_code(404);
            error_log($error);
            return json_encode(["error" => $error]);
        }

        $customer->fill($data);
        $customer->save();

        return $customer;
    }

    public function deleteCustomer($id)
    {
        $customer = Customer::find($id);

        if ($customer) {
            $customer->status = 'DELETED';
            $customer->save();
            return "Xóa thành công";
        }
        else {
            http_response_code(404);
            return "Không tìm thấy";
        }
    }
}