<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserHasPlan extends Model
{
    protected $fillable = [
        'user_id',
        'plan_template_id',
        'is_active'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function planTemplate() {
        return $this->belongsTo(PlanTemplate::class);
    }
}
