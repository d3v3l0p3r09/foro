<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Reply;

class ReplyObserver
{
    /** +5 karma cuando el autor del hilo marca una respuesta como mejor. */
    public function updated(Reply $reply): void
    {
        if (! $reply->wasChanged('is_best') || ! $reply->is_best) {
            return;
        }

        $reply->user?->addKarma(5);
    }
}
