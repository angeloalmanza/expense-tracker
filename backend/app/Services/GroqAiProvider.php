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

    public function parseTransaction(string $text, array $categories, string $today): ?array
    {
        $categoriesList = implode(', ', $categories);

        $response = $this->chat($this->categorizationModel, [
            [
                'role' => 'system',
                'content' => "Sei un assistente che estrae dati di transazioni finanziarie da testo libero. La data di oggi è {$today}. Dall'input dell'utente estrai i seguenti campi e rispondi SOLO con un oggetto JSON valido, senza altro testo:\n- \"name\": stringa breve che descrive la transazione\n- \"amount\": numero positivo (solo il valore, senza simbolo valuta)\n- \"type\": \"income\" se è un'entrata, \"expense\" se è una spesa\n- \"category\": una tra queste categorie: {$categoriesList}\n- \"date\": data in formato YYYY-MM-DD (risolvi riferimenti relativi come \"ieri\", \"oggi\", \"lunedì scorso\" rispetto alla data odierna)\n\nSe non riesci a estrarre tutti i campi, rispondi con: null",
            ],
            [
                'role' => 'user',
                'content' => $text,
            ],
        ], 0);

        if ($response === null) {
            return null;
        }

        $response = trim($response);

        if ($response === 'null') {
            return null;
        }

        // Strip markdown code fences if present
        if (str_starts_with($response, '```')) {
            $response = preg_replace('/^```(?:json)?\s*/', '', $response);
            $response = preg_replace('/\s*```$/', '', $response);
        }

        $parsed = json_decode($response, true);

        if (!is_array($parsed)) {
            return null;
        }

        // Validate all required fields
        $required = ['name', 'amount', 'type', 'category', 'date'];
        foreach ($required as $field) {
            if (!isset($parsed[$field])) {
                return null;
            }
        }

        if (!in_array($parsed['type'], ['income', 'expense'], true)) {
            return null;
        }

        if (!in_array($parsed['category'], $categories, true)) {
            return null;
        }

        $parsed['amount'] = (float) $parsed['amount'];
        if ($parsed['amount'] <= 0) {
            return null;
        }

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $parsed['date'])) {
            return null;
        }

        $parsed['name'] = (string) $parsed['name'];

        return $parsed;
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
