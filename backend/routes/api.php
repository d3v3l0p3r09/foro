<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReplyController;
use App\Http\Controllers\ThreadController;
use Illuminate\Support\Facades\Route;

// Público
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('auth/google', [AuthController::class, 'google']);
Route::get('auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('auth/google/callback', [GoogleAuthController::class, 'callback']);

Route::get('categories', [CategoryController::class, 'index']);
Route::get('threads', [ThreadController::class, 'index']);
Route::get('threads/{thread}', [ThreadController::class, 'show']);
Route::get('threads/{thread}/replies', [ReplyController::class, 'index']);

// Autenticado
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);
    Route::post('profile/update-images', [ProfileController::class, 'updateImages']);
    Route::get('profile/threads', [ProfileController::class, 'threads']);
    Route::get('profile/replies', [ProfileController::class, 'replies']);

    Route::post('threads', [ThreadController::class, 'store']);
    Route::post('threads/{thread}/vote', [ThreadController::class, 'vote']);
    Route::post('threads/{thread}/bookmark', [ThreadController::class, 'bookmark']);
    Route::delete('threads/{thread}/bookmark', [ThreadController::class, 'unbookmark']);

    Route::post('threads/{thread}/replies', [ReplyController::class, 'store']);
    Route::post('replies/{reply}/best', [ReplyController::class, 'markBest']);
    Route::post('replies/{reply}/vote', [ReplyController::class, 'vote']);

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('dashboard', [AdminController::class, 'dashboard']);
    });
});
