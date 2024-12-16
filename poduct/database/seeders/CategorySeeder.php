<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ajouter des catégories avec ou sans image
        Category::create([
            'name' => 'Electronics',
            'image' => 'categories/Picture1.png',  // Chemin de l'image
        ]);

        Category::create([
            'name' => 'Clothing',
            'image' => 'categories/Picture1.png',
        ]);

        Category::create([
            'name' => 'Furniture',
            'image' => 'categories/Picture1.png',
        ]);

        Category::create([
            'name' => 'Books',
            'image' => 'categories/Picture1.png',
        ]);
    }
}
