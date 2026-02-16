<?php

namespace App\Services;

use App\Contracts\AiProvider;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GroqAiProvider implements AiProvider
{
    private string $apiKey;
    private string $baseUrl;
    private string $categorizationModel;
    private string $insightsModel;

    public function __construct()
    {
        $this->apiKey = config('services.groq.api_key', '');
        $this->baseUrl = config('services.groq.base_url', 'https://api.groq.com/openai/v1');
        $this->categorizationModel = config('services.groq.categorization_model', 'llama-3.1-8b-instant');
        $this->insightsModel = config('services.groq.insights_model', 'llama-3.3-70b-versatile');
    }

    public function categorize(string $name, array $categories): ?string
    {
        $categoriesList = implode(', ', $categories);

        $response = $this->chat($this->categorizationModel, [
            [
                'role' => 'system',
                'content' => "Sei un classificatore di transazioni finanziarie. L'utente ti fornirà il nome di una transazione e tu devi rispondere con UNA SOLA parola: la categoria più appropriata tra quelle fornite. Non aggiungere altro testo, punteggiatura o spiegazioni. Categorie disponibili: {$categoriesList}",
            ],
            [
                'role' => 'user',
                'content' => $name,
            ],
        ], 0);

        if ($response === null) {
            return null;
        }

        $response = trim($response);

        if (in_array($response, $categories, true)) {
            return $response;
        }

        return null;
    }

    public function generateInsights(array $data): string
    {
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        $response = $this->chat($this->insightsModel, [
            [
                'role' => 'system',
                'content' => "Sei un consulente finanziario personale. Analizza i dati delle spese dell'utente e fornisci 3-5 insight utili in italiano, formattati come bullet point (usa il carattere '•'). Sii conciso, specifico e dai consigli pratici basati sui numeri. Confronta il mese corrente con quello precedente quando rilevante. Se ci sono budget superati, segnalalo. Non usare titoli o intestazioni, solo i bullet point.",
            ],
            [
                'role' => 'user',
                'content' => $json,
            ],
        ], 0.7);

        return $response ?? '';
    }

    private function chat(string $model, array $messages, float $temperature): ?string
    {
        if (empty($this->apiKey)) {
            Log::warning('Groq API key not configured');
            return null;
        }

        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(15)
                ->post("{$this->baseUrl}/chat/completions", [
                    'model' => $model,
                    'messages' => $messages,
                    'temperature' => $temperature,
                ]);

            if ($response->failed()) {
                Log::warning('Groq API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            return $response->json('choices.0.message.content');
        } catch (\Throwable $e) {
            Log::warning('Groq API error', ['message' => $e->getMessage()]);
            return null;
        }
    }
}
