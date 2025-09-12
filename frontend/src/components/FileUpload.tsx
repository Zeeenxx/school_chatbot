import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface FileUploadProps {
  onFileUploaded: (fileInfo: any) => void;
  clearFiles?: number; // Add prop to trigger clearing files (counter)
  removedFilename?: string; // Add prop to specify which file was removed
}

const FileUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 0.5rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    gap: 0.3rem;
    margin-right: 0.3rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.2rem;
    margin-right: 0.2rem;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  padding: 0.75rem;
  background: #722f37;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: background 0.2s;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  
  &:hover {
    background: #5d1a1d;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    padding: 0.4rem;
    font-size: 0.8rem;
  }
`;

const UploadProgress = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  font-size: 0.8rem;
  color: #722f37;
  margin-left: 0.5rem;
`;

const FilePreview = styled.div`
  background: rgba(114, 47, 55, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
  margin: 0.5rem 0;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 200px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    max-width: 150px;
    font-size: 0.7rem;
    padding: 0.3rem;
    gap: 0.3rem;
    margin: 0.3rem 0;
  }
  
  @media (max-width: 480px) {
    max-width: 120px;
    font-size: 0.6rem;
    padding: 0.2rem;
    gap: 0.2rem;
    margin: 0.2rem 0;
    
    /* Hide file name on very small screens to save space */
    span:nth-child(2) {
      display: none;
    }
    
    /* Hide file size on very small screens */
    span:nth-child(3) {
      display: none;
    }
  }
`;

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded, clearFiles, removedFilename }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear uploaded file when clearFiles prop changes (counter-based)
  useEffect(() => {
    if (clearFiles && clearFiles > 0) {
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [clearFiles]);

  // Clear specific file when removedFilename changes
  useEffect(() => {
    if (removedFilename && uploadedFile && uploadedFile.filename === removedFilename) {
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [removedFilename, uploadedFile]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large! Please select a file smaller than 5MB.');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/csv',
      'application/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('File type not supported! Please upload documents or images only.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use environment variable for backend URL in production, or localhost in development
      const serverUrl = process.env.REACT_APP_API_URL || 
                       `http://${window.location.hostname}:5000`;
      const uploadUrl = `${serverUrl}/api/upload`;

      console.log('Uploading file:', file.name, file.type, file.size);
      console.log('FormData created, making request to:', uploadUrl);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const result = await response.json();
      console.log('Response result:', result);

      if (result.success) {
        setUploadedFile(result.file);
        onFileUploaded(result);
        
        // Clear the input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert('Upload failed: ' + result.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return '🖼️';
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('word') || mimetype.includes('document')) return '📝';
    if (mimetype.includes('excel') || mimetype.includes('sheet')) return '📊';
    if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return '📽️';
    if (mimetype.includes('csv')) return '📊';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <FileUploadContainer>
      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx,.csv"
      />
      
      <UploadButton 
        onClick={triggerFileSelect}
        disabled={uploading}
        title="Upload file"
      >
        {uploading ? '⏳' : '📎'}
      </UploadButton>
      
      <UploadProgress show={uploading}>
        Uploading...
      </UploadProgress>
      
      {uploadedFile && (
        <FilePreview>
          <span>{getFileIcon(uploadedFile.mimetype)}</span>
          <span>{uploadedFile.originalName}</span>
          <span>({formatFileSize(uploadedFile.size)})</span>
        </FilePreview>
      )}
    </FileUploadContainer>
  );
};

export default FileUpload;
