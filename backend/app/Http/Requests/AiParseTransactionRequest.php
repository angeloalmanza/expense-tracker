<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AiParseTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'text' => 'required|string|max:500',
            'categories' => 'required|array|min:1',
            'categories.*' => 'string|max:100',
        ];
    }
}
