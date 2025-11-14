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
        Schema::create('macronutrients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('diet_guideline_id')->constrained('diet_guidelines')->onDelete('cascade');
            $table->integer('protein_grams');
            $table->integer('carbohydrates');
            $table->integer('fats');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('macronutrients');
    }
};
