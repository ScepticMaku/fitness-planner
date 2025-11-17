<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvailabilitySlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'trainer_id',
        'start_time',
        'end_time',
        'is_booked'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_booked' => 'boolean',
    ];

    public function trainer()
    {
        return $this->belongsTo(Trainer::class);
    }

    public function session()
    {
        return $this->hasOne(WorkoutSession::class);
    }
}
