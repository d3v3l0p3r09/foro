<?php

declare(strict_types=1);

namespace App\Http\Requests\Vote;

use Illuminate\Foundation\Http\FormRequest;

class CastVoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'value' => ['required', 'integer', 'in:1,-1'],
        ];
    }
}
