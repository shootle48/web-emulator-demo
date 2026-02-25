# React Web NES Emulator
A pure web-based Nintendo Entertainment System (NES) emulator built with React, Vite, and [jsnes](https://github.com/bfirsh/jsnes). 
This project aims to demonstrate how legacy video game hardware can be accurately simulated entirely within the browser using modern web technologies, without the need for server-side processing or external plugins.
## ✨ Features
* **Instant Playability:** Play classic NES games directly in your browser.
* **100% Client-Side:** Rom files (`.nes`) are processed entirely on the client, utilizing `FileReader()` for immediate binary translation. No backend required.
* **Arcade Aesthetic UI:** Designed with a striking retro, cyberpunk-inspired glowing user interface using Tailwind CSS and `Press Start 2P` typography.
* **Component Encapsulation:** The entire NES console is neatly packaged into a single `<NesEmulator />` React Component.
* **Dynamic ROM Loading (2 Methods!):**
   * **Cartridge Selector:** Click any of the pre-configured games in the showcase gallery to hotswap ROMs instantly.
   * **Drag & Drop:** Have your own `.nes` files? Just drag and drop them anywhere onto the application screen to play them immediately!
## 🕹️ Controls (Keyboard Only)
| Action | Keyboard Key |
| :--- | :--- |
| **D-PAD** | `Arrow Keys` (Up, Down, Left, Right) |
| **A Button** | `X` |
| **B Button** | `Z` |
| **START** | `Enter` |
| **SELECT** | `Shift` |
---
## 🚀 Local Deployment
Ready to run your own arcade? 
**Prerequisites:** Ensure you have Node.js and a package manager (`npm`, `yarn`, or `pnpm`) installed.
**1. Clone the repository:**
```bash
git clone https://github.com/your-username/react-nes-emulator.git
cd react-nes-emulator
```
**2. Install dependencies:**
```bash
npm install 
```
**3. Add Default Games (Optional):**
Place your `.nes` files and their corresponding `.png` cover art directly into the `/public` folder. If you wish to use the built-in Cartridge Selector UI, update the array in `src/App.tsx` with your filenames.
**4. Start the development server:**
```bash
npm run dev
```
The emulator will be running live at `http://localhost:5173`. Dive in!
## 🛠️ Tech Stack & Architecture
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Emulator Engine:** `jsnes` (A JavaScript NES emulator)
- **Styling:** Tailwind CSS v4
**How it works under the hood:**
The NES logic runs in a synchronized loop triggered by `requestAnimationFrame`, processing game logic at roughly 60 FPS. 
Once a frame is rendered by the `jsnes` PPU (Picture Processing Unit) into 24-bit colors, our React code intercepts it, maps it onto an `ImageData` array (32-bit ARGB), and directly pastes it onto an HTML5 `<canvas>` element using `ctx.putImageData()`.
## 🤝 Contributing & Next Steps
This project is a sandbox for learning and nostalgia. Here are some cool features that could be added next:
- **Save States:** Utilizing browser `localStorage` to save and load emulator RAM directly.
- **Audio Support:** Connecting `jsnes`'s audio buffers to the Web Audio API.
- **Mobile Support:** Adding on-screen virtual joypad overlays for touch devices.
Feel free to fork this project and implement them!
## 📜 License & Credits
This project was built for educational purposes.
* Core emulation engine powered by [jsnes](https://github.com/bfirsh/jsnes).
* Fonts provided by Google Fonts (*Press Start 2P*).
* Please ensure you own the rights to any `.nes` ROMs you intend to play or distribute.
