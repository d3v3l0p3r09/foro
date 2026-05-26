<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /** Listado público para el formulario de crear hilo. */
    public function index(): JsonResponse
    {
        return response()->json(Category::orderBy('name')->get(['id', 'name', 'slug']));
    }
}
