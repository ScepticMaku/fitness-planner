<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trainer extends Model
{
    protected $fillable = [
        'user_id',
        'bio',
        'specialization',
        'trainer_status'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
