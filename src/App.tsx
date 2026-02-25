import { useState } from 'react';
import type { DragEvent } from 'react';
import NesEmulator from './components/NesEmulator';

function App() {
  const [romUrl, setRomUrl] = useState<string>("/streemerz-v02-s1.nes");
  const [romData, setRomData] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // เมื่อลากไฟล์เข้ามาในเว็บ
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // เมื่อลากไฟล์ออกไป
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // เมื่อปล่อยเมาส์ (Drop ไฟล์)
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    // ตรวจสอบว่ามีการลากไฟล์มาปล่อยจริงๆ ไม่ใช่แค่ข้อความ
    if (e.dataTransfer.items) {
      const item = e.dataTransfer.items[0];
      if (item && item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          if (file.name.toLowerCase().endsWith('.nes')) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const buffer = event.target?.result as ArrayBuffer;
              if (buffer) {
                const array = new Uint8Array(buffer);
                let data = "";
                for (let i = 0; i < array.length; i++) {
                  data += String.fromCharCode(array[i]);
                }
                setRomData(data);
              }
            };
            reader.readAsArrayBuffer(file);
          } else {
            alert("กรุณาใช้ไฟล์นามสกุล .nes เท่านั้นครับ! (ไฟล์นี้ชื่อ: " + file.name + ")");
          }
        }
      }
    }
  };

  return (
    // ผูก Event Listener เข้ากับ div นอกสุด
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="min-h-screen min-w-screen bg-zinc-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] flex flex-col items-center justify-center py-8 font-['Press_Start_2P'] relative"
    >

      {/* เอฟเฟกต์ Overlay ตอนที่กำลังลากไฟล์ (จอจะดรอปสีลงนิดนึงเพื่อบอกว่าพร้อมรับไฟล์) */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm pointer-events-none border-8 border-dashed border-red-500 rounded-lg m-4">
          <h2 className="text-4xl text-red-500 animate-pulse">DROP .NES ROM HERE!</h2>
        </div>
      )}

      {/* Header ของเว็บเรืองแสง */}
      <div className="text-center mb-6 mt-8">
        <h1 className="text-3xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 font-bold drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] mb-2">
          WEB EMULATOR
        </h1>
        <p className="text-zinc-500 text-xs md:text-sm tracking-[0.3em]">DRAG & DROP A .NES FILE TO PLAY</p>
      </div>

      {/* แผงเลือกตลับเกม (Cartridge Selector) */}
      <div className="w-full max-w-[768px] px-4 mb-8">
        <p className="text-zinc-400 text-xs md:text-sm mb-4 border-b border-zinc-700 pb-2">CHOOSE A GAME:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            // {list_of_NES_games}
          ].map((game) => (
            <div
              key={game.id}
              onClick={() => {
                setRomData(null); // เคลียร์ข้อมูลที่อาจจะลากมาเก่า เพื่อบังคับให้โหลด URL ใหม่
                setRomUrl(`/public/${game.url}`);
              }}
              className="group cursor-pointer bg-zinc-800 rounded outline outline-2 outline-transparent hover:outline-red-500 transition-all overflow-hidden flex flex-col hover:scale-105 active:scale-95 shadow-lg"
            >
              <div className="aspect-square bg-zinc-900 border-b border-zinc-700 p-1">
                <img
                  src={`/${game.id}.png`} /* อ้างอิงรูปภาพจาก public folder */
                  alt={game.title}
                  className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity pixelated"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <div className="p-2 text-center text-[8px] md:text-[10px] text-zinc-300 truncate">
                {game.title}
              </div>
            </div>
          ))}
        </div>

        {/* ข้อความบอกใบ้เรื่อง Drag & Drop ให้ผู้เล่นรู้ */}
        <div className="mt-8 text-center bg-zinc-900 border border-zinc-700 rounded-lg py-4 px-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border-dashed">
          <p className="text-zinc-500 text-xs md:text-sm tracking-widest leading-relaxed">
            <span className="text-red-500 block mb-2">OR</span>
            DRAG & DROP YOUR OWN <br className="md:hidden" />.NES FILE HERE TO PLAY
          </p>
        </div>
      </div>

      {/* ส่ง romData ไปให้ดึงตลับใหม่เข้ามาเล่น, ถ้าไม่มีก็จะดึง romUrl ที่ถูกเลือก */}
      <div className="w-full flex justify-center px-4">
        {/* ใช้ key={romUrl} บังคับให้ Component Unmount และ Mount ใหม่ทุกครั้งที่เปลี่ยนเกม เพื่อเคลียร์สถานะ Emulator อันเก่าทิ้ง */}
        <NesEmulator key={romUrl} romUrl={romUrl} romData={romData} />
      </div>

      <p className="text-zinc-600 text-[10px] mt-12 text-center mb-12">
        Powered by React & jsnes
      </p>

    </div>
  );
}

export default App;
