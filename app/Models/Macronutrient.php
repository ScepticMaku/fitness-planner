<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Macronutrient extends Model
{
    protected $fillable = [
        'diet_guideline_id',
        'protein_grams',
        'carbohydrates',
        'fats'
    ];

    public function dietGuideline() {
        return $this->belongsTo(DietGuideline::class);
    }
}
