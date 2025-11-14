<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanTemplate extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'goal',
        'plan_type',
        'fitness_level',
        'description',
    ];

    protected $casts = [
        'workout_structure' => 'array',
        'exercises' => 'array',
        'diet_guidelines' => 'array',
        'macronutrients' => 'array',
        'rules' => 'array',
        'food_recommendations' => 'array',
        'food_limitations' => 'array'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function workoutStructure() {
        return $this->hasMany(WorkoutStructure::class);
    }

    public function dietGuideline() {
        return $this->hasMany(DietGuideline::class);
    }

    public function userHasPlans() {
        return $this->hasMany(UserHasPlan::class);
    }
}
