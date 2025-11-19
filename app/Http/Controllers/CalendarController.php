<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function index() {
        $appointments = Appointment::with('user', 'slot', 'trainer', 'exercise')->where('status', 'approved')->get()->map(function ($appointment) {
            return [
                'id' => $appointment->id,
                'title' => $appointment->exercise->name
            ];
        });

    }
}
