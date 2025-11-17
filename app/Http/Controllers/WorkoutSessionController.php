<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\WorkoutSession;
use App\Models\Trainer;
use App\Models\AvailabilitySlot;
use App\Models\Exercise;
use App\Models\WorkoutProgress;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;

class WorkoutSessionController extends Controller
{
    public function index()
    {
        $userId = Auth::user()->id;
        $trainers = Trainer::with('user')->get();
        $exerciseId = WorkoutProgress::where('user_id', $userId)->first()->exercise_id;
        $currentExercise = Exercise::find($exerciseId);

        return Inertia::render('workout-sessions/create', [
            'trainers' => $trainers,
            'currentExercise' => $currentExercise,
        ]);
    }

    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'trainer_id' => 'required|exists:trainers,id',
            'date' => 'required|date'
        ]);

        $slots = AvailabilitySlot::where('trainer_id', $request->trainer_id)
            ->where('is_booked', false)
            ->whereDate('start_time', $request->date)
            ->get()
            ->map(function($slot) {
                return [
                    'id' => $slot->id,
                    'time' => $slot->start_time->format('H:i'),
                    'start_time' => $slot->start_time,
                    'end_time' => $slot->end_time,
                ];
            });

        $userId = Auth::user()->id;
        $trainers = Trainer::with('user')->get();
        $exerciseId = WorkoutProgress::where('user_id', $userId)->first()->exercise_id;
        $currentExercise = Exercise::find($exerciseId);

        return Inertia::render('workout-sessions/create', [
            'trainers' => $trainers,
            'currentExercise' => $currentExercise,
            'slots' => $slots
        ]);
    }

    public function store(Request $request)
    {

        $request->validate([
            'trainer_id' => 'required|exists:trainers,id',
            'slot_id' => 'required|exists:availability_slots,id',
            'exercise_id' => 'required|exists:exercises,id'
        ]);

        Appointment::create([
            'user_id' => Auth::user()->id,
            'trainer_id' => $request->trainer_id,
            'exercise_id' => $request->exercise_id,
            'slot_id' => $request->slot_id,
            'date_requested' => now(),
        ]);

        return redirect()->route('workout-progress.index')->with('message', 'Successfully requested an appointment!');
    }
}
