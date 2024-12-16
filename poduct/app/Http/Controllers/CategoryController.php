<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Ajoutez cette ligne en haut du fichier

class CategoryController extends Controller
{
    // Méthode pour afficher toutes les catégories
    public function index() { 
        return response()->json([ 
            'categories' => Category::all()->map(function ($category) {
                 return [
                     'id' => $category->id, 
                     'name' => $category->name, 
                     'image' => $category->image ? asset('storage/' . $category->image) : null, ];
                     }) 
                    ]);
                 }

    // Méthode pour créer une nouvelle catégorie
    
        public function store(Request $request)
        {
            $request->validate([
                'name' => 'required|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,gif,webp|max:5120', // Validation du fichier image
            ]);
    
            // Gérer le téléchargement de l'image
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('categories', 'public');
            }
    
            $category = Category::create([
                'name' => $request->name,
                'image' => $imagePath
            ]);
    
            return response()->json($category, 201);
        }
    // Méthode pour afficher une catégorie spécifique
    public function show($id)
    {
        return Category::findOrFail($id);
    }

    // Méthode pour mettre à jour une catégorie
    public function update(Request $request, $id)
    {
        \Log::info('Received data:', $request->all());
        \Log::info('Request has file:', [$request->hasFile('image')]);
    
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,gif,webp|max:5120',
        ]);
    
        $category = Category::findOrFail($id);
    
        $category->name = $request->name;
    
        if ($request->hasFile('image')) {
            \Log::info('Image found in the request.');
    
            // Suppression de l'ancienne image
            if ($category->image) {
                \Log::info('Attempting to delete old image: ' . $category->image);
                if (Storage::disk('public')->exists($category->image)) {
                    Storage::disk('public')->delete($category->image);
                    \Log::info('Old image deleted successfully');
                } else {
                    \Log::warning('Old image does not exist');
                }
            }
    
            $imagePath = $request->file('image')->store('categories', 'public');
            \Log::info('New image stored at: ' . $imagePath);
    
            $category->image = $imagePath;
        }
    
        try {
            $category->save();
            \Log::info('Category saved successfully');
            return response()->json($category, 200);
        } catch (\Exception $e) {
            \Log::error('Error saving category: ' . $e->getMessage());
            return response()->json(['error' => 'Impossible de modifier la catégorie'], 500);
        }
    }
    
    // Méthode pour supprimer une catégorie
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(null, 204);
    }
}
