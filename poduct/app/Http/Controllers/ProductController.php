<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // Créer un nouveau produit
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'stock' => 'nullable|integer',
            'category_id' => 'required|exists:categories,id', // Validation de l'existence de la catégorie par ID
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Traitement de l'image si elle est présente
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');  // Stocke l'image dans le dossier public/products
        } else {
            $imagePath = null;
        }

        $product = Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'stock' => $request->stock ?? 0,
            'category_id' => $request->category_id,
            'image' => $imagePath,
        ]);

        return response()->json($product, 201);
    }

    // Récupérer tous les produits
    public function index()
{
    $products = Product::all()->map(function ($product) {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'description' => $product->description,
            'stock' => $product->stock,
            'category_id' => $product->category_id,
            'image' => $product->image ? asset('storage/' . $product->image) : null, // Generate full URL for the image
        ];
    });

    return response()->json($products);
}

    

    // Récupérer un produit par ID
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    // Mettre à jour un produit
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'stock' => 'nullable|integer',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $product = Product::findOrFail($id);

        // Traitement de l'image si elle est présente
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image du stockage
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            // Stocker la nouvelle image
            $imagePath = $request->file('image')->store('products', 'public');
            $product->image = $imagePath;
        }

        // Mettre à jour les autres champs
        $product->update([
            'name' => $request->name ?? $product->name,
            'price' => $request->price ?? $product->price,
            'description' => $request->description ?? $product->description,
            'stock' => $request->stock ?? $product->stock,
            'category_id' => $request->category_id ?? $product->category_id,
            'image' => $product->image ?? $product->image,
        ]);

        return response()->json($product);
    }

    // Supprimer un produit
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Supprimer l'image si elle existe
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json(null, 204);
    }
}
