<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'trainer_id',
        'exercise_id',
        'slot_id',
        'status',
        'date_requested'
    ];

    public function slot() {
        return $this->belongsTo(AvailabilitySlot::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function trainer() {
        return $this->belongsTo(Trainer::class);
    }

    public function exercise() {
        return $this->belongsTo(Exercise::class);
    }
}
