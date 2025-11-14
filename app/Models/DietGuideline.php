<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DietGuideline extends Model
{
    protected $fillable = [
        'plan_template_id',
        'name',
        'description',
        'diet_type',
        'calorie_target'
    ];

    public function planTemplate() {
        return $this->belongsTo(PlanTemplate::class);
    }

    public function macronutrient () {
        return $this->hasOne(Macronutrient::class);
    }

    public function rule () {
        return $this->hasMany(Rule::class);
    }

    public function foodRecommendation () {
        return $this->hasMany(FoodRecommendation::class);
    }

    public function foodLimitation () {
        return $this->hasMany(FoodLimitation::class);
    }
}
