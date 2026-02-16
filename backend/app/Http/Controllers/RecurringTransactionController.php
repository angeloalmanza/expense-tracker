<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRecurringTransactionRequest;
use App\Http\Requests\UpdateRecurringTransactionRequest;
use App\Services\RecurringTransactionService;
use Illuminate\Http\Request;

class RecurringTransactionController extends Controller
{
    public function index(Request $request)
    {
        $recurring = $request->user()->recurringTransactions()->latest()->get();
        return response()->json($recurring);
    }

    public function store(StoreRecurringTransactionRequest $request, RecurringTransactionService $service)
    {
        $validated = $request->validated();
        $validated['next_occurrence'] = $validated['start_date'];

        $recurring = $request->user()->recurringTransactions()->create($validated);

        $service->generateDueTransactions($recurring);

        return response()->json($recurring->fresh(), 201);
    }

    public function update(UpdateRecurringTransactionRequest $request, string $id)
    {
        $recurring = $request->user()->recurringTransactions()->findOrFail($id);
        $recurring->update($request->validated());

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
