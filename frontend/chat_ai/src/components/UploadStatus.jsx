import { CheckCircle, AlertCircle } from 'lucide-react';


export default function UploadStatus({ uploadStatus, uploadedFile, darkMode }) {
  if (!uploadStatus) return null;

  return (
    <div className={`mx-4 my-2 p-2 rounded flex items-center ${
      uploadStatus === 'success' 
        ? `${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}` 
        : `${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`
    }`}>
      {uploadStatus === 'success' ? (
        <>
          <CheckCircle size={18} className="mr-2" />
          <span className="text-sm">{uploadedFile?.name} is uploading </span>
        </>
      ) : (
        <>
          <AlertCircle size={18} className="mr-2" />
          <span className="text-sm">Please upload a .docx file</span>
        </>
      )}
    </div>
  );
}