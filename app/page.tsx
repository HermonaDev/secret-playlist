"use client";
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function SpotifyVibeApp() {
  const [message, setMessage] = useState("");
  const [vibe, setVibe] = useState("");
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const generatePlaylist = async () => {
    if (!message || !vibe) return;
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#121212",
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `vibe-manifest.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // The "AI Engineer" Workaround: Search Link Generator
  const getSearchUrl = (song: string, artist: string) => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(song + " " + artist)}`;
  };

  return (
    <main className="min-h-screen bg-[#090909] text-white font-sans selection:bg-[#1DB954] selection:text-white relative overflow-x-hidden pb-20">
      
      {/* Dynamic Glow Background */}
      <div className="fixed top-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#1DB954]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto pt-16 px-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex gap-[2px] items-end h-6">
              <div className="w-1.5 bg-[#1DB954] animate-[bounce_1s_infinite_0.1s] h-3"></div>
              <div className="w-1.5 bg-[#1DB954] animate-[bounce_1s_infinite_0.3s] h-6"></div>
              <div className="w-1.5 bg-[#1DB954] animate-[bounce_1s_infinite_0.5s] h-4"></div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Vibe_Architect</h1>
          </div>
          <p className="text-zinc-500 text-[10px] tracking-[0.3em] font-bold uppercase">Powered by Gemini 3 Flash</p>
        </div>

        {/* Input Card */}
        <div className="bg-[#181818] border border-white/5 p-8 rounded-xl shadow-2xl space-y-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Hidden Message</label>
              <input 
                className="w-full bg-[#282828] border-none p-4 rounded-md text-sm font-bold focus:ring-1 ring-[#1DB954] outline-none transition-all placeholder:text-zinc-600 uppercase"
                placeholder="Ex: HIRE ME"
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Sonic Vibe</label>
              <input 
                className="w-full bg-[#282828] border-none p-4 rounded-md text-sm font-bold focus:ring-1 ring-[#1DB954] outline-none transition-all placeholder:text-zinc-600"
                placeholder="Ex: Cinematic Orchestral"
                onChange={(e) => setVibe(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={generatePlaylist}
            disabled={loading}
            className="w-full bg-[#1DB954] text-black py-4 rounded-full font-black text-sm tracking-widest uppercase hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-[#1DB954]/10"
          >
            {loading ? "Constructing Manifest..." : "Initialize Generation"}
          </button>
        </div>

        {/* The Result Card */}
        {playlist?.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div ref={receiptRef} className="bg-gradient-to-b from-[#222] to-[#121212] p-8 rounded-sm shadow-2xl border border-white/10 relative">
              
              {/* Header Info */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-10">
                <div className="w-56 h-56 bg-gradient-to-br from-[#282828] to-[#121212] flex items-center justify-center text-8xl font-black text-[#1DB954] shadow-2xl border border-white/5">
                  {message[0]}
                </div>
                <div className="text-center md:text-left flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">Automated Playlist</p>
                  <h2 className="text-6xl font-black tracking-tighter mb-4 break-all uppercase">{message}</h2>
                  <div className="bg-white/5 p-4 border-l-4 border-[#1DB954] italic text-zinc-300 text-sm">
                    "{desc}"
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="space-y-1">
                <div className="grid grid-cols-12 border-b border-white/10 pb-3 mb-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest px-4">
                  <div className="col-span-1">#</div>
                  <div className="col-span-7">Title / Secret Key</div>
                  <div className="col-span-4 text-right">Artist</div>
                </div>

                {playlist.map((item, i) => (
                  <a 
                    key={i} 
                    href={getSearchUrl(item.song, item.artist)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="grid grid-cols-12 py-3 hover:bg-white/10 rounded-md transition-all group px-4 cursor-pointer"
                  >
                    <div className="col-span-1 text-zinc-500 text-sm font-mono group-hover:text-white transition-colors self-center">
                      {(i + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="col-span-7 flex items-center gap-4">
                      <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center rounded text-[10px] font-black text-[#1DB954] border border-white/5 group-hover:bg-[#1DB954] group-hover:text-black transition-all">
                        {item.letter}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight group-hover:text-[#1DB954] transition-colors">{item.song}</span>
                        <span className="text-[10px] text-zinc-500 uppercase font-black md:hidden">{item.artist}</span>
                      </div>
                    </div>
                    <div className="col-span-4 text-right text-zinc-400 text-xs self-center hidden md:block">
                      {item.artist}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button 
                onClick={downloadReceipt}
                className="px-8 py-3 bg-transparent border border-zinc-700 rounded-full text-[10px] font-black tracking-widest text-zinc-400 hover:text-white hover:border-white transition-all"
              >
                DOWNLOAD HIGH-RES MANIFEST (.PNG)
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}