<?php

namespace App\Http\Controllers;

use App\Models\DietGuideline;
use App\Models\Exercise;
use App\Models\ExerciseProgress;
use Illuminate\Http\Request;
use App\Models\PlanTemplate as ModelsPlanTemplate;
use App\Models\UserHasPlan;
use App\Models\WorkoutLog;
use App\Models\WorkoutProgress;
use App\Models\WorkoutStructure;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WorkoutProgressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::user()->id;

        $progress = WorkoutProgress::where('user_id', $userId)->first();

        if($progress != null) {
            $workoutLog = WorkoutLog::with('exercise')->where('workout_progress_id', $progress->id)->get();
            $exercises = ExerciseProgress::with('exercise')->where('workout_progress_id', $progress->id)->get();

            $exerciseId = $progress->exercise_id;
            $workoutStructureId = $progress->workout_structure_id;
            $dietGuidelineId = $progress->diet_guideline_id;

            $currentExercise = Exercise::find($exerciseId);
            $workoutStructure = WorkoutStructure::find($workoutStructureId);
            $dietGuidelineId = DietGuideline::with('macronutrient', 'rule', 'foodRecommendation', 'foodLimitation')->find($dietGuidelineId);

            return Inertia::render('workout-progress/index', [
                'currentExercise' => $currentExercise,
                'workoutLog' => $workoutLog,
                'exercises' => $exercises,
                'workoutStructure' => $workoutStructure,
                'dietGuideline' => $dietGuidelineId
            ]);
        }
        return Inertia::render('workout-progress/index', [
            'currentExercise' => [],
            'workoutLog' => [],
            'exercises' => [],
            'workoutStructure' => [],
            'dietGuideline' => []
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('workout-progress/book-session');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Inertia::render('workout-progress/client-progress');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
