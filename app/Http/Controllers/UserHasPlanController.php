<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\PlanTemplate;
use App\Models\UserHasPlan;
use App\Models\WorkoutProgress;
use Illuminate\Http\Request;
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

    public function start(Request $request, string $id) {
        $userId = Auth::user()->id;
        $plans = UserHasPlan::get();
        $exerciseId = Exercise::where('workout_structure_id', $request->workout_structure_id)->first()->id;
        $exercises = Exercise::where('workout_structure_id', $request->workout_structure_id)->get();

        foreach ($plans as $plan) {
            if($plan->user_id == $userId) {
                $planId = $plan->id;
                $foundPlan = UserHasPlan::find($planId);
                break;
            }
        }

        if ($foundPlan) {
            $request->validate([
                'workout_structure_id' => 'required|integer',
                'diet_guideline_id' => 'required|integer',
            ]);

            $foundPlan->update([
                'workout_structure_id' => $request->workout_structure_id,
                'diet_guideline_id' => $request->diet_guideline_id,
                'is_active' => 1
            ]);

            $workoutProgress = WorkoutProgress::create([
                'user_id' => $userId,
                'exercise_id' => $exerciseId,
                'workout_structure_id' => $request->workout_structure_id,
                'diet_guideline_id' => $request->diet_guideline_id
            ]);

            foreach($exercises as $exercise) {
                $workoutProgress->exerciseProgress()->create([
                    'exercise_id' => $exercise->id,
                ]);
            }

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
