<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'trainer_id',
        'member_id',
        'start_date',
        'end_date',
        'status'
    ];

    public function trainer() {
        return $this->belongsTo(Trainer::class);
    }

}
