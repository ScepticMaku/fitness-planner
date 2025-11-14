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
        Schema::create('diet_guidelines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_template_id')->constrained('plan_templates')->onDelete('cascade');
            $table->string('name');
            $table->string('description');
            $table->string('diet_type');
            $table->integer('calorie_target');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diet_guidelines');
    }
};
