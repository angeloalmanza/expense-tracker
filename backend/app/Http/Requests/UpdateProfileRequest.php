<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $this->user()->id],
            'avatar' => ['nullable', 'string', 'max:500'],
            'current_password' => ['nullable', 'string'],
            'new_password' => ['nullable', 'confirmed', Password::min(8)],
        ];
    }
}
