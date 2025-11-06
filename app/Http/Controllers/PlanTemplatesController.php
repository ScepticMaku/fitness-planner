<?php

namespace App\Http\Controllers;

use App\Models\PlanTemplate;
use App\Models\User;
use App\Models\UserHasPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PlanTemplatesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $templates = PlanTemplate::with('user')->get();
        return Inertia::render('plan-templates/index', [
            'templates' => $templates
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('plan-templates/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'goal' => 'required|string',
            'plan_type' => 'required|string',
            'fitness_level' => 'required|string',
            'description' => 'required|string',
            'workout_structure' => 'required|array',
            'diet_guidelines' => 'required|array',
        ]);

        $planTemplate = PlanTemplate::create([
            'user_id' => Auth::user()->id,
            'title' => $request->title,
            'goal' => $request->goal,
            'plan_type' => $request->plan_type,
            'fitness_level' => $request->fitness_level,
            'description' => $request->description,
            'workout_structure' => $request->workout_structure,
            'diet_guidelines' => $request->diet_guidelines
        ]);

        if($planTemplate) {
            return redirect()->route('plan-templates.index')->with('success', 'Template successfully created!');
        }
        return redirect()->back()->with('error', 'Template creation failed');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $userHasPlan = UserHasPlan::get();
        $template = PlanTemplate::find($id);
        return Inertia::render('plan-templates/show', [
            'template' => $template,
            'userHasPlan' => $userHasPlan,
        ]);
    }

    public function viewCreatedTemplates() {
        $templates = PlanTemplate::get();
        return Inertia::render('plan-templates/view-created-templates', [
            'templates' => $templates
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $template = PlanTemplate::find($id);
        return Inertia::render('plan-templates/edit', [
            'template' => $template,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $planTemplate = PlanTemplate::find($id);

        $request->validate([
            'title' => 'required|string',
            'goal' => 'required|string',
            'plan_type' => 'required|string',
            'fitness_level' => 'required|string',
            'description' => 'required|string',
            'workout_structure' => 'required|array',
            'diet_guidelines' => 'required|array',
        ]);

        $planTemplate->update([
            'user_id' => Auth::user()->id,
            'title' => $request->title,
            'goal' => $request->goal,
            'plan_type' => $request->plan_type,
            'fitness_level' => $request->fitness_level,
            'description' => $request->description,
            'workout_structure' => $request->workout_structure,
            'diet_guidelines' => $request->diet_guidelines
        ]);

        if($planTemplate) {
            return redirect()->back()->with('success', 'Template successfully updated!');
        }
        return redirect()->back()->with('error', 'Template update failed');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $template = PlanTemplate::destroy($id);

        if ($template) {
            return redirect()->route('plan-templates.index')->with('success', 'Template successfully deleted!');
        }
        return redirect()->back()->with('error', 'Template delete failed');
    }
}
