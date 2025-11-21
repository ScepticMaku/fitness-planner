<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\DietGuideline;
use App\Models\Exercise;
use App\Models\ExerciseProgress;
use App\Models\Trainer;
use App\Models\WorkoutLog;
use App\Models\WorkoutProgress;
use App\Models\WorkoutStructure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard() {
        $user = Auth::user();
        $userId = $user->id;
        $appointments = Appointment::with('slot', 'user', 'trainer.user', 'exercise')->where('status', 'approved')->get();
        $trainer = Trainer::where('user_id', $userId)->first();

        if($appointments) {
            if($trainer) {
                $trainerId = $trainer->id;
                $workoutLogs = WorkoutLog::with('workoutProgress', 'exercise', 'user')->where('trainer_id', $trainerId)->limit(5)->get();
                $trainerAppointments = $appointments->where('trainer_id', $trainerId);
                $pendingAppointments = Appointment::with('slot', 'user', 'trainer', 'exercise')->where('status', 'pending')->where('trainer_id', $trainerId)->get();
                return Inertia::render('dashboard', [
                    'trainerAppointments' => $trainerAppointments,
                    'appointments' => $appointments,
                    'pendingAppointments' => $pendingAppointments,
                    'workoutLogs' => $workoutLogs,
                    'userAppointments' => [],
                ]);
            }

            $progress = WorkoutProgress::with('user', 'exercise', 'workoutStructure', 'dietGuideline', 'exerciseProgress')->where('user_id', $userId)->where('status', 'in-progress')->first();

            if($progress) {

                $workoutLogs = WorkoutLog::with('exercise', 'trainer.user', 'user', 'workoutProgress')->where('workout_progress_id', $progress->id)->limit(5)->get();

                $exercises = ExerciseProgress::with('exercise')->where('workout_progress_id', $progress->id)->get();

                $exerciseId = $progress->exercise_id;
                $dietGuidelineId = $progress->diet_guideline_id;

                $currentExercise = Exercise::find($exerciseId);
                $workoutStructureId = $currentExercise->workout_structure_id;
                $workoutStructure = WorkoutStructure::find($workoutStructureId);
                $dietGuideline = DietGuideline::with('macronutrient', 'rule', 'foodRecommendation', 'foodLimitation')->find($dietGuidelineId);

                $userAppointments = Appointment::with('slot', 'user', 'trainer.user', 'exercise')->where('status', 'approved')->where('user_id', $userId)->get();

                if($userAppointments) {
                    return Inertia::render('dashboard', [
                        'exercises' => $exercises,
                        'progress' => $progress,
                        'appointments' => $appointments,
                        'userAppointments' => $userAppointments,
                        'pendingAppointments' => [],
                        'workoutLogs' => $workoutLogs,
                        'currentExercise' => $currentExercise,
                        'workoutStructure' => $workoutStructure,
                        'dietGuideline' => $dietGuideline,
                        'trainerAppointments' => [],
                    ]);
                }
                return Inertia::render('dashboard', [
                    'exercises' => $exercises,
                    'progress' => $progress,
                    'appointments' => $appointments,
                    'userAppointments' => [],
                    'pendingAppointments' => [],
                    'workoutLogs' => $workoutLogs,
                    'currentExercise' => $currentExercise,
                    'workoutStructure' => $workoutStructure,
                    'dietGuideline' => $dietGuideline,
                    'trainerAppointments' => [],
                ]);
            }
            return Inertia::render('dashboard', [
                'exercises' => [],
                'progress' => [],
                'appointments' => $appointments,
                'userAppointments' => [],
                'pendingAppointments' => [],
                'workoutLogs' => [],
                'currentExercise' => [],
                'workoutStucture' => [],
                'dietGuideline' => [],
                'trainerAppointments' => [],
            ]);
        }
        return Inertia::render('dashboard', [
            'exercises' => [],
            'progress' => [],
            'appointments' => $appointments,
            'userAppointments' => [],
            'pendingAppointments' => $pendingAppointments,
            'workoutLogs' => [],
            'currentExercise' => [],
            'workoutStucture' => [],
            'dietGuideline' => [],
            'trainerAppointments' => [],
        ]);
    }
}
