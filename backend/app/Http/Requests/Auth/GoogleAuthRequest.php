<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class GoogleAuthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'google_id' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'name' => ['required', 'string', 'max:255'],
            'avatar' => ['nullable', 'url', 'max:500'],
            'access_token' => ['nullable', 'string'],
        ];
    }
}
