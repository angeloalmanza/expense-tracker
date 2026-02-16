<?php

namespace App\Console\Commands;

use App\Models\RecurringTransaction;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ProcessRecurringTransactions extends Command
{
    protected $signature = 'recurring:process';

    protected $description = 'Generate transactions from active recurring templates';

    public function handle(): int
    {
        $today = Carbon::today();

        $recurrences = RecurringTransaction::where('is_active', true)
            ->where('next_occurrence', '<=', $today)
            ->get();

        $count = 0;

        foreach ($recurrences as $recurring) {
            while ($recurring->next_occurrence->lte($today)) {
                $recurring->user->transactions()->create([
                    'name' => $recurring->name,
                    'amount' => $recurring->amount,
                    'type' => $recurring->type,
                    'category' => $recurring->category,
                    'date' => $recurring->next_occurrence->toDateString(),
                ]);

                $recurring->next_occurrence = $recurring->frequency === 'weekly'
                    ? $recurring->next_occurrence->addWeek()
                    : $recurring->next_occurrence->addMonth();

                $count++;
            }

            $recurring->save();
        }

        $this->info("Generated {$count} transactions from recurring templates.");

        return Command::SUCCESS;
    }
}
