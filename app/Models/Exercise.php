<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    protected $fillable = [
        'workout_structure_id',
        'name',
        'sets',
        'reps',
        'rest_seconds'
    ];

    public function workoutStructure() {
        return $this->belongsTo(WorkoutStructure::class);
    }
}
