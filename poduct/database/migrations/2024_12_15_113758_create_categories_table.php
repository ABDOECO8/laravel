<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();              // Colonne auto-incrémentée pour l'ID
            $table->string('name');     // Attribut 'name' pour la catégorie
            $table->string('image')->nullable(); // Attribut 'image' pour la catégorie (nullable)
            $table->timestamps();      // Colonnes created_at et updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
}
