<?php

namespace App\Providers;

use App\Contracts\AiProvider;
use App\Services\GroqAiProvider;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(AiProvider::class, GroqAiProvider::class);
    }

    public function boot(): void
    {
        //
    }
}
