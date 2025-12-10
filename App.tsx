
import React, { useState, useEffect } from 'react';
import { HexMap } from './components/HexMap';
import { ChatInterface } from './components/ChatInterface';
import { ToolsPanel } from './components/ToolsPanel';
import { Message, Sender, ImageSize, AspectRatio, WorldView } from './types';
import { WORLD_VIEWS } from './data/worldViews';
import { 
    sendDiplomatMessage, 
    generateCyberImage, 
    generateVeoVideo, 
    generateWorldEvent,
    checkApiKey, 
    promptApiKeySelection 
} from './services/geminiService';

const App: React.FC = () => {
  const [activeWorld, setActiveWorld] = useState<WorldView>(WORLD_VIEWS.lotr);
  const [isWorldSelectorOpen, setIsWorldSelectorOpen] = useState(false); // Collapsed by default
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Greetings. I am the Chronicler of ${WORLD_VIEWS.lotr.name}. The realm awaits your observation.`,
      sender: Sender.Diplomat,
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);

  // Check for API key on mount
  useEffect(() => {
    const init = async () => {
        const keyExists = await checkApiKey();
        setHasKey(keyExists);
    };
    init();
  }, []);

  const handleConnect = async () => {
    await promptApiKeySelection();
    // Re-check
    const keyExists = await checkApiKey();
    setHasKey(keyExists);
  };

  const handleSwitchWorld = (worldId: string) => {
      const newWorld = WORLD_VIEWS[worldId];
      if (newWorld) {
          setActiveWorld(newWorld);
          setActiveLocationId(null);
          setIsWorldSelectorOpen(false); // Collapse after selection
          setMessages([
            {
                id: Date.now().toString(),
                text: `Transition complete. Entering ${newWorld.name}. ${newWorld.description}`,
                sender: Sender.Diplomat,
                timestamp: new Date()
            }
          ]);
      }
  };

  const addMessage = (text: string, sender: Sender, mediaUrl?: string, mediaType?: 'image' | 'video') => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      mediaUrl,
      mediaType
    }]);
  };

  const handleSendMessage = async (text: string) => {
    addMessage(text, Sender.User);
    setIsProcessing(true);

    // Construct simple history string
    const history = messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n');

    const response = await sendDiplomatMessage(history, text, activeWorld.systemPersona);
    addMessage(response, Sender.Diplomat);
    setIsProcessing(false);
  };

  const handleNextDay = async () => {
      if (isProcessing) return;
      setIsProcessing(true);
      
      try {
          // 1. Generate Event
          const event = await generateWorldEvent(activeWorld.locations, activeWorld.description);
          
          if (event) {
              setActiveLocationId(event.locationId);
              const locationName = activeWorld.locations.find(l => l.id === event.locationId)?.name || "Unknown";
              
              // 2. Generate Image for Event
              let imageUrl = undefined;
              try {
                  imageUrl = await generateCyberImage(event.imagePrompt, ImageSize.Size1K);
              } catch (imgErr) {
                  console.error("Image gen failed for event", imgErr);
              }

              // 3. Post to Chat
              addMessage(
                  `[EVENT at ${locationName}]\n${event.narrative}`, 
                  Sender.Diplomat, 
                  imageUrl, 
                  'image'
              );
          } else {
              addMessage("The era passes peacefully. Nothing of note occurred.", Sender.System);
          }

      } catch (e) {
          console.error("Next Day Error", e);
          addMessage("Simulation error.", Sender.System);
      } finally {
          setIsProcessing(false);
      }
  };

  const handleGenerateImage = async (prompt: string, size: ImageSize) => {
    if (!hasKey) {
        addMessage("Access Denied. Paid API Key required for high-fidelity rendering.", Sender.System);
        return;
    }
    
    setIsProcessing(true);
    addMessage(`Requesting visual artifact: ${prompt} (${size})`, Sender.User);

    try {
        const base64Url = await generateCyberImage(prompt, size);
        addMessage(`Rendering complete.`, Sender.Diplomat, base64Url, 'image');
    } catch (e) {
        addMessage(`Rendering failed: ${(e as Error).message}`, Sender.Diplomat);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleGenerateVideo = async (prompt: string, image: string | null, aspectRatio: AspectRatio) => {
    if (!hasKey) {
        addMessage("Access Denied. Paid API Key required for temporal synthesis.", Sender.System);
        return;
    }

    setIsProcessing(true);
    addMessage(`Initializing Veo engine...`, Sender.User);

    try {
        const videoUrl = await generateVeoVideo(prompt, image, aspectRatio);
        addMessage(`Synthesis complete.`, Sender.Diplomat, videoUrl, 'video');
    } catch (e) {
        addMessage(`Synthesis failed: ${(e as Error).message}`, Sender.Diplomat);
    } finally {
        setIsProcessing(false);
    }
  };

  if (!hasKey) {
      return (
          <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white space-y-6 p-8">
              <h1 className="text-4xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  MULTIVERSE//SIMULATION
              </h1>
              <p className="text-gray-400 text-center max-w-md">
                  Initializing the Multiverse Simulation Engine requires a verified access token.
              </p>
              <button 
                onClick={handleConnect}
                className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-all"
              >
                  Initialize System (Select API Key)
              </button>
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-xs text-gray-600 underline">
                  Billing Information
              </a>
          </div>
      );
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
      {/* Left: Map & Controls */}
      <div className="w-full h-1/2 md:h-full md:w-7/12 relative border-b-4 md:border-b-0 md:border-r-4 border-gray-800 bg-[#1e1e24]">
         <HexMap 
            locations={activeWorld.locations}
            activeLocationId={activeLocationId}
            activeWorld={activeWorld}
         />
         
         {/* World Header Overlay */}
         <div className="absolute top-0 left-0 right-0 p-6 pointer-events-none flex justify-between items-start">
             <div className="bg-gradient-to-b from-black/80 to-transparent p-4 -m-4 rounded-b-xl shadow-lg">
                 <h1 
                    className="text-3xl font-bold text-white mb-2 tracking-tighter shadow-black drop-shadow-md transition-colors duration-500"
                    style={{ color: activeWorld.themeColor }}
                 >
                     {activeWorld.name.toUpperCase()}
                 </h1>
                 <p className="text-xs text-gray-300 font-mono bg-black/40 p-2 rounded inline-block backdrop-blur-sm border-l-2" style={{ borderColor: activeWorld.themeColor }}>
                     Era: {activeWorld.era}<br/>
                     Locations: {activeWorld.locations.length}
                 </p>
             </div>

             {/* Collapsible World Switcher (Pointer Events Enabled) */}
             <div className="pointer-events-auto flex flex-col items-end z-30">
                 <button
                    onClick={() => setIsWorldSelectorOpen(!isWorldSelectorOpen)}
                    className="flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs px-4 py-2 rounded-lg border border-white/10 transition-all shadow-xl"
                 >
                    <span className="uppercase tracking-wider font-bold">Switch Universe</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform duration-300 ${isWorldSelectorOpen ? 'rotate-180' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                 </button>

                 {/* Dropdown Menu */}
                 <div className={`
                    mt-2 flex flex-col gap-1 bg-black/95 border border-white/10 rounded-lg p-2 shadow-2xl backdrop-blur-xl transition-all duration-300 origin-top-right w-48
                    ${isWorldSelectorOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
                 `}>
                     {Object.values(WORLD_VIEWS).map(world => (
                         <button
                            key={world.id}
                            onClick={() => handleSwitchWorld(world.id)}
                            className={`
                                text-xs px-4 py-3 rounded font-mono text-left transition-all border-l-2 hover:bg-white/10 flex flex-col gap-0.5
                                ${activeWorld.id === world.id 
                                    ? 'bg-white/5 text-white' 
                                    : 'text-gray-400'}
                            `}
                            style={{ borderColor: activeWorld.id === world.id ? world.themeColor : 'transparent' }}
                         >
                             <span className="font-bold">{world.name}</span>
                             <span className="text-[10px] opacity-60">{world.era}</span>
                         </button>
                     ))}
                 </div>
             </div>
         </div>

         {/* Next Day Button */}
         <div className="absolute bottom-6 left-6 z-20">
            <button
                onClick={handleNextDay}
                disabled={isProcessing}
                className={`
                    group relative px-6 py-3 font-mono font-bold text-sm tracking-wider uppercase
                    transition-all duration-300 clip-path-polygon shadow-lg
                    ${isProcessing
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                        : 'text-black hover:scale-105 hover:shadow-xl'
                    }
                `}
                style={{ 
                    clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)',
                    backgroundColor: isProcessing ? undefined : activeWorld.themeColor,
                    boxShadow: isProcessing ? 'none' : `0 0 30px ${activeWorld.themeColor}50`
                }}
            >
                {isProcessing ? 'Simulating...' : 'Next Turn >>'}
            </button>
         </div>

         {/* Tools Overlay */}
         <ToolsPanel 
            onGenerateImage={handleGenerateImage} 
            onGenerateVideo={handleGenerateVideo} 
            isProcessing={isProcessing}
         />
      </div>

      {/* Right: Chat Interface */}
      <div className="w-full h-1/2 md:h-full md:w-5/12 flex flex-col border-l border-gray-800">
        <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isProcessing}
        />
      </div>
    </div>
  );
};

export default App;
