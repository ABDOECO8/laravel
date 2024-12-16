<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ajouter un seul produit
        Product::create([
            'name' => 'Produit A',
            'price' => 100.50,
        ]);

        // Ajouter plusieurs produits avec un tableau
        Product::create([
            'name' => 'Produit B',
            'price' => 150.75,
        ]);

        Product::create([
            'name' => 'Produit C',
            'price' => 200.00,
        ]);

        // Ou en utilisant une boucle pour plus de produits (facultatif)
        \App\Models\Product::factory(10)->create();
    }
}
