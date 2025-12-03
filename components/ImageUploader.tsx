import React, { useCallback, useState, useEffect } from 'react';
import { Upload, X, Plus } from 'lucide-react';

interface ImageUploaderProps {
  onImagesChange: (files: File[]) => void;
  selectedImages: File[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange, selectedImages }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const newPreviews = selectedImages.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
    return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
  }, [selectedImages]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFiles = useCallback((files: FileList | File[]) => {
    const validFiles: File[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      }
    });
    if (validFiles.length > 0) {
      onImagesChange([...selectedImages, ...validFiles]);
    }
  }, [selectedImages, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    e.target.value = '';
  }, [processFiles]);

  const removeImage = useCallback((indexToRemove: number) => {
    const newFiles = selectedImages.filter((_, index) => index !== indexToRemove);
    onImagesChange(newFiles);
  }, [selectedImages, onImagesChange]);

  // Styling for the drop zone
  const activeClass = "border-red-500 bg-red-500/5 shadow-[0_0_20px_rgba(229,9,20,0.2)]";
  const inactiveClass = "border-white/10 bg-black/20 hover:border-red-500/50 hover:bg-black/40";

  return (
    <div className="w-full">
      {selectedImages.length === 0 ? (
        <div 
          className={`relative h-64 border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group
            ${dragActive ? activeClass : inactiveClass}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleChange}
            accept="image/*"
            multiple
          />
          <div className="flex flex-col items-center p-6 text-center z-0 transition-transform duration-300 group-hover:scale-105">
            <div className={`p-5 rounded-full mb-4 transition-colors bg-white/5 ${dragActive ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'}`}>
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold text-white mb-2">
              Drag & Drop Images
            </p>
            <p className="text-sm text-gray-500 max-w-[200px]">
              Support for multiple JPG, PNG, WEBP files
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previews.map((url, index) => (
              <div key={`${url}-${index}`} className="relative group aspect-video rounded-lg overflow-hidden border border-white/10 shadow-lg">
                <img 
                  src={url} 
                  alt={`Upload ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                <button 
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            <label className="relative aspect-video border border-dashed border-white/20 rounded-lg hover:border-red-500 hover:bg-white/5 cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-red-500 transition-all group">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleChange}
                accept="image/*"
                multiple
              />
              <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">ADD MORE</span>
            </label>
          </div>
          
          <div className="flex justify-between items-center text-xs px-1">
             <span className="text-gray-500 font-mono">[{selectedImages.length}] IMAGES LOADED</span>
             <button 
               onClick={() => onImagesChange([])}
               className="text-red-500 hover:text-white transition-colors uppercase font-bold tracking-wider"
             >
               Clear All
             </button>
          </div>
        </div>
      )}
    </div>
  );
};