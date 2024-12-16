<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();            // Colonne auto-incrémentée pour l'ID
            $table->string('name');   // Attribut 'name' du produit
            $table->decimal('price', 8, 2); // Attribut 'price' du produit (prix avec 2 décimales)
            $table->text('description')->nullable();  // Description du produit
            $table->integer('stock')->default(0);     // Quantité en stock
            $table->foreignId('category_id')->constrained()->onDelete('cascade'); // Clé étrangère vers `categories`
            $table->string('image')->nullable();      // Image du produit (url ou nom du fichier)
            $table->timestamps();     // Colonnes created_at et updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
}
