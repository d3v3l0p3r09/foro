<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Reply;
use App\Models\Thread;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Eloquent\Model;

class VoteService
{
    /** @param Thread|Reply $votable */
    public function cast(User $user, Model $votable, int $value): array
    {
        $value = $value > 0 ? 1 : -1;

        $existing = Vote::where('user_id', $user->id)
            ->where('votable_type', $votable->getMorphClass())
            ->where('votable_id', $votable->id)
            ->first();

        if ($existing && $existing->value === $value) {
            $this->revertVote($votable, $existing);
            $existing->delete();

            return $this->counts($votable, null);
        }

        if ($existing) {
            $this->revertVote($votable, $existing);
            $existing->update(['value' => $value]);
        } else {
            Vote::create([
                'user_id' => $user->id,
                'votable_type' => $votable->getMorphClass(),
                'votable_id' => $votable->id,
                'value' => $value,
            ]);
        }

        $this->applyVote($votable, $value);

        return $this->counts($votable, $value);
    }

    private function applyVote(Model $votable, int $value): void
    {
        if ($value === 1) {
            $votable->increment('upvotes');
        } else {
            $votable->increment('downvotes');
        }
    }

    private function revertVote(Model $votable, Vote $vote): void
    {
        if ($vote->value === 1) {
            $votable->decrement('upvotes');
        } else {
            $votable->decrement('downvotes');
        }
    }

    /** @param Thread|Reply $votable */
    private function counts(Model $votable, ?int $userVote): array
    {
        $votable->refresh();

        return [
            'upvotes' => $votable->upvotes,
            'downvotes' => $votable->downvotes,
            'score' => (int) $votable->upvotes - (int) $votable->downvotes,
            'user_vote' => $userVote,
        ];
    }
}
