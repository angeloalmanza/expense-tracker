<?php

namespace App\Http\Requests;

use App\Enums\Frequency;
use App\Enums\TransactionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateRecurringTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'type' => ['sometimes', new Enum(TransactionType::class)],
            'category' => ['sometimes', 'string', 'max:100'],
            'frequency' => ['sometimes', new Enum(Frequency::class)],
            'start_date' => ['sometimes', 'date'],
        ];
    }
}
