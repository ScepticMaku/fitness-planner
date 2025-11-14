<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkoutProgress extends Model
{
    protected $fillable = [
        'user_id',
        'exercise_id',
        'workout_structure_id',
        'diet_guideline_id',
        'status'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function exercise() {
        return $this->belongsTo(Exercise::class);
    }

    public function workoutStructure() {
        return $this->belongsTo(WorkoutStructure::class);
    }

    public function dietGuideline() {
        return $this->belongsTo(DietGuideline::class);
    }

    public function exerciseProgress() {
        return $this->hasMany(ExerciseProgress::class);
    }

    public function workoutLog() {
        return $this->hasMany(WorkoutLog::class);
    }
}
