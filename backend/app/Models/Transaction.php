<?php

namespace App\Models;

use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'amount',
        'type',
        'category',
        'date',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'float',
            'type' => TransactionType::class,
            'date' => 'date:Y-m-d',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
