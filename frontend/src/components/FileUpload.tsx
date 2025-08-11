import { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
}

export const FileUpload = ({ onFileSelect, selectedFile, onRemoveFile }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="border-2 border-dashed border-border hover:border-primary transition-colors">
      <CardContent className="p-8">
        {selectedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemoveFile}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className={`text-center transition-colors ${
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload File for Analysis</h3>
            <p className="text-sm mb-4">
              Drag and drop your file here or click to browse
            </p>
            <Button onClick={handleBrowse} className="bg-primary hover:bg-primary/90">
              Browse Files
            </Button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept="*/*"
        />
      </CardContent>
    </Card>
  );
};