import React, { useState, useCallback } from 'react';
import { UploadCloud, FileText, CheckCircle, XCircle, Loader2, Wifi } from 'lucide-react';

const UploadZone = ({ onComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, processing, uploading, success, error
  const [progress, setProgress] = useState(0);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);

  // Check network conditions
  React.useEffect(() => {
    if (navigator.connection) {
      const type = navigator.connection.effectiveType;
      if (type === '2g' || type === 'slow-2g' || type === '3g') {
        setIsLowBandwidth(true);
      }
    }
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const simulateUpload = (selectedFile) => {
    setFile(selectedFile);
    setUploadStatus('processing');
    
    // Simulate client-side compression delay
    setTimeout(() => {
      setUploadStatus('uploading');
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += isLowBandwidth ? 5 : 15; // Slower progress on "low bandwidth"
        setProgress(Math.min(currentProgress, 100));
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
          setTimeout(() => {
            if (onComplete) onComplete(selectedFile);
          }, 1500);
        }
      }, 200);
    }, 1500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-card rounded-xl border border-border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Upload Loan Statement</h2>
        {isLowBandwidth && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
            <Wifi className="w-3.5 h-3.5" />
            Low Bandwidth Mode Active
          </div>
        )}
      </div>

      <div 
        className={`relative w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:bg-muted/50'
        } ${uploadStatus !== 'idle' ? 'pointer-events-none' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={handleChange}
          accept=".pdf,.jpg,.png"
          disabled={uploadStatus !== 'idle'}
        />

        {uploadStatus === 'idle' && (
          <>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium text-foreground mb-1">Drag and drop your document here</p>
            <p className="text-sm text-muted-foreground mb-4">Supports PDF, JPG, PNG up to 10MB</p>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium">
              Browse Files
            </button>
          </>
        )}

        {uploadStatus === 'processing' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">Compressing document...</p>
            <p className="text-sm text-muted-foreground">Optimizing for faster upload</p>
          </div>
        )}

        {uploadStatus === 'uploading' && (
          <div className="w-full max-w-md flex flex-col items-center">
            <FileText className="w-12 h-12 text-primary mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">Uploading {file?.name}</p>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between w-full text-sm text-muted-foreground">
              <span>{progress}%</span>
              {isLowBandwidth ? <span>Compressing & streaming...</span> : <span>Uploading...</span>}
            </div>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">Upload Complete!</p>
            <p className="text-sm text-muted-foreground">Document is being analyzed.</p>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-destructive mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">Upload Failed</p>
            <p className="text-sm text-muted-foreground mb-4">Connection lost. Saved to offline queue.</p>
            <button 
              onClick={() => setUploadStatus('idle')}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadZone;
