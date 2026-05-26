<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Thread\StoreThreadRequest;
use App\Http\Requests\Vote\CastVoteRequest;
use App\Models\Thread;
use App\Models\Vote;
use App\Services\VoteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ThreadController extends Controller
{
    public function __construct(private readonly VoteService $voteService) {}

    public function index(Request $request): JsonResponse
    {
        $query = Thread::query()
            ->with(['user:id,name,avatar,karma', 'category:id,name,slug'])
            ->withCount('replies')
            ->sortBy($request->query('sort', 'recent'));

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        $threads = $query->paginate(10);
        $user = $request->user('sanctum');

        if ($user) {
            $threadIds = collect($threads->items())->pluck('id');
            $bookmarks = $user->bookmarkedThreads()->whereIn('threads.id', $threadIds)->pluck('threads.id');
            $votes = Vote::where('user_id', $user->id)
                ->where('votable_type', (new Thread)->getMorphClass())
                ->whereIn('votable_id', $threadIds)
                ->pluck('value', 'votable_id');

            $threads->getCollection()->transform(function (Thread $thread) use ($bookmarks, $votes) {
                $thread->setAttribute('is_bookmarked', $bookmarks->contains($thread->id));
                $thread->setAttribute('user_vote', $votes->get($thread->id));

                return $thread;
            });
        }

        return response()->json($threads);
    }

    public function show(Request $request, Thread $thread): JsonResponse
    {
        $thread->increment('views');
        $thread->load(['user:id,name,avatar,karma', 'category:id,name,slug']);
        $thread->loadCount('replies');

        $user = $request->user('sanctum');
        if ($user) {
            $thread->setAttribute('is_bookmarked', $user->bookmarkedThreads()->where('thread_id', $thread->id)->exists());
            $vote = Vote::where('user_id', $user->id)
                ->where('votable_type', $thread->getMorphClass())
                ->where('votable_id', $thread->id)
                ->value('value');
            $thread->setAttribute('user_vote', $vote);
        }

        return response()->json($thread);
    }

    public function store(StoreThreadRequest $request): JsonResponse
    {
        $thread = Thread::create([
            'title' => $request->validated('title'),
            'body' => $request->validated('body'),
            'user_id' => $request->user()->id,
            'category_id' => $request->validated('category_id'),
        ]);

        $thread->load(['user:id,name,avatar', 'category:id,name,slug']);
        $thread->loadCount('replies');

        return response()->json($thread, 201);
    }

    public function vote(CastVoteRequest $request, Thread $thread): JsonResponse
    {
        $result = $this->voteService->cast($request->user(), $thread, $request->integer('value'));

        return response()->json($result);
    }

    public function bookmark(Request $request, Thread $thread): JsonResponse
    {
        $request->user()->bookmarkedThreads()->syncWithoutDetaching([$thread->id]);

        return response()->json(['is_bookmarked' => true]);
    }

    public function unbookmark(Request $request, Thread $thread): JsonResponse
    {
        $request->user()->bookmarkedThreads()->detach($thread->id);

        return response()->json(['is_bookmarked' => false]);
    }
}
