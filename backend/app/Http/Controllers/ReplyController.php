<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Reply\StoreReplyRequest;
use App\Http\Requests\Vote\CastVoteRequest;
use App\Models\Reply;
use App\Models\Thread;
use App\Services\VoteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReplyController extends Controller
{
    public function __construct(private readonly VoteService $voteService) {}

    public function index(Thread $thread): JsonResponse
    {
        $replies = $thread->replies()
            ->whereNull('parent_id')
            ->with(['user:id,name,avatar,karma', 'children.user:id,name,avatar,karma', 'children.children'])
            ->orderByDesc('is_best')
            ->orderBy('created_at')
            ->get();

        return response()->json($replies);
    }

    public function store(StoreReplyRequest $request, Thread $thread): JsonResponse
    {
        if ($request->filled('parent_id')) {
            Reply::where('thread_id', $thread->id)->findOrFail($request->integer('parent_id'));
        }

        $reply = $thread->replies()->create([
            'body' => $request->validated('body'),
            'user_id' => $request->user()->id,
            'parent_id' => $request->validated('parent_id'),
        ]);

        return response()->json($reply->load('user:id,name,avatar,karma'), 201);
    }

    public function markBest(Request $request, Reply $reply): JsonResponse
    {
        if ($reply->thread->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        Reply::where('thread_id', $reply->thread_id)->update(['is_best' => false]);
        $reply->update(['is_best' => true]);
        $reply->thread->update(['is_resolved' => true]);

        return response()->json($reply->fresh()->load('user:id,name,avatar'));
    }

    public function vote(CastVoteRequest $request, Reply $reply): JsonResponse
    {
        return response()->json(
            $this->voteService->cast($request->user(), $reply, $request->integer('value'))
        );
    }
}
