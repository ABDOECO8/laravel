<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Attributs remplissables
    protected $fillable = ['name', 'image'];

    // Une catégorie peut avoir plusieurs produits
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
