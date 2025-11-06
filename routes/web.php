<?php

use App\Http\Controllers\FitnessPlanController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PlanTemplatesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\TrainerController;
use App\Http\Controllers\UserHasPlanController;
use Illuminate\Support\Facades\Auth;
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


    Route::resource("users", UserController::class)->middleware('permission:access-users-module');
    Route::resource("roles", RoleController::class)->middleware('permission:access-roles-module');
    Route::resource("permissions", PermissionController::class)->middleware('permission:access-permissions-module');
    Route::resource("fitness-plan", FitnessPlanController::class)->middleware('permission:access-fitness-plan-module');
    Route::resource("schedules", SchedulesController::class)->middleware('permission:access-schedules-module');
    Route::resource("trainers", TrainerController::class)->middleware('permission:access-trainers-module');
    Route::resource("plan-templates", PlanTemplatesController::class)->middleware('permission:access-plan-templates-module');
    });

require __DIR__.'/settings.php';
