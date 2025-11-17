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
use App\Http\Controllers\WorkoutSessionController;
use App\Http\Controllers\TrainerAvailabilityController;
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

    Route::get('workout-progress/view-pending-requests', [WorkoutProgressController::class, 'viewRequests'])->name('workout-progress.view-requests');
    Route::get('workout-progress/{id}/view-details',[WorkoutProgressController::class, 'viewDetails'])->name('workout-progress.view-details');

    Route::get('workout-sessions/create', [WorkoutSessionController::class, 'index'])->name('workout-sessions.create');
//   Route::get('workout-session/create', function () {
//       return Inertia::render('workout-sessions/create');
//   })->name('workout-sessions.create');
    Route::post('/workout-sessions/create', [WorkoutSessionController::class, 'getAvailableSlots'])->name('sessions.available-slots');
    Route::post('/sessions', [WorkoutSessionController::class, 'store'])->name('sessions.store');

    Route::get('/availability', [TrainerAvailabilityController::class, 'index'])->name('trainer.availability.index');
    Route::get('/availability/create', [TrainerAvailabilityController::class, 'create'])->name('trainer.availability.create');
    Route::post('/availability', [TrainerAvailabilityController::class, 'store'])->name('trainer.availability.store');
    Route::delete('/availability/{slot}', [TrainerAvailabilityController::class, 'destroy'])->name('trainer.availability.destroy');
    Route::get('/availability/bulk-create', [TrainerAvailabilityController::class, 'bulkCreate'])->name('trainer.availability.bulk-create');
    Route::post('/availability/bulk', [TrainerAvailabilityController::class, 'bulkStore'])->name('trainer.availability.bulk-store');

    Route::put('/appointments/complete/{id}', [AppointmentsController::class, 'complete'])->name('appointments.complete');
    Route::put('/appointments/approve/{id}', [AppointmentsController::class, 'approve'])->name('appointments.approve');
    Route::put('/appointments/decline/{id}', [AppointmentsController::class, 'decline'])->name('appointments.decline');

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
