"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

export default function PhotoUpload({ onUpload, currentUrl }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        setError("Photo must be under 5MB");
        return;
      }

      setError(null);
      setUploading(true);
      setProgress(0);

      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      // Fake progress for feel
      const interval = setInterval(() => {
        setProgress((p) => (p >= 85 ? 85 : p + 12));
      }, 180);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const { url } = await res.json();
        setProgress(100);
        onUpload(url);
      } catch {
        setError("Upload failed. Please try again.");
        setPreview(null);
        setProgress(0);
      } finally {
        clearInterval(interval);
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
    setProgress(0);
    onUpload("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-guardian-muted">
        <Camera className="w-4 h-4 inline mr-1.5" />
        Photo{" "}
        <span className="text-guardian-muted/40 font-normal">— optional</span>
      </label>

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden w-full max-w-xs aspect-square group"
          >
            <img
              src={preview}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Remove button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={removePhoto}
              type="button"
              className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80
                         backdrop-blur-sm rounded-full text-white transition-colors
                         border border-white/10"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>

            {/* Upload progress */}
            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <div className="w-32 space-y-2">
                  <div className="h-[2px] bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-guardian-gold rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-white/70 text-xs text-center tracking-wider">
                    Uploading...
                  </p>
                </div>
              </div>
            )}

            {/* Done check */}
            {!uploading && progress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50
                           backdrop-blur-sm rounded-full px-3 py-1 border border-white/10"
              >
                <span className="text-guardian-gold text-xs">✓</span>
                <span className="text-white/70 text-xs tracking-wide">Uploaded</span>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...getRootProps()}
            className={`relative rounded-2xl cursor-pointer overflow-hidden
                       border transition-all duration-500 group
                       ${isDragActive
                         ? "border-guardian-gold bg-guardian-gold/8 scale-[1.01]"
                         : "border-guardian-goldLight/30 hover:border-guardian-gold/40 bg-white/30 hover:bg-guardian-gold/4"
                       }`}
          >
            <input {...getInputProps()} />

            {/* Inner content */}
            <div className="py-10 px-8 flex flex-col items-center gap-4">
              {/* Icon ring */}
              <motion.div
                animate={isDragActive ? { scale: 1.15 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`w-14 h-14 rounded-full flex items-center justify-center
                            border transition-all duration-300
                            ${isDragActive
                              ? "border-guardian-gold/60 bg-guardian-gold/15"
                              : "border-guardian-goldLight/30 bg-white/50 group-hover:border-guardian-gold/40 group-hover:bg-guardian-gold/8"
                            }`}
              >
                <Camera
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isDragActive
                      ? "text-guardian-gold"
                      : "text-guardian-muted/40 group-hover:text-guardian-gold/60"
                  }`}
                />
              </motion.div>

              <div className="text-center space-y-1">
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  isDragActive ? "text-guardian-gold" : "text-guardian-muted/70"
                }`}>
                  {isDragActive ? "Release to upload" : "Add a photo"}
                </p>
                <p className="text-xs text-guardian-muted/40 tracking-wide">
                  Drag here or{" "}
                  <span className="text-guardian-gold/60 underline underline-offset-2">
                    browse
                  </span>
                  {" "}· JPG, PNG, WebP · 5MB max
                </p>
              </div>
            </div>

            {/* Drag active shimmer border */}
            {isDragActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-2xl border-2 border-guardian-gold/40 pointer-events-none"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 tracking-wide"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}