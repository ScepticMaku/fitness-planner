<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rule extends Model
{
    protected $fillable = [
        'diet_guideline_id',
        'name'
    ];

    public function dietGuideline() {
        return $this->belongsTo(DietGuideline::class);
    }
}
