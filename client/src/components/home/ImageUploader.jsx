import React from "react";
import { Upload, ArrowRight, Cpu } from "lucide-react";

function ImageUploader({
  previewUrl,
  onFileChange,
  onReset,
  onAnalyze,
  isAnalyzing,
}) {
  return (
    <div className="leaf-glass-card border border-border p-8 shadow-2xl relative overflow-hidden">
      {!previewUrl ? (
        <label className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer group bg-secondary/30">
          <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform mb-3 border border-primary/20">
            <Upload className="w-8 h-8" />
          </div>
          <p className="font-semibold text-sm sm:text-base mb-1 text-foreground">
            Upload or drag field photo
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Supports PNG, JPG, or WEBP
          </p>
          <span className="btn-pill-primary text-sm cursor-pointer">
            Select File
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        </label>
      ) : (
        <div className="space-y-6">
          <div className="relative rounded-2xl overflow-hidden border border-border max-h-80 flex items-center justify-center bg-secondary/40">
            <img
              src={previewUrl}
              alt="Crop preview"
              className="object-contain h-full w-full max-h-80"
            />
            <button
              type="button"
              onClick={onReset}
              className="absolute top-4 right-4 btn-pill-secondary text-sm py-1.5 px-4 font-bold backdrop-blur-md cursor-pointer"
            >
              Replace Photo
            </button>
          </div>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full btn-pill-primary py-4 flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50 text-sm font-bold"
          >
            {isAnalyzing ? (
              <>
                <Cpu className="w-5 h-5 animate-spin" />
                Analyzing with Gemma 4 Multimodal...
              </>
            ) : (
              <>
                Analyze with Gemma 4
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
