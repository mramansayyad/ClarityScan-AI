'use client';

import { useState, useCallback, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Sparkles, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

const acceptedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
  'text/csv',
  'application/json',
  'text/markdown',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileValidation = (file: File): boolean => {
    if (!acceptedFileTypes.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Unsupported File Type',
        description: `File type '${file.type}' is not supported.`,
      });
      return false;
    }
    // 50MB limit
    if (file.size > 50 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File Too Large',
        description: 'Please upload a file smaller than 50MB.',
      });
      return false;
    }
    return true;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        if (handleFileValidation(files[0])) {
          onFileUpload(files[0]);
        }
      }
    },
    [onFileUpload, toast]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (handleFileValidation(files[0])) {
        onFileUpload(files[0]);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 text-center py-12 lg:py-24">
      <div className="w-full max-w-3xl">
        <div className="inline-flex items-center rounded-full py-1 px-3 text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          Powered by Generative AI
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold">
          Unlock Insights from Your Documents
        </h2>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Simply upload a document or image. Our AI will perform a comprehensive analysis,
          extracting key data and providing valuable insights in seconds.
        </p>
      </div>
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'relative w-full max-w-3xl min-h-[300px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group',
          isDragging
            ? 'border-primary bg-primary/10 scale-105 shadow-2xl shadow-primary/20'
            : 'border-border/50 bg-card/50 hover:border-primary/50 hover:bg-accent/10'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept={acceptedFileTypes.join(',')}
        />
        <div className="flex flex-col items-center gap-4 text-muted-foreground transition-colors duration-300">
          <div
            className={cn(
              'w-20 h-20 rounded-full bg-card flex items-center justify-center transition-all duration-300',
              isDragging ? 'bg-primary/20 scale-110' : 'group-hover:bg-accent/20'
            )}
          >
            <UploadCloud
              className={cn(
                'w-10 h-10 transition-transform group-hover:scale-110',
                isDragging ? 'text-primary' : ''
              )}
            />
          </div>
          <p className="text-lg font-medium">
            <span className="text-primary">Click to upload</span> or drag and drop
          </p>
          <div className="text-xs flex items-center justify-center gap-4 flex-wrap px-4">
            <span className="flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> Images
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" /> Text Files
            </span>
            <span className="flex items-center gap-1">
              <File className="w-3 h-3" /> Documents
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
