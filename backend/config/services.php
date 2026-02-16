<?php

return [
    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id'     => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect'      => env('GOOGLE_REDIRECT_URI'),
    ],

    'groq' => [
        'api_key' => env('GROQ_API_KEY', ''),
        'base_url' => env('GROQ_BASE_URL', 'https://api.groq.com/openai/v1'),
        'categorization_model' => env('GROQ_CATEGORIZATION_MODEL', 'llama-3.1-8b-instant'),
        'insights_model' => env('GROQ_INSIGHTS_MODEL', 'llama-3.3-70b-versatile'),
    ],
];
