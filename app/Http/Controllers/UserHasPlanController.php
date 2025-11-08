<?php

namespace App\Http\Controllers;

use App\Models\PlanTemplate;
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
            return redirect()->route('fitness-plan.index')->with('message', 'Plan successfully selected!');
        }
        return redirect()->back()->with('message', 'Plan selection failed.');
    }

    public function start(string $id) {
        $userId = Auth::user()->id;
        $plans = UserHasPlan::get();

        foreach ($plans as $plan) {
            if($plan->user_id == $userId) {
                $planId = $plan->id;
                $foundPlan = UserHasPlan::find($planId);
                break;
            }
        }

        if ($foundPlan) {
            $foundPlan->update([
                'user_id' => $userId,
                'plan_template_id' => $id,
                'is_active' => 1
            ]);

            return redirect()->route('fitness-plan.index')->with('message', 'Plan successfully started!');
        }
        return redirect()->back()->with('message', 'Plan start failed.');
    }

    public function change(string $id) {
        $userId = Auth::user()->id;
        $plans = UserHasPlan::get();

        foreach ($plans as $plan) {
            if($plan->user_id == $userId) {
                $planId = $plan->id;
                $foundPlan = UserHasPlan::find($planId);
                break;
            }
        }

        if ($foundPlan) {
            $foundPlan->update([
                'user_id' => $userId,
                'plan_template_id' => $id
            ]);

            return redirect()->route('fitness-plan.index')->with('message', 'Plan successfully updated!');
        }
        return redirect()->back()->with('message', 'Plan update failed.');
    }

    public function cancel(string $id) {
        $plan = UserHasPlan::destroy($id);

        if($plan) {
            return redirect()->route('fitness-plan.index')->with('message', 'Plan successfully deleted!');
        }
        return redirect()->back()->with('message', 'Plan delete failed.');
    }
}
