<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\DietGuideline;
use App\Models\Exercise;
use App\Models\ExerciseProgress;
use App\Models\Trainer;
use App\Models\User;
use Illuminate\Http\Request;
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
        $plans = UserHasPlan::with('user')->get();
        $progress = WorkoutProgress::where('user_id', $userId)->first();
        $exercises = ExerciseProgress::with('exercise')->get();
        $allExercises = Exercise::get();
        $appointments = Appointment::with('user')->where('user_id', $userId)->get();

        if($progress != null) {
            $workoutLog = WorkoutLog::with('exercise', 'trainer.user', 'user', 'workoutProgress')->where('workout_progress_id', $progress->id)->get();
            $exercises = ExerciseProgress::with('exercise')->where('workout_progress_id', $progress->id)->get();

            $exerciseId = $progress->exercise_id;
            $workoutStructureId = $progress->workout_structure_id;
            $dietGuidelineId = $progress->diet_guideline_id;

            $currentExercise = Exercise::find($exerciseId);
            $workoutStructure = WorkoutStructure::find($workoutStructureId);
            $dietGuidelineId = DietGuideline::with('macronutrient', 'rule', 'foodRecommendation', 'foodLimitation')->find($dietGuidelineId);

            return Inertia::render('workout-progress/index', [
                'plans' => $plans,
                'currentExercise' => $currentExercise,
                'workoutLog' => $workoutLog,
                'exercises' => $exercises,
                'workoutStructure' => $workoutStructure,
                'dietGuideline' => $dietGuidelineId,
                'appointments' => $appointments,
                'allExercises' => [],
                'progress' => $progress,
                'trainer' => [],
            ]);
        }

        $appointments = Appointment::with('user')->get();
        $trainer = Trainer::with('user')->where('user_id', $userId)->first();

        if($trainer) {
            return Inertia::render('workout-progress/index', [
                'plans' => $plans,
                'currentExercise' => [],
                'workoutLog' => [],
                'exercises' => $exercises,
                'workoutStructure' => [],
                'allExercises' => $allExercises,
                'dietGuideline' => [],
                'appointments' => $appointments,
                'trainer' => $trainer,
            ]);
        }
        return Inertia::render('workout-progress/index', [
            'plans' => $plans,
            'currentExercise' => [],
            'workoutLog' => [],
            'exercises' => $exercises,
            'workoutStructure' => [],
            'allExercises' => $allExercises,
            'dietGuideline' => [],
            'appointments' => $appointments,
            'trainer' => [],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        /*
        $userId = Auth::user()->id;
        $progress = WorkoutProgress::where('user_id', $userId)->first();
        $availableTrainers = Trainer::with('user')->where('trainer_status', 'active')->get();

        if($progress != null) {
            $exerciseId = $progress->exercise_id;
            $currentExercise = Exercise::find($exerciseId);

            return Inertia::render('workout-progress/book-session', [
                'currentExercise' => $currentExercise,
                'availableTrainers' => $availableTrainers
            ]);
        }
        return Inertia::render('workout-progress/book-session', [
            'currentExercise' => [],
            'availableTrainers' => $availableTrainers
        ]);
*/
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
        $userId = User::find($id)->id;
        $user = User::find($id);
        $progress = WorkoutProgress::where('user_id', $userId)->first();
        $exercises = ExerciseProgress::with('exercise')->get();

        if($progress != null) {
            $workoutLog = WorkoutLog::with('exercise', 'trainer.user', 'user', 'workoutProgress')->where('workout_progress_id', $progress->id)->get();
            $exercises = ExerciseProgress::with('exercise')->where('workout_progress_id', $progress->id)->get();

            $exerciseId = $progress->exercise_id;
            $workoutStructureId = $progress->workout_structure_id;
            $dietGuidelineId = $progress->diet_guideline_id;

            $currentExercise = Exercise::find($exerciseId);
            $workoutStructure = WorkoutStructure::find($workoutStructureId);
            $dietGuidelineId = DietGuideline::with('macronutrient', 'rule', 'foodRecommendation', 'foodLimitation')->find($dietGuidelineId);

            return Inertia::render('workout-progress/client-progress', [
                'currentExercise' => $currentExercise,
                'workoutLog' => $workoutLog,
                'exercises' => $exercises,
                'workoutStructure' => $workoutStructure,
                'dietGuideline' => $dietGuidelineId,
                'user' => $user,
            ]);
        }
        return Inertia::render('workout-progress/client-progress', [
            'currentExercise' => [],
            'workoutLog' => [],
            'exercises' => $exercises,
            'workoutStructure' => [],
            'dietGuideline' => [],
            'user' => $user
        ]);
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

    public function viewRequests() {
        $userId = Auth::user()->id;
        $appointments = Appointment::where('user_id', $userId)->with('user', 'slot', 'trainer', 'exercise')->get();

        return Inertia::render('workout-progress/view-pending-requests', [
            'appointments' => $appointments
        ]);
    }

    public function viewDetails(string $id) {
        $appointment = Appointment::with('user', 'slot', 'trainer', 'exercise')->find($id);

        return Inertia::render('workout-progress/view-details', [
            'appointment' => $appointment
        ]);
    }
}
