import React, { useState, useRef } from 'react';
import { Upload, UploadCloud, X } from 'lucide-react';

const ImageUploadPreview = ({ 
  onFileSelect, 
  maxFiles = 5, 
  maxSizeInMB = 5 
}) => {
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newPreviews = [];
    const newErrors = [];

    files.forEach(file => {
      // Vérification de la taille du fichier
      if (file.size > maxSizeInMB * 1024 * 1024) {
        newErrors.push(`${file.name} est trop volumineux. La taille maximale est de ${maxSizeInMB}MB.`);
        return;
      }

      // Vérification du type de fichier
      if (!file.type.startsWith('image/')) {
        newErrors.push(`${file.name} n'est pas un fichier image valide.`);
        return;
      }

      // Création de l'aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          file,
          preview: reader.result
        });

        // Mettre à jour les prévisualisations si tous les fichiers ont été traités
        if (newPreviews.length === files.length) {
          const combinedPreviews = [...previews, ...newPreviews].slice(0, maxFiles);
          setPreviews(combinedPreviews);
          onFileSelect(combinedPreviews.map(p => p.file));
        }
      };
      reader.readAsDataURL(file);
    });

    // Gérer les erreurs
    if (newErrors.length > 0) {
      setErrors(newErrors);
    }
  };

  const removePreview = (indexToRemove) => {
    const updatedPreviews = previews.filter((_, index) => index !== indexToRemove);
    setPreviews(updatedPreviews);
    onFileSelect(updatedPreviews.map(p => p.file));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full">
      {/* Zone de téléchargement */}
      <div 
        onClick={triggerFileInput}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center 
                   hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition"
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />
        <div className="flex flex-col items-center">
          <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-600">
            Glissez et déposez des images ou <span className="text-blue-500">parcourir</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            (Max {maxFiles} images, {maxSizeInMB}MB par image)
          </p>
        </div>
      </div>

      {/* Affichage des erreurs */}
      {errors.length > 0 && (
        <div className="mt-4 text-red-500">
          {errors.map((error, index) => (
            <p key={index} className="text-sm">{error}</p>
          ))}
        </div>
      )}

      {/* Prévisualisation des images */}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div 
              key={index} 
              className="relative rounded-lg overflow-hidden shadow-md"
            >
              <img 
                src={preview.preview} 
                alt={`Aperçu ${index + 1}`} 
                className="w-full h-40 object-cover"
              />
              <button
                onClick={() => removePreview(index)}
                className="absolute top-2 right-2 bg-red-500 text-white 
                           rounded-full p-1 hover:bg-red-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadPreview;