<?php

namespace App\Console\Commands;

use App\Models\RecurringTransaction;
use App\Services\RecurringTransactionService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ProcessRecurringTransactions extends Command
{
    protected $signature = 'recurring:process';

    protected $description = 'Generate transactions from active recurring templates';

    public function handle(RecurringTransactionService $service): int
    {
        $today = Carbon::today();

        $recurrences = RecurringTransaction::where('is_active', true)
            ->where('next_occurrence', '<=', $today)
            ->get();

        $count = 0;

        foreach ($recurrences as $recurring) {
            $count += $service->generateDueTransactions($recurring, $today);
        }

        $this->info("Generated {$count} transactions from recurring templates.");

        return Command::SUCCESS;
    }
}
