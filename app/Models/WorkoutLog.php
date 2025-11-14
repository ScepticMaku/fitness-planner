<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkoutLog extends Model
{
    protected $fillable = [
        'user_id',
        'workout_progress_id',
        'exercise_id'
    ];

    public function workoutProgress() {
        return $this->belongsTo(WorkoutProgress::class);
    }

    public function exercise() {
        return $this->belongsTo(Exercise::class);
    }
}
