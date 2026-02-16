<?php

namespace App\Models;

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
