<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Thread;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Panel de administración',
            'admin' => $request->user()->only(['id', 'name', 'email']),
            'stats' => [
                'users_count' => User::count(),
                'threads_count' => Thread::count(),
            ],
        ]);
    }
}
