<?php

namespace App\Services;

use App\Contracts\AiProvider;
use App\Enums\TransactionType;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class AiInsightsService
{
    public function __construct(private AiProvider $ai) {}

    public function getInsights(User $user): string
    {
        $cacheKey = "ai_insights_user_{$user->id}";

        return Cache::remember($cacheKey, 6 * 60 * 60, function () use ($user) {
            $data = $this->buildData($user);
            return $this->ai->generateInsights($data);
        });
    }

    public function clearCache(User $user): void
    {
        Cache::forget("ai_insights_user_{$user->id}");
    }

    private function buildData(User $user): array
    {
        $now = now();
        $currentStart = $now->copy()->startOfMonth();
        $currentEnd = $now->copy()->endOfMonth();
        $previousStart = $now->copy()->subMonth()->startOfMonth();
        $previousEnd = $now->copy()->subMonth()->endOfMonth();

        $transactions = $user->transactions()
            ->where('date', '>=', $previousStart)
            ->where('date', '<=', $currentEnd)
            ->get();

        $current = ['entrate' => 0, 'uscite' => 0, 'per_categoria' => [], 'numero_transazioni' => 0];
        $previous = ['entrate' => 0, 'uscite' => 0, 'per_categoria' => [], 'numero_transazioni' => 0];

        foreach ($transactions as $t) {
            $date = \Carbon\Carbon::parse($t->date);
            $amount = (float) $t->amount;

            if ($date->between($currentStart, $currentEnd)) {
                $target = &$current;
            } elseif ($date->between($previousStart, $previousEnd)) {
                $target = &$previous;
            } else {
                continue;
            }

            $target['numero_transazioni']++;

            if ($t->type === TransactionType::Income) {
                $target['entrate'] += $amount;
            } else {
                $target['uscite'] += $amount;
                $category = $t->category ?? 'Altro';
                $target['per_categoria'][$category] = ($target['per_categoria'][$category] ?? 0) + $amount;
            }

            unset($target);
        }

        $budgets = [];
        $userBudgets = $user->budgets()->get();
        foreach ($userBudgets as $b) {
            $budgets[$b->category] = (float) $b->amount;
        }

        return [
            'mese_corrente' => $current,
            'mese_precedente' => $previous,
            'budget' => $budgets,
        ];
    }
}
