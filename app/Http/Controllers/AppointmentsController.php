<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AvailabilitySlot;
use App\Models\ExerciseProgress;
use App\Models\Trainer;
use App\Models\UserHasPlan;
use App\Models\WorkoutLog;
use App\Models\WorkoutProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Pest\Mutate\Mutators\Number\IncrementInteger;

class AppointmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $appointments = Appointment::with('user', 'slot', 'trainer', 'exercise')->get();

        return Inertia::render('appointments/index', [
            'appointments' => $appointments
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
        $appointment = Appointment::with('user', 'slot', 'trainer', 'exercise')->find($id);

        return Inertia::render('appointments/show', [
            'appointment' => $appointment
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

    public function approve (string $id) {
        $appointment = Appointment::find($id);
        $slot = AvailabilitySlot::find($appointment->slot_id);

        $appointment->update([
            'status' => 'approved',
        ]);

        $slot->update([
            'is_booked' => 1,
        ]);

        return redirect()->route('appointments.index')->with('Appointment Successfully Approved');
    }

    public function decline (string $id) {
        $appointment = Appointment::find($id);

        $appointment->update([
            'status' => 'declined',
        ]);

        return redirect()->route('appointments.index')->with('Appointment Successfully Declined');
    }

    public function complete (string $id) {
        $authId = Auth::user()->id;
        $appointment = Appointment::with('user')->where('user_id', $id)->where('status', 'approved')->first();
        $userId = $appointment->user_id;
        $trainerId = Trainer::where('user_id', $authId)->first()->id;

        $workoutProgress = WorkoutProgress::withCount(['exerciseProgress', 'exerciseProgress as completed_exercises_count' => function($query) {
            $query->where('status', 'completed');
        }])->where('user_id', $userId)->first();

        $workoutProgressId = $workoutProgress->id;
        $exerciseId = $workoutProgress->exercise_id;
        $exerciseProgress = ExerciseProgress::with('exercise')->where('workout_progress_id', $workoutProgressId)->where('exercise_id', $exerciseId)->first();

        $workoutLog = WorkoutLog::create([
            'user_id' => $userId,
            'workout_progress_id' => $workoutProgressId,
            'exercise_id' => $exerciseId,
            'date_completed' => now(),
            'trainer_id' => $trainerId
        ]);

        if($workoutLog) {
            $exerciseProgress->update([
                'status' => 'completed',
            ]);

            $appointment->update([
                'status' => 'completed',
            ]);

            if (($workoutProgress->completed_exercises_count + 1) >= $workoutProgress->exercise_progress_count) {
                $workoutProgress->update([
                    'status' => 'completed'
                ]);

                $userHasPlan = UserHasPlan::where('user_id', $userId)->first();

                $userHasPlan->update([
                    'is_active' => 0
                ]);
            } else {
                $workoutProgress->update([
                    'exercise_id' => $exerciseId + 1
                ]);
            }
            return redirect()->route('appointments.index')->with('message', 'Workout successfully completed!');
        }
        return redirect()->back()->with('message', 'Workout failed to complete.');
    }
}
