<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExerciseProgress extends Model
{
    protected $fillable = [
        'workout_progress_id',
        'exercise_id',
    ];

    public function workoutProgress() {
        return $this->belongsTo(WorkoutProgress::class);
    }

    public function exercise() {
        return $this->belongsTo(Exercise::class);
    }
}
