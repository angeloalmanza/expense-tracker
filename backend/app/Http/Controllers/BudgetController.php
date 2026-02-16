<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBudgetRequest;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $budgets = $request->user()->budgets()->get();
        return response()->json($budgets);
    }

    public function store(StoreBudgetRequest $request)
    {
        $validated = $request->validated();

        $budget = $request->user()->budgets()->updateOrCreate(
            ['category' => $validated['category']],
            ['amount' => $validated['amount']],
        );

        return response()->json($budget, $budget->wasRecentlyCreated ? 201 : 200);
    }

    public function destroy(Request $request, string $id)
    {
        $budget = $request->user()->budgets()->findOrFail($id);
        $budget->delete();

        return response()->json(null, 204);
    }
}
