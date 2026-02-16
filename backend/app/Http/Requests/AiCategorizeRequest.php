<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AiCategorizeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'categories' => 'required|array|min:1',
            'categories.*' => 'string|max:100',
        ];
    }
}
