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
        'workout_structure',
        'diet_guidelines',
    ];

    protected $casts = [
        'workout_structure' => 'array',
        'diet_guidelines' => 'array',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
