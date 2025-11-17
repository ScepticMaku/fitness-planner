<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'user_id',
        'schedule_date',
        'schedule_time',
        'status'
    ];

    public function trainer() {
        return $this->belongsTo(Trainer::class);
    }

}
