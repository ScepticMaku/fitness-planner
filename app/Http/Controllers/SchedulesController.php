<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Trainer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SchedulesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $userId = $user->id;

        $trainer = Trainer::where('user_id', $userId)->first();

        if($trainer) {
            $trainerId = $trainer->id;
            $appointmentSchedule = Appointment::with('user', 'slot', 'trainer.user', 'exercise')->where('status', 'approved')->where('trainer_id', $trainerId)->get()->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'title' => $appointment->exercise->name,
                    'start' => $appointment->slot->start_time->toISOString(),
                    'end' => $appointment->slot->end_time->toISOString(),
                    'description' => $appointment->user->name,
                    'trainer' => $appointment->trainer->user->name,
                ];
            });
            return Inertia::render('schedules/index', [
                'appointmentSchedule' => $appointmentSchedule
            ]);
        } else {
            $appointmentSchedule = Appointment::with('user', 'slot', 'trainer.user', 'exercise')->where('status', 'approved')->where('user_id', $userId)->get()->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'title' => $appointment->exercise->name,
                    'start' => $appointment->slot->start_time->toISOString(),
                    'end' => $appointment->slot->end_time->toISOString(),
                    'description' => $appointment->user->name,
                    'trainer' => $appointment->trainer->user->name,
                ];
            });
            return Inertia::render('schedules/index', [
                'appointmentSchedule' => $appointmentSchedule
            ]);
        }
        return Inertia::render('schedules/index', [
            'appointmentSchedule' => $appointmentSchedule
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
        //
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
