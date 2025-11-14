<?php

namespace App\Http\Controllers;

use App\Models\PlanTemplate;
use App\Models\UserHasPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use PDO;

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
        $validated = $request->validate([
            'title' => 'required|string',
            'goal' => 'required|string',
            'plan_type' => 'required|string',
            'fitness_level' => 'required|string',
            'description' => 'required|string',
            'workout_structure' => 'required|array|min:1',
            'workout_structure.*.name' => 'required|string',
            'workout_structure.*.exercises' => 'required|array|min:1',
            'workout_structure.*.exercises.*.name' => 'required|string',
            'workout_structure.*.exercises.*.sets' => 'required|integer',
            'workout_structure.*.exercises.*.reps' => 'required|string',
            'workout_structure.*.exercises.*.rest_seconds' => 'required|integer',
            'diet_guidelines' => 'required|array',
            'diet_guidelines.*.name' => 'required|string',
            'diet_guidelines.*.description' => 'required|string',
            'diet_guidelines.*.diet_type' => 'required|string',
            'diet_guidelines.*.calorie_target' => 'required|integer',
            'diet_guidelines.*.macronutrients' => 'required|array',
            'diet_guidelines.*.macronutrients.*.protein_grams' => 'required|integer',
            'diet_guidelines.*.macronutrients.*.carbohydrates' => 'required|integer',
            'diet_guidelines.*.macronutrients.*.fats' => 'required|integer',
            'diet_guidelines.*.rules' => 'required|array',
            'diet_guidelines.*.rules.*.name' => 'required|string',
            'diet_guidelines.*.food_recommendations' => 'required|array',
            'diet_guidelines.*.food_recommendations.*.name' => 'required|string',
            'diet_guidelines.*.food_limitations' => 'required|array',
            'diet_guidelines.*.food_limitations.*.name' => 'required|string',
        ]);

        DB::transaction(function() use ($validated) {
            $userId = Auth::user()->id;

            $planTemplate = PlanTemplate::create([
                'user_id' => $userId,
                'title' => $validated['title'],
                'goal' => $validated['goal'],
                'fitness_level' => $validated['fitness_level'],
                'plan_type' => $validated['plan_type'],
                'description' => $validated['description'],
            ]);

            foreach($validated['workout_structure'] as $workoutData) {
                $workout = $planTemplate->workoutStructure()->create([
                    'name' => $workoutData['name'],
                ]);

                foreach($workoutData['exercises'] as $exercise) {
                    $workout->exercise()->create([
                        'name' => $exercise['name'],
                        'sets' => $exercise['sets'],
                        'reps' => $exercise['reps'],
                        'rest_seconds' => $exercise['rest_seconds']
                    ]);
                }
            }

            foreach($validated['diet_guidelines'] as $guidelineData) {
                $guideline = $planTemplate->dietGuideline()->create([
                    'name' => $guidelineData['name'],
                    'description' => $guidelineData['description'],
                    'diet_type' => $guidelineData['diet_type'],
                    'calorie_target' => $guidelineData['calorie_target'],
                ]);

                foreach($guidelineData['macronutrients'] as $macro) {
                    $guideline->macronutrient()->create([
                        'protein_grams' => $macro['protein_grams'],
                        'carbohydrates' => $macro['carbohydrates'],
                        'fats' => $macro['fats'],
                    ]);
                }

                foreach($guidelineData['rules'] as $rule) {
                    $guideline->rule()->create([
                        'name' => $rule['name'],
                    ]);
                }

                foreach($guidelineData['food_recommendations'] as $recommendation) {
                    $guideline->foodRecommendation()->create([
                        'name' => $recommendation['name'],
                    ]);
                }

                foreach($guidelineData['food_limitations'] as $limitation) {
                    $guideline->foodLimitation()->create([
                        'name' => $limitation['name'],
                    ]);
                }
            }
        });
        return redirect()->route('plan-templates.index')->with('success', 'Template successfully created!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $userHasPlan = UserHasPlan::get();
        $template = PlanTemplate::with(
            'user',
            'workoutStructure.exercise',
            'dietGuideline.rule',
            'dietGuideline.macronutrient',
            'dietGuideline.foodRecommendation',
            'dietGuideline.foodLimitation',
        )->find($id);

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
        $template = PlanTemplate::with(
            'user',
            'workoutStructure.exercise',
            'dietGuideline.rule',
            'dietGuideline.macronutrient',
            'dietGuideline.foodRecommendation',
            'dietGuideline.foodLimitation',
        )->find($id);

        return Inertia::render('plan-templates/edit', [
            'template' => $template,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $template = PlanTemplate::find($id);
        $validated = $request->validate([
            'title' => 'required|string',
            'goal' => 'required|string',
            'plan_type' => 'required|string',
            'fitness_level' => 'required|string',
            'description' => 'required|string',
            'workout_structure' => 'required|array|min:1',
            'workout_structure.*.id' => 'sometimes|integer',
            'workout_structure.*.name' => 'required|string',
            'workout_structure.*.exercises' => 'required|array|min:1',
            'workout_structure.*.exercises.*.name' => 'required|string',
            'workout_structure.*.exercises.*.sets' => 'required|integer',
            'workout_structure.*.exercises.*.reps' => 'required|integer',
            'workout_structure.*.exercises.*.rest_seconds' => 'required|integer',
            'diet_guidelines' => 'required|array',
            'diet_guidelines.*.id' => 'sometimes|integer',
            'diet_guidelines.*.name' => 'required|string',
            'diet_guidelines.*.description' => 'required|string',
            'diet_guidelines.*.diet_type' => 'required|string',
            'diet_guidelines.*.calorie_target' => 'required|integer',
            'diet_guidelines.*.macronutrients' => 'required|array',
            'diet_guidelines.*.macronutrients.*.id' => 'sometimes|integer',
            'diet_guidelines.*.macronutrients.*.protein_grams' => 'required|integer',
            'diet_guidelines.*.macronutrients.*.carbohydrates' => 'required|integer',
            'diet_guidelines.*.macronutrients.*.fats' => 'required|integer',
            'diet_guidelines.*.rules' => 'required|array',
            'diet_guidelines.*.rules.*.id' => 'sometimes|integer',
            'diet_guidelines.*.rules.*.name' => 'required|string',
            'diet_guidelines.*.food_recommendations' => 'required|array',
            'diet_guidelines.*.food_recommendations.*.id' => 'sometimes|integer',
            'diet_guidelines.*.food_recommendations.*.name' => 'required|string',
            'diet_guidelines.*.food_limitations' => 'required|array',
            'diet_guidelines.*.food_limitations.*.id' => 'sometimes|integer',
            'diet_guidelines.*.food_limitations.*.name' => 'required|string',
        ]);

        DB::transaction(function () use ($template, $validated) {
        // Update the main template
        $template->update([
            'title' => $validated['title'],
            'goal' => $validated['goal'],
            'plan_type' => $validated['plan_type'],
            'fitness_level' => $validated['fitness_level'],
            'description' => $validated['description'],
        ]);

        // Delete and recreate workouts (simpler approach)
        $template->workoutStructure()->delete();
        foreach ($validated['workout_structure'] as $workoutData) {
            $workout = $template->workoutStructure()->create(['name' => $workoutData['name']]);
            foreach ($workoutData['exercises'] as $exerciseData) {
                $workout->exercise()->create([
                    'name' => $exerciseData['name'],
                    'sets' => $exerciseData['sets'],
                    'reps' => $exerciseData['reps'],
                    'rest_seconds' => $exerciseData['rest_seconds'],
                ]);
            }
        }

        // Delete and recreate diet guidelines (simpler approach)
        $template->dietGuideline()->delete();
        foreach ($validated['diet_guidelines'] as $guidelineData) {
            $guideline = $template->dietGuideline()->create([
                'name' => $guidelineData['name'],
                'description' => $guidelineData['description'],
                'diet_type' => $guidelineData['diet_type'],
                'calorie_target' => $guidelineData['calorie_target'],
            ]);

            // Create macronutrients
            foreach ($guidelineData['macronutrients'] as $macroData) {
                $guideline->macronutrient()->create([
                    'protein_grams' => $macroData['protein_grams'],
                    'carbohydrates' => $macroData['carbohydrates'],
                    'fats' => $macroData['fats'],
                ]);
            }

            // Create rules
            foreach ($guidelineData['rules'] as $ruleData) {
                $guideline->rule()->create(['name' => $ruleData['name']]);
            }

            // Create food recommendations
            foreach ($guidelineData['food_recommendations'] as $recData) {
                $guideline->foodRecommendation()->create(['name' => $recData['name']]);
            }

            // Create food limitations
            foreach ($guidelineData['food_limitations'] as $limitationData) {
                $guideline->foodLimitation()->create(['name' => $limitationData['name']]);
            }
        }
    });

    return redirect()->route('plan-templates.show', $template->id)
                     ->with('success', 'Workout plan updated successfully!');        return redirect()->route('plan-templates.show', $planTemplate->id)->with('success', 'Template successfully updated!');
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
