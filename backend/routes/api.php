<?php

use App\Http\Controllers\AiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\RecurringTransactionController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('transactions', TransactionController::class)->only([
        'index', 'store', 'update', 'destroy',
    ]);

    Route::put('/profile', [ProfileController::class, 'update']);

    Route::get('/budgets', [BudgetController::class, 'index']);
    Route::post('/budgets', [BudgetController::class, 'store']);
    Route::delete('/budgets/{budget}', [BudgetController::class, 'destroy']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    Route::apiResource('recurring-transactions', RecurringTransactionController::class)->only([
        'index', 'store', 'update', 'destroy',
    ]);
    Route::patch('/recurring-transactions/{id}/toggle', [RecurringTransactionController::class, 'toggleActive']);

    Route::post('/ai/categorize', [AiController::class, 'categorize']);
    Route::get('/ai/insights', [AiController::class, 'insights']);
});

Route::get('/cron/recurring', function () {
    if (request()->query('token') !== env('CRON_TOKEN')) {
        abort(403);
    }

    Artisan::call('recurring:process');

    return response()->json(['status' => 'ok']);
});
