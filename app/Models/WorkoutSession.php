<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutSession extends Model
{
    use HasFactory;

    protected  $fillable = [
        'user_id',
        'trainer_id',
        'slot_id',
        'exercise_id',
        'booked_at',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime,'
    ];

    public function trainer()
    {
        return $this->belongsTo(Trainer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function slot() {
        return $this->belongsTo(AvailabilitySlot::class);
    }

    public function exercise() {
        return $this->belongsTo(Exercise::class);
    }
}
