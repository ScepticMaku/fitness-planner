<?php

use App\Http\Controllers\FitnessPlanController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PlanTemplatesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\TrainerController;
use App\Http\Controllers\UserHasPlanController;
use App\Http\Controllers\WorkoutProgressController;
use App\Http\Controllers\AppointmentsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('plan-templates/view-created-templates', [PlanTemplatesController::class, 'viewCreatedTemplates'])->name('plan-templates.viewCreatedTemplates');

    Route::post('user-has-plans/{id}/select', [UserHasPlanController::class, 'select'])->name('user-has-plans.select');
    Route::put('user-has-plans/{id}/change', [UserHasPlanController::class, 'change'])->name('user-has-plans.change');
    Route::delete('user-has-plans/{id}/cancel', [UserHasPlanController::class, 'cancel'])->name('user-has-plans.cancel');
    Route::put('use-has-plans/{id}/start', [UserHasPlanController::class, 'start'])->name('user-has-plans.start');

    Route::resource("users", UserController::class)->middleware('permission:access-users-module');
    Route::resource("roles", RoleController::class)->middleware('permission:access-roles-module');
    Route::resource("permissions", PermissionController::class)->middleware('permission:access-permissions-module');
    Route::resource("workout-progress", WorkoutProgressController::class)->middleware('permission:access-workout-progress-module');
    Route::resource("fitness-plan", FitnessPlanController::class)->middleware('permission:access-fitness-plan-module');
    Route::resource("schedules", SchedulesController::class)->middleware('permission:access-schedules-module');
    Route::resource("trainers", TrainerController::class)->middleware('permission:access-trainers-module');
    Route::resource("plan-templates", PlanTemplatesController::class)->middleware('permission:access-plan-templates-module');
    Route::resource("appointments", AppointmentsController::class)->middleware('permission:access-appointments-module');
    });

require __DIR__.'/settings.php';
