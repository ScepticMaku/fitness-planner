<?php

namespace App\Http\Controllers;

use App\Models\UserHasPlan;
use Illuminate\Support\Facades\Auth;

class UserHasPlanController extends Controller
{
    public function select(string $id) {
        $userId = Auth::user()->id;

        $plan = UserHasPlan::create([
            'user_id' => $userId,
            'plan_template_id' => $id
        ]);

        if ($plan) {
            return redirect()->route('fitness-plan.index')->with('success', 'Plan successfully selected!');
        }
            return redirect()->back()->with('error', 'Plan selection failed.');
    }
}
