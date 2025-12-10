import React, { useState, useRef } from 'react';
import { AspectRatio, ImageSize } from '../types';

interface ToolsPanelProps {
  onGenerateImage: (prompt: string, size: ImageSize) => Promise<void>;
  onGenerateVideo: (prompt: string, image: string | null, aspectRatio: AspectRatio) => Promise<void>;
  isProcessing: boolean;
}

export const ToolsPanel: React.FC<ToolsPanelProps> = ({ onGenerateImage, onGenerateVideo, isProcessing }) => {
  const [activeTab, setActiveTab] = useState<'none' | 'image' | 'video'>('none');
  
  // Image Gen State
  const [imgPrompt, setImgPrompt] = useState('');
  const [imgSize, setImgSize] = useState<ImageSize>(ImageSize.Size1K);

  // Video Gen State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoAspectRatio, setVideoAspectRatio] = useState<AspectRatio>(AspectRatio.Landscape);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSubmit = async () => {
    if (!imgPrompt) return;
    await onGenerateImage(imgPrompt, imgSize);
    setActiveTab('none');
    setImgPrompt('');
  };

  const handleVideoSubmit = async () => {
    // For video, either prompt or image is required. 
    if (!videoPrompt && !selectedFile) return;

    let base64Image: string | null = null;
    if (selectedFile) {
        // Need to convert file to base64 properly if not already available
        base64Image = previewUrl; 
    }

    await onGenerateVideo(videoPrompt, base64Image, videoAspectRatio);
    setActiveTab('none');
    setVideoPrompt('');
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
      <div className="flex gap-2 bg-black/50 backdrop-blur-md p-1 rounded-lg border border-white/10">
        <button
          onClick={() => setActiveTab(activeTab === 'image' ? 'none' : 'image')}
          className={`p-2 rounded-md transition-all ${activeTab === 'image' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}
          title="Generate Image (Nano Banana Pro)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </button>
        <button
          onClick={() => setActiveTab(activeTab === 'video' ? 'none' : 'video')}
          className={`p-2 rounded-md transition-all ${activeTab === 'video' ? 'bg-pink-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}
          title="Generate Video (Veo)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </button>
      </div>

      {activeTab === 'image' && (
        <div className="w-72 bg-gray-900 border border-indigo-500/30 rounded-lg p-4 shadow-xl backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Nano Banana Pro
          </h3>
          <textarea
            className="w-full bg-black/40 border border-white/10 rounded p-2 text-sm text-white mb-3 focus:outline-none focus:border-indigo-500"
            rows={3}
            placeholder="Describe the cyber artifact..."
            value={imgPrompt}
            onChange={(e) => setImgPrompt(e.target.value)}
          />
          <div className="flex gap-2 mb-4">
             {Object.values(ImageSize).map(size => (
                 <button 
                    key={size}
                    onClick={() => setImgSize(size)}
                    className={`flex-1 text-xs py-1 rounded border ${imgSize === size ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-white/10 text-gray-400'}`}
                 >
                    {size}
                 </button>
             ))}
          </div>
          <button
            onClick={handleImageSubmit}
            disabled={isProcessing || !imgPrompt}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm py-2 rounded transition-colors"
          >
            {isProcessing ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
      )}

      {activeTab === 'video' && (
        <div className="w-72 bg-gray-900 border border-pink-500/30 rounded-lg p-4 shadow-xl backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
            Veo Animator
          </h3>
          
          <div className="mb-3">
             <label className="block text-xs text-gray-400 mb-1">Source Image (Optional)</label>
             <div 
                className="w-full h-24 border border-dashed border-white/20 rounded flex items-center justify-center cursor-pointer hover:bg-white/5 relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
             >
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs text-gray-500">Click to upload photo</span>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />
             </div>
          </div>

          <textarea
            className="w-full bg-black/40 border border-white/10 rounded p-2 text-sm text-white mb-3 focus:outline-none focus:border-pink-500"
            rows={2}
            placeholder="Describe motion or scene..."
            value={videoPrompt}
            onChange={(e) => setVideoPrompt(e.target.value)}
          />
          
          <div className="flex gap-2 mb-4">
             {Object.values(AspectRatio).map(ratio => (
                 <button 
                    key={ratio}
                    onClick={() => setVideoAspectRatio(ratio)}
                    className={`flex-1 text-xs py-1 rounded border ${videoAspectRatio === ratio ? 'border-pink-500 bg-pink-500/20 text-white' : 'border-white/10 text-gray-400'}`}
                 >
                    {ratio}
                 </button>
             ))}
          </div>

          <button
            onClick={handleVideoSubmit}
            disabled={isProcessing || (!videoPrompt && !selectedFile)}
            className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white text-sm py-2 rounded transition-colors"
          >
            {isProcessing ? 'Animating...' : 'Generate Video'}
          </button>
        </div>
      )}
    </div>
  );
};