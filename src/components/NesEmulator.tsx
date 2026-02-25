import React, { useEffect, useRef } from "react";
import { Controller, NES } from "jsnes";

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;

const NesEmulator = ({ romUrl, romData }: { romUrl?: string, romData?: string | null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nesRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. เตรียมพื้นที่จอภาพ
    const imageData = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
    const buf = new ArrayBuffer(imageData.data.length);
    const buf8 = new Uint8ClampedArray(buf);
    const buf32 = new Uint32Array(buf);

    // 2. ประกอบเครื่อง NES
    nesRef.current = new NES({
      onFrame: (framebuffer_24: number[]) => {
        for (let i = 0; i < framebuffer_24.length; i++) {
          buf32[i] = 0xff000000 | framebuffer_24[i];
        }
        imageData.data.set(buf8);
        ctx.putImageData(imageData, 0, 0);
      },
    });

    let frameRequestId: number;

    const KEY_MAPPING: { [key: string]: number } = {
      ArrowUp: Controller.BUTTON_UP,
      ArrowDown: Controller.BUTTON_DOWN,
      ArrowLeft: Controller.BUTTON_LEFT,
      ArrowRight: Controller.BUTTON_RIGHT,
      x: Controller.BUTTON_A,
      z: Controller.BUTTON_B,
      Enter: Controller.BUTTON_START,
      Shift: Controller.BUTTON_SELECT,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const btn = KEY_MAPPING[e.key];
      if (btn !== undefined && nesRef.current) {
        nesRef.current.buttonDown(1, btn);
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const btn = KEY_MAPPING[e.key];
      if (btn !== undefined && nesRef.current) {
        nesRef.current.buttonUp(1, btn);
      }
    };

    // ฟังก์ชันรันเกมและเปิดลูป
    const startGameFromData = (data: string) => {
      nesRef.current.loadROM(data);
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      console.log("โหลดเกมสำเร็จพร้อมเล่น");

      const loop = () => {
        nesRef.current?.frame();
        frameRequestId = requestAnimationFrame(loop);
      };
      frameRequestId = requestAnimationFrame(loop);
    };

    // 3. ตรวจสอบว่ามีข้อมูลจาก Drag & Drop ไหม หรือต้อง Fetch
    if (romData) {
      // โหลดจากไฟล์ที่ Drop เข้ามาสดๆ
      startGameFromData(romData);
    } else if (romUrl) {
      // โหลดจาก URL
      fetch(romUrl)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          const array = new Uint8Array(buffer);
          let rawString = "";
          for (let i = 0; i < array.length; i++) {
            rawString += String.fromCharCode(array[i]);
          }
          startGameFromData(rawString);
        })
        .catch((err) => {
          console.error("โหลดไฟล์เกมไม่สำเร็จ:", err);
        });
    }

    // เลิกเล่นถอดปลั๊ก
    return () => {
      if (frameRequestId) cancelAnimationFrame(frameRequestId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [romUrl, romData]);

  return (
    // 1. กรอบเครื่องเกมหลัก
    <div className="flex flex-col justify-center items-center bg-zinc-800 p-4 md:p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] border-b-8 border-r-8 border-zinc-950 border-t-2 border-l-2 border-zinc-600 relative">
      {/* 2. กรอบทีวีจอแก้ว (CRT Bezel) */}
      <div className="bg-black p-4 md:p-6 rounded-3xl shadow-inner border-[12px] border-zinc-900 relative overflow-hidden">
        {/* เอฟเฟกต์เส้นสแกนทีวีเก่า (Scanline Overlay) ให้ดูมีความสมจริง */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-black"></div>
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, black 3px, black 4px)",
          }}
        ></div>
        {/* 3. ตัวจอ Canvas ของจริง (ปรับขนาดให้ใหญ่ขึ้น) */}
        <canvas
          ref={canvasRef}
          width={SCREEN_WIDTH}  // 256
          height={SCREEN_HEIGHT} // 240
          className="w-full min-w-[425px] h-auto object-contain rounded"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      {/* 4. ป้ายบอกปุ่มกด (ขยายให้กว้างเท่าจอที่ใหญ่ขึ้น) */}
      <div className="mt-8 text-zinc-400 font-['Press_Start_2P'] text-[10px] md:text-sm leading-relaxed space-y-4 w-full max-w-[768px]">
        <div className="flex justify-between border-b border-zinc-600 pb-2">
          <span>🎮 D-PAD</span>
          <span className="text-red-400">ARROW KEYS</span>
        </div>
        <div className="flex justify-between border-b border-zinc-600 pb-2">
          <span>🔴 A BUTTON</span>
          <span className="text-red-400">X KEY</span>
        </div>
        <div className="flex justify-between border-b border-zinc-600 pb-2">
          <span>🔴 B BUTTON</span>
          <span className="text-red-400">Z KEY</span>
        </div>
        <div className="flex justify-between border-b border-zinc-600 pb-2">
          <span>▶️ START / SELECT</span>
          <span className="text-red-400">ENTER / SHIFT</span>
        </div>
      </div>
    </div>
  );
};

export default NesEmulator;
