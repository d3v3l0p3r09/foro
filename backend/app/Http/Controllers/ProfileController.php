<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Profile\UpdateProfileImagesRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load('roles');

        return response()->json([
            'user' => $user,
            'stats' => [
                'threads_count' => $user->threads()->count(),
                'replies_count' => $user->replies()->count(),
                'karma' => $user->karma,
                'rank' => $user->rank,
            ],
        ]);
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $request->user()->update($request->validated());

        return response()->json($request->user()->fresh()->load('roles'));
    }

    /** Sube avatar y/o banner al disco public. */
    public function updateImages(UpdateProfileImagesRequest $request): JsonResponse
    {
        $user = $request->user();
        $updates = [];

        if ($request->hasFile('avatar')) {
            if ($user->avatar && str_contains($user->avatar, '/storage/')) {
                $old = str_replace('/storage/', '', parse_url($user->avatar, PHP_URL_PATH) ?? '');
                Storage::disk('public')->delete(ltrim($old, '/'));
            }
            $path = $request->file('avatar')->store("users/{$user->id}", 'public');
            $updates['avatar'] = Storage::disk('public')->url($path);
        }

        if ($request->hasFile('banner')) {
            if ($user->banner && str_contains($user->banner, '/storage/')) {
                $old = str_replace('/storage/', '', parse_url($user->banner, PHP_URL_PATH) ?? '');
                Storage::disk('public')->delete(ltrim($old, '/'));
            }
            $path = $request->file('banner')->store("users/{$user->id}", 'public');
            $updates['banner'] = Storage::disk('public')->url($path);
        }

        if ($updates !== []) {
            $user->update($updates);
        }

        return response()->json($user->fresh()->load('roles'));
    }

    public function threads(Request $request): JsonResponse
    {
        $threads = $request->user()
            ->threads()
            ->with(['category:id,name,slug'])
            ->withCount('replies')
            ->latest()
            ->paginate(10);

        return response()->json($threads);
    }

    public function replies(Request $request): JsonResponse
    {
        $replies = $request->user()
            ->replies()
            ->with(['thread:id,title', 'user:id,name'])
            ->latest()
            ->paginate(10);

        return response()->json($replies);
    }
}
