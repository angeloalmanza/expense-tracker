<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = $request->user()->transactions()->latest()->get();
        return response()->json($transactions);
    }

    public function store(StoreTransactionRequest $request)
    {
        $transaction = $request->user()->transactions()->create($request->validated());

        return response()->json($transaction, 201);
    }

    public function update(UpdateTransactionRequest $request, string $id)
    {
        $transaction = $request->user()->transactions()->findOrFail($id);
        $transaction->update($request->validated());

        return response()->json($transaction);
    }

    public function destroy(Request $request, string $id)
    {
        $transaction = $request->user()->transactions()->findOrFail($id);
        $transaction->delete();

        return response()->json(null, 204);
    }
}
