<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exercise_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workout_progress_id')->constrained('workout_progress')->onDelete('cascade');
            $table->foreignId('exercise_id')->constrained('exercises')->onDelete('cascade');
            $table->string('status')->default('uncompleted');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercise_progress');
    }
};
