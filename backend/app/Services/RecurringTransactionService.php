<?php

namespace App\Services;

use App\Enums\Frequency;
use App\Models\RecurringTransaction;
use Carbon\Carbon;

class RecurringTransactionService
{
    public function generateDueTransactions(RecurringTransaction $recurring, ?Carbon $asOf = null): int
    {
        $asOf ??= Carbon::today();
        $count = 0;

        while ($recurring->next_occurrence->lte($asOf)) {
            $recurring->user->transactions()->create([
                'name' => $recurring->name,
                'amount' => $recurring->amount,
                'type' => $recurring->type,
                'category' => $recurring->category,
                'date' => $recurring->next_occurrence->toDateString(),
            ]);

            $recurring->next_occurrence = $recurring->frequency === Frequency::Weekly
                ? $recurring->next_occurrence->addWeek()
                : $recurring->next_occurrence->addMonth();

            $count++;
        }

        $recurring->save();

        return $count;
    }
}
