<?php
// app/Http/Controllers/TrainerAvailabilityController.php
namespace App\Http\Controllers;

use App\Models\AvailabilitySlot;
use App\Models\Trainer;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class TrainerAvailabilityController extends Controller
{
    public function index()
    {
        // Get the authenticated user's trainer profile
        $userId = Auth::user()->id; // Assuming user has a trainer relationship
        $trainer = Trainer::where('user_id', $userId)->first();



        $slots = AvailabilitySlot::where('trainer_id', $trainer->id)
            ->orderBy('start_time', 'asc')
            ->get()
            ->groupBy(function($slot) {
                return Carbon::parse($slot->start_time)->format('Y-m-d');
            });

        return Inertia::render('trainers/Availability/Index', [
            'slots' => $slots,
            'trainer' => $trainer
        ]);
    }

    public function create()
    {
        $userId = Auth::user()->id; // Assuming user has a trainer relationship
        $trainer = Trainer::where('user_id', $userId)->first();

        return Inertia::render('trainers/Availability/Create', [
            'trainer' => $trainer
        ]);
    }

    public function bulkCreate()
    {
        $userId = Auth::user()->id; // Assuming user has a trainer relationship
        $trainer = Trainer::where('user_id', $userId)->first();

        return Inertia::render('trainers/Availability/BulkCreate', [
            'trainer' => $trainer
        ]);
    }

    public function store(Request $request)
    {
        $userId = Auth::user()->id; // Assuming user has a trainer relationship
        $trainer = Trainer::where('user_id', $userId)->first();

        $request->validate([
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        // Check for overlapping slots
        $overlapping = AvailabilitySlot::where('trainer_id', $trainer->id)
            ->where('start_time', '<', $request->end_time)
            ->where('end_time', '>', $request->start_time)
            ->exists();

        if ($overlapping) {
            return back()->withErrors([
                'start_time' => 'This time slot overlaps with an existing availability slot.'
            ]);
        }

        AvailabilitySlot::create([
            'trainer_id' => $trainer->id,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'is_booked' => false,
        ]);

        return redirect()->route('trainer.availability.index')
            ->with('success', 'Availability slot added successfully!');
    }

    public function bulkStore(Request $request)
    {
        $userId = Auth::user()->id; // Assuming user has a trainer relationship
        $trainer = Trainer::where('user_id', $userId)->first();

        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'days' => 'required|array',
            'days.*' => 'in:0,1,2,3,4,5,6', // 0=Sunday, 6=Saturday
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $createdSlots = 0;

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            // Check if this day of week is selected
            if (in_array($date->dayOfWeek, $request->days)) {
                $startDateTime = $date->copy()->setTimeFromTimeString($request->start_time);
                $endDateTime = $date->copy()->setTimeFromTimeString($request->end_time);

                // Check if slot already exists
                $existing = AvailabilitySlot::where('trainer_id', $trainer->id)
                    ->where('start_time', $startDateTime)
                    ->where('end_time', $endDateTime)
                    ->exists();

                if (!$existing) {
                    AvailabilitySlot::create([
                        'trainer_id' => $trainer->id,
                        'start_time' => $startDateTime,
                        'end_time' => $endDateTime,
                        'is_booked' => false,
                    ]);
                    $createdSlots++;
                }
            }
        }

        return redirect()->route('trainer.availability.index')
            ->with('success', "Successfully created {$createdSlots} availability slots!");
    }

    public function destroy(AvailabilitySlot $slot)
    {
        // Ensure the slot belongs to the authenticated trainer
        if ($slot->trainer_id !== Auth::user()->trainer->id) {
            abort(403);
        }

        // Don't allow deletion of booked slots
        if ($slot->is_booked) {
            return back()->with('error', 'Cannot delete a slot that has been booked.');
        }

        $slot->delete();

        return back()->with('success', 'Availability slot deleted successfully!');
    }
}
