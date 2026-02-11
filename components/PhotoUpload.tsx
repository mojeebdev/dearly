"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

export default function PhotoUpload({ onUpload, currentUrl }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate size
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo must be under 5MB");
        return;
      }

      setError(null);
      setUploading(true);

      // Show local preview immediately
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const { url } = await res.json();
        onUpload(url);
      } catch (err) {
        setError("Upload failed. Please try again.");
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    multiple: false,
  });

  const removePhoto = () => {
    setPreview(null);
    onUpload("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-guardian-muted">
        <ImageIcon className="w-4 h-4 inline mr-1.5" />
        Photo (optional)
      </label>

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden aspect-video max-w-xs"
          >
            <img
              src={preview}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={removePhoto}
              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 
                         rounded-full text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {uploading && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...getRootProps({
              className: `border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                         transition-all duration-300
                         ${isDragActive
                           ? "border-guardian-gold bg-guardian-gold/5 scale-[1.02]"
                           : "border-guardian-goldLight/50 hover:border-guardian-gold/50 hover:bg-guardian-gold/5"
                         }`
            })}
          >
            <input {...getInputProps()} />
            <Upload
              className={`w-8 h-8 mx-auto mb-3 transition-colors ${
                isDragActive ? "text-guardian-gold" : "text-guardian-muted/40"
              }`}
            />
            <p className="text-sm text-guardian-muted">
              {isDragActive
                ? "Drop your photo here..."
                : "Drag a photo here, or click to browse"}
            </p>
            <p className="text-xs text-guardian-muted/50 mt-1">
              JPG, PNG or WebP · Max 5MB
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}