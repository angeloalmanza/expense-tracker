<?php

namespace App\Http\Requests;

use App\Enums\Frequency;
use App\Enums\TransactionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreRecurringTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'type' => ['required', new Enum(TransactionType::class)],
            'category' => ['required', 'string', 'max:100'],
            'frequency' => ['required', new Enum(Frequency::class)],
            'start_date' => ['required', 'date'],
        ];
    }
}
