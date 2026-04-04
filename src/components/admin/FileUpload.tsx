'use client';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { GlassCard } from '@/components/ui/GlassCard';
import toast from 'react-hot-toast';

interface FileUploadProps {
  bucket: 'posts-media' | 'campaign-assets';
  onSuccess?: (url: string) => void;
}

export function FileUpload({ bucket, onSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;

      // Validate file size (max 100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Invalid file type. Allowed: JPEG, PNG, WebP, MP4');
        return;
      }

      setFile(selectedFile);
    },
    []
  );

  const handleUpload = useCallback(async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${bucket}/${fileName}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: false,
        });

      if (error) throw error;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

      toast.success('File uploaded successfully!');
      onSuccess?.(data.publicUrl);
      setFile(null);
      setProgress(0);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }, [file, bucket, onSuccess]);

  return (
    <GlassCard className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Upload File</h3>

        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors">
          <input
            type="file"
            onChange={handleFileSelect}
            disabled={loading}
            className="hidden"
            id="file-input"
            accept="image/jpeg,image/png,image/webp,video/mp4"
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer block text-white/60 hover:text-white/90"
          >
            {file ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-white/40">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <p className="font-medium">Click to select file or drag and drop</p>
                <p className="text-sm text-white/40">Supports: images, videos</p>
              </motion.div>
            )}
          </label>
        </div>

        {progress > 0 && progress < 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full bg-white/10 rounded-full h-2 overflow-hidden"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            />
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 
                     text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 
                     transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </motion.button>
      </div>
    </GlassCard>
  );
}
