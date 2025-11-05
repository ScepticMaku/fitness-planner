<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Trainer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class TrainerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $trainers = Trainer::with('user')->get();
        return Inertia::render('trainers/index', [
            'trainers' => $trainers
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('trainers/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string',
            'email' => 'required|unique:users,email',
            'password' => 'required|string|min:8',
            'confirm_password' => 'required|same:password',
            'bio' => 'nullable|string',
            'specialization' => 'required|string'
       ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $trainer = Trainer::create([
            'user_id' => $user->id,
            'specialization' => $request->specialization,
        ]);

        if($user && $trainer) {
            $user->syncRoles("trainer");
            return redirect()->route('trainers.index')->with('message', 'Trainer successfully added!');
        }
        return redirect()->back()->with('message', 'Trainer creation failed.');

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $trainer = Trainer::with('user')->find($id);
        return Inertia::render('trainers/edit', [
            'trainer' => $trainer
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $trainer = Trainer::with('user')->find($id);
        $user = User::find($trainer->user_id);

       $request->validate([
            'name' => 'required|string',
            'bio' => 'nullable|string',
            'specialization' => 'required|string',
            'trainer_status' => 'required|string',
       ]);

        $user->update([
            'name' => $request->name,
        ]);

        $trainer->update([
            'user_id' => $user->id,
            'specialization' => $request->specialization,
            'trainer_status' => $request->trainer_status
        ]);

        if($user && $trainer) {
            return redirect()->route('trainers.index')->with('message', 'Trainer successfully updated!');
        }
        return redirect()->back()->with('message', 'Trainer update failed.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
