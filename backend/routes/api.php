<?php

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
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->apiResource('transactions', TransactionController::class)->only([
    'index', 'store', 'update', 'destroy',
]);

Route::middleware('auth:sanctum')->put('/profile', [ProfileController::class, 'update']);

Route::middleware('auth:sanctum')->get('/budgets', [BudgetController::class, 'index']);
Route::middleware('auth:sanctum')->post('/budgets', [BudgetController::class, 'store']);
Route::middleware('auth:sanctum')->delete('/budgets/{budget}', [BudgetController::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/categories', [CategoryController::class, 'index']);
Route::middleware('auth:sanctum')->post('/categories', [CategoryController::class, 'store']);
Route::middleware('auth:sanctum')->put('/categories/{category}', [CategoryController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/categories/{category}', [CategoryController::class, 'destroy']);

Route::middleware('auth:sanctum')->apiResource('recurring-transactions', RecurringTransactionController::class)->only([
    'index', 'store', 'update', 'destroy',
]);
Route::middleware('auth:sanctum')->patch('/recurring-transactions/{id}/toggle', [RecurringTransactionController::class, 'toggleActive']);

Route::get('/cron/recurring', function () {
    if (request()->query('token') !== env('CRON_TOKEN')) {
        abort(403);
    }

    Artisan::call('recurring:process');

    return response()->json(['status' => 'ok']);
});
