import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X } from 'lucide-react';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, formatFileSize } from '../../lib/utils/format';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`);
      return false;
    }

    const isAccepted = Object.entries(ACCEPTED_FILE_TYPES).some(([mime, exts]) => {
      if (file.type === mime) return true;
      return exts.some(ext => file.name.toLowerCase().endsWith(ext));
    });

    if (!isAccepted) {
      setError('Unsupported file type. Please upload a valid document or image.');
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const getAcceptString = () => {
    return Object.entries(ACCEPTED_FILE_TYPES)
      .map(([mime, exts]) => `${mime},${exts.join(',')}`)
      .join(',');
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div
        className={`upload-zone relative ${isDragging ? 'drag-over' : ''} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept={getAcceptString()}
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent-glow flex items-center justify-center text-accent-primary mb-2">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-1">Upload Document</h3>
            <p className="text-text-secondary text-sm max-w-sm mx-auto">
              Drag & drop your file here, or click to browse. Max size 10MB.
            </p>
          </div>
          
          <div className="flex gap-4 mt-4 text-text-tertiary">
            <div className="flex items-center gap-1 text-xs">
              <FileText className="w-4 h-4" /> PDFs & Docs
            </div>
            <div className="flex items-center gap-1 text-xs">
              <ImageIcon className="w-4 h-4" /> Images
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="font-mono text-[10px]">&lt;/&gt;</span> Source Code
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-color-error bg-color-error-bg rounded-md animate-fade-in">
          <X className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
