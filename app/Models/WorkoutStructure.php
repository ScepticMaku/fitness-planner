<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkoutStructure extends Model
{
    protected $fillable = [
        'plan_template_id',
        'name',
    ];

    public function planTemplate () {
        return $this->belongsTo(PlanTemplate::class);
    }

    public function exercise() {
        return $this->hasMany(Exercise::class);
    }

    public function workoutProgress() {
        return $this->hasMany(WorkoutProgress::class);
    }
}
