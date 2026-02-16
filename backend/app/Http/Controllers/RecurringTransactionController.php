<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;

class RecurringTransactionController extends Controller
{
    public function index(Request $request)
    {
        $recurring = $request->user()->recurringTransactions()->latest()->get();
        return response()->json($recurring);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'type' => ['required', 'in:income,expense'],
            'category' => ['required', 'string', 'max:100'],
            'frequency' => ['required', 'in:weekly,monthly'],
            'start_date' => ['required', 'date'],
        ]);

        $validated['next_occurrence'] = $validated['start_date'];

        $recurring = $request->user()->recurringTransactions()->create($validated);

        $today = Carbon::today();

        while ($recurring->next_occurrence->lte($today)) {
            $request->user()->transactions()->create([
                'name' => $recurring->name,
                'amount' => $recurring->amount,
                'type' => $recurring->type,
                'category' => $recurring->category,
                'date' => $recurring->next_occurrence->toDateString(),
            ]);

            $recurring->next_occurrence = $recurring->frequency === 'weekly'
                ? $recurring->next_occurrence->addWeek()
                : $recurring->next_occurrence->addMonth();
        }

        $recurring->save();

        return response()->json($recurring->fresh(), 201);
    }

    public function update(Request $request, string $id)
    {
        $recurring = $request->user()->recurringTransactions()->findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'type' => ['sometimes', 'in:income,expense'],
            'category' => ['sometimes', 'string', 'max:100'],
            'frequency' => ['sometimes', 'in:weekly,monthly'],
            'start_date' => ['sometimes', 'date'],
        ]);

        $recurring->update($validated);

        return response()->json($recurring);
    }

    public function destroy(Request $request, string $id)
    {
        $recurring = $request->user()->recurringTransactions()->findOrFail($id);
        $recurring->delete();

        return response()->json(null, 204);
    }

    public function toggleActive(Request $request, string $id)
    {
        $recurring = $request->user()->recurringTransactions()->findOrFail($id);
        $recurring->update(['is_active' => !$recurring->is_active]);

        return response()->json($recurring);
    }
}
