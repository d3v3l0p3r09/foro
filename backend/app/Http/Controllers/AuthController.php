<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Auth\GoogleAuthRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function __construct(private readonly RoleService $roleService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $isFirstUser = User::count() === 0;

        $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => $request->validated('password'),
            'provider' => 'local',
        ]);

        $this->roleService->assignDefaultRole($user, $isFirstUser);

        return $this->tokenResponse($user, 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->first();

        if (! $user || ! $user->password || ! Hash::check($request->validated('password'), $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        return $this->tokenResponse($user);
    }

    /** Fallback JSON para clientes legacy; preferir redirect/callback OAuth. */
    public function google(GoogleAuthRequest $request): JsonResponse
    {
        $user = User::where('google_id', $request->validated('google_id'))->first()
            ?? User::where('email', $request->validated('email'))->first();

        if ($user) {
            $user->update([
                'google_id' => $request->validated('google_id'),
                'name' => $request->validated('name'),
                'avatar' => $request->validated('avatar'),
                'provider' => 'google',
            ]);
        } else {
            $isFirstUser = User::count() === 0;
            $user = User::create([
                'google_id' => $request->validated('google_id'),
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
                'avatar' => $request->validated('avatar'),
                'provider' => 'google',
                'password' => Hash::make(Str::random(32)),
            ]);
            $this->roleService->assignDefaultRole($user, $isFirstUser);
        }

        return $this->tokenResponse($user);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada']);
    }

    private function tokenResponse(User $user, int $status = 200): JsonResponse
    {
        $user->load('roles');
        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'user' => $user->fresh()->load('roles'),
            'token' => $token,
        ], $status);
    }
}
