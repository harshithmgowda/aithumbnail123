import React, { useState, useEffect, useRef } from 'react';
import { LoadingState } from './types';
import { generateThumbnail } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { Sparkles, Download, Wand2, AlertCircle, ImageIcon, Layers, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll Animation Observer
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".scroll-anim").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleGenerate = async () => {
    if (imageFiles.length === 0) {
      setError("Please upload at least one source image.");
      return;
    }
    if (!description.trim()) {
      setError("Please add a short description.");
      return;
    }

    setStatus(LoadingState.GENERATING);
    setError(null);
    setGeneratedImage(null);

    // Smooth scroll to result
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const resultUrl = await generateThumbnail(imageFiles, description);
      setGeneratedImage(resultUrl);
      setStatus(LoadingState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setStatus(LoadingState.ERROR);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `thumbgen-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setImageFiles([]);
    setDescription('');
    setGeneratedImage(null);
    setStatus(LoadingState.IDLE);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid z-[-1] pointer-events-none opacity-40"></div>
      
      {/* Ambient Light Effect */}
      <div className="fixed top-[-20%] left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] bg-red-900/20 rounded-full blur-[120px] z-[-1]"></div>

      {/* Header */}
      <header className={`fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-500 ${isScrolled ? 'header-blur' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 group cursor-pointer">
          <Zap className="w-6 h-6 text-red-500 group-hover:text-white transition-colors" />
          <h1 className="text-xl font-bold tracking-tight">ThumbGen<span className="text-red-500">AI</span></h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
           {status === LoadingState.SUCCESS && (
            <button 
              onClick={handleReset}
              className="text-red-500 border border-red-500/30 px-4 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all uppercase text-xs tracking-wider"
            >
              Start New
            </button>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-32 px-4 md:px-8 pb-24 max-w-7xl mx-auto w-full flex flex-col gap-16">
        
        {/* Hero Text */}
        <section className="text-center space-y-6 scroll-anim">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-2">
            <Sparkles className="w-3 h-3 text-red-500" />
            <span>POWERED BY GEMINI 2.5</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
            Create Viral <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Thumbnails</span> Instantly
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Upload your assets, describe the vibe, and let AI generate professional, high-CTR thumbnails in seconds.
          </p>
        </section>

        {/* Interaction Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Column */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* Step 1: Upload */}
              <div className="ui-card p-8 scroll-anim flex flex-col gap-6">
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600/20 text-red-500 text-sm font-bold">01</span>
                      Upload Assets
                    </h3>
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                 </div>
                 <ImageUploader 
                    onImagesChange={setImageFiles} 
                    selectedImages={imageFiles} 
                  />
              </div>

              {/* Step 2: Prompt */}
              <div className="ui-card p-8 scroll-anim flex flex-col gap-6" style={{ transitionDelay: '100ms' }}>
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600/20 text-red-500 text-sm font-bold">02</span>
                      Describe Vision
                    </h3>
                    <Layers className="w-5 h-5 text-gray-500" />
                 </div>
                 
                 <div className="relative group">
                    <textarea
                      id="prompt"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ex: A shocked reaction face on the left, bright neon green text reading 'SECRET REVEALED', dark mysterious background..."
                      className="w-full h-48 bg-black/30 border border-white/10 rounded-xl p-5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:bg-black/50 transition-all resize-none text-base leading-relaxed"
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-gray-600 font-mono bg-black/40 px-2 py-1 rounded">
                      {description.length} chars
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm animate-pulse">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <Button 
                    variant="primary" 
                    className="w-full text-lg py-4 uppercase tracking-wider shadow-lg shadow-red-900/20"
                    onClick={handleGenerate}
                    isLoading={status === LoadingState.GENERATING}
                    disabled={status === LoadingState.GENERATING}
                  >
                    {!status || status === LoadingState.IDLE || status === LoadingState.ERROR ? (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Generate Thumbnail
                      </>
                    ) : (
                      "Designing..."
                    )}
                  </Button>
              </div>
            </div>

            {/* Output Column */}
            <div id="result-section" className="lg:col-span-5 sticky top-24">
               <div className="ui-card p-1 min-h-[400px] flex flex-col scroll-anim" style={{ transitionDelay: '200ms' }}>
                  <div className="bg-[#0f0f0f] rounded-t-[14px] p-4 border-b border-white/5 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Preview Output</span>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                    </div>
                  </div>
                  
                  <div className="flex-grow bg-black/40 rounded-b-[14px] overflow-hidden relative flex items-center justify-center group">
                    {generatedImage ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={generatedImage} 
                          alt="Generated" 
                          className="w-full h-auto object-cover shadow-2xl"
                        />
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                           <Button onClick={handleDownload} className="scale-90 group-hover:scale-100 transition-transform">
                             <Download className="w-5 h-5" />
                             Download High-Res
                           </Button>
                        </div>
                      </div>
                    ) : (
                       <div className="flex flex-col items-center justify-center p-12 text-center">
                         {status === LoadingState.GENERATING ? (
                           <div className="relative">
                             <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-red-500 animate-spin mb-6"></div>
                             <div className="absolute inset-0 flex items-center justify-center">
                               <Sparkles className="w-8 h-8 text-red-500 animate-pulse" />
                             </div>
                             <p className="text-sm text-gray-400 animate-pulse">AI is creating...</p>
                           </div>
                         ) : (
                           <div className="opacity-20 flex flex-col items-center">
                             <ImageIcon className="w-16 h-16 mb-4" />
                             <p className="text-sm uppercase tracking-widest font-bold">No Result Yet</p>
                           </div>
                         )}
                       </div>
                    )}
                  </div>
               </div>

               {/* Stats / Info */}
               <div className="mt-6 grid grid-cols-2 gap-4 scroll-anim" style={{ transitionDelay: '300ms' }}>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                    <div className={`font-bold ${status === LoadingState.SUCCESS ? 'text-green-500' : 'text-gray-300'}`}>
                      {status === LoadingState.SUCCESS ? 'COMPLETED' : status === LoadingState.GENERATING ? 'PROCESSING' : 'READY'}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Quality</div>
                    <div className="font-bold text-gray-300">HD 1280x720</div>
                  </div>
               </div>
            </div>
        </div>

      </main>

      {/* Interactive Footer */}
      <footer className="mt-auto border-t border-white/5 bg-black/20 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2024 ThumbGen AI. All rights reserved.</p>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Created by</span>
            <span className="text-red-500 font-bold border-b border-red-500/50 pb-0.5 hover:text-white hover:border-white transition-all cursor-default">
              Harshith
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;