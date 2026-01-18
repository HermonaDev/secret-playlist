"use client";
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function VibeApp() {
  const [message, setMessage] = useState("");
  const [vibe, setVibe] = useState("");
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Ref to capture the receipt as an image
  const receiptRef = useRef<HTMLDivElement>(null);

  const generatePlaylist = async () => {
    if (!message || !vibe) return alert("Please provide a message and a vibe.");
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, vibe }),
      });
      const data = await res.json();
      setPlaylist(data.playlist || []);
      setDesc(data.description || "");
    } catch (err) {
      console.error("Fetch error:", err);
      alert("System error. Check terminal.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = playlist.map(item => `${item.letter}: ${item.song} - ${item.artist}`).join('\n');
    navigator.clipboard.writeText(`${text}\n\n"${desc}"`);
    alert("Manifest copied to clipboard!");
  };

  const downloadReceipt = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#09090b",
        scale: 2, // High-def output
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `manifest-${message.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center py-12 px-4 font-mono">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tighter text-green-500 italic">PLAYLIST_ARCHITECT</h1>
        <p className="text-zinc-500 text-[10px] tracking-widest uppercase">Encrypted Vibe Generation // v1.0.6</p>
      </div>

      {/* Input Module */}
      <div className="w-full max-w-md space-y-4 bg-zinc-900 p-6 rounded-sm border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        
        <input 
          className="w-full bg-black border border-zinc-700 p-3 rounded-none text-sm focus:border-green-500 outline-none transition-all placeholder:text-zinc-600 uppercase"
          placeholder="HIDDEN MESSAGE"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input 
          className="w-full bg-black border border-zinc-700 p-3 rounded-none text-sm focus:border-green-500 outline-none transition-all placeholder:text-zinc-600"
          placeholder="SONIC VIBE (e.g. Dark Techno, Sad Country)"
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
        />
        <button 
          onClick={generatePlaylist}
          disabled={loading}
          className="w-full bg-zinc-100 text-black py-4 font-black hover:bg-green-500 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "INITIALIZING ENGINE..." : "GENERATE MANIFEST"}
        </button>
      </div>

      {/* The Receipt Output */}
      {playlist?.length > 0 && (
        <div className="mt-12 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <div ref={receiptRef} className="bg-white text-black p-8 shadow-2xl w-full max-w-sm border-t-[14px] border-black">
            <div className="text-center mb-6 border-b-2 border-black pb-4">
              <h2 className="text-2xl font-black leading-none uppercase tracking-tighter">Receipt of Intent</h2>
              <p className="text-[10px] mt-2 italic text-zinc-500 font-sans">Time: {new Date().toLocaleTimeString()}</p>
            </div>
            
            <div className="space-y-3 mb-8">
              {playlist.map((item, i) => (
                <div key={i} className="flex justify-between text-[11px] items-start">
                  <span className="font-black bg-black text-white px-1.5 mr-2 min-w-[20px] text-center">{item.letter}</span>
                  <span className="flex-1 font-bold uppercase truncate pr-2">{item.song}</span>
                  <span className="text-zinc-500 font-sans italic shrink-0">{item.artist}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t-2 border-dashed border-zinc-300">
              <p className="text-[9px] uppercase font-bold mb-1 text-zinc-400">Archivist Commentary:</p>
              <p className="text-xs leading-tight italic font-serif text-zinc-800">"{desc}"</p>
              
              <div className="mt-6 flex flex-col items-center opacity-40">
                <div className="h-12 w-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/84/Ean-13-5901234123457.png')] bg-contain bg-center bg-no-repeat grayscale"></div>
                <p className="text-[8px] mt-1 font-sans tracking-[0.3em]">SYSTEM_VERSION_3.1.5</p>
              </div>
            </div>
          </div>

          {/* Post-Generation Actions */}
          <div className="flex gap-2 w-full max-w-sm mt-4">
            <button 
              onClick={copyToClipboard}
              className="flex-1 border border-zinc-700 py-3 text-[10px] font-black hover:bg-zinc-800 transition-all uppercase"
            >
              Copy Text
            </button>
            <button 
              onClick={downloadReceipt}
              className="flex-1 bg-green-600 text-white py-3 text-[10px] font-black hover:bg-green-500 transition-all uppercase shadow-lg shadow-green-900/20"
            >
              Save Image
            </button>
          </div>
        </div>
      )}
    </main>
  );
}