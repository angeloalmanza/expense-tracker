<?php

namespace App\Contracts;

interface AiProvider
{
    public function categorize(string $name, array $categories): ?string;

    public function generateInsights(array $data): string;

    public function parseTransaction(string $text, array $categories, string $today): ?array;
}
