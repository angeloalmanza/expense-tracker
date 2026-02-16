<?php

namespace App\Models;

use App\Enums\Frequency;
use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecurringTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'amount',
        'type',
        'category',
        'frequency',
        'start_date',
        'next_occurrence',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'float',
            'type' => TransactionType::class,
            'frequency' => Frequency::class,
            'start_date' => 'date:Y-m-d',
            'next_occurrence' => 'date:Y-m-d',
            'is_active' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
