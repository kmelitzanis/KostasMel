# SonoVis - Audio Spectrum Analyzer 🎵

![SonoVis](https://img.shields.io/badge/SonoVis-Audio%20Analyzer-00d4ff?style=for-the-badge)
![Electron](https://img.shields.io/badge/Electron-Framework-47848F?style=for-the-badge&logo=electron)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**SonoVis** (Latin: *Sonus* = Sound, *Visio* = Vision) - A modern, minimal audio spectrum analyzer built with Electron. Visualize the audio spectrum of your music files to analyze quality, frequencies, and more. Inspired by Spek and designed with a Serato DJ-like minimal interface.

## ✨ Features

- 🎨 **Modern Minimal UI** - Clean, Serato DJ-inspired interface
- 📊 **Real-time Spectrum Analysis** - Visual frequency spectrum with gradient effects
- 🌊 **Waveform Display** - See the audio waveform at a glance
- 📈 **Frequency Analysis** - Peak frequency, average level, and more metrics
- 🎵 **Multi-format Support** - MP3, FLAC, WAV, M4A, AAC, OGG, OPUS
- 🖱️ **Drag & Drop** - Easy file loading with drag-and-drop support
- ⚡ **Fast & Responsive** - Built with Web Audio API for smooth performance

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kmelitzanis/KostasMel.git
cd KostasMel
```

2. Install dependencies:
```bash
npm install
```

3. Run the application:
```bash
npm start
```

## 🎯 Usage

1. **Launch SonoVis** - Start the application
2. **Load Audio File** - Either:
   - Click "Select File" button
   - Drag and drop an audio file into the window
3. **Analyze** - The spectrum and waveform will be displayed automatically
4. **Play/Pause** - Control playback with the play/pause button
5. **View Analysis** - Check real-time frequency analysis metrics

### Supported Audio Formats

- MP3 (`.mp3`)
- FLAC (`.flac`)
- WAV (`.wav`)
- M4A (`.m4a`)
- AAC (`.aac`)
- OGG (`.ogg`)
- OPUS (`.opus`)

## 🎨 Interface

The UI is designed to be minimal and modern, inspired by professional DJ software like Serato:

- **Dark Theme** - Easy on the eyes for long analysis sessions
- **Gradient Spectrum Bars** - Beautiful cyan gradient visualization
- **Custom Title Bar** - Frameless window with custom controls
- **Responsive Layout** - Adapts to different window sizes
- **Smooth Animations** - Professional feel with subtle transitions

## 🛠️ Technology Stack

- **Electron** - Cross-platform desktop framework
- **Web Audio API** - High-performance audio processing
- **Canvas API** - Real-time spectrum and waveform rendering
- **Modern JavaScript** - ES6+ features

## 📊 Features Breakdown

### Spectrum Visualizer
- 128 frequency bands
- Real-time FFT analysis (8192 samples)
- Gradient color scheme (cyan to blue)
- Reflection effects for depth

### Waveform Display
- Full audio waveform overview
- Moving playhead indicator
- Click-to-seek capability (future enhancement)

### Analysis Metrics
- **Peak Frequency** - Dominant frequency in Hz
- **Average Level** - Overall audio level percentage
- **Duration** - Total track length
- **Sample Rate** - Audio quality indicator

## 🎵 About the Creator

**Kostas Melitzanis**
- 🎓 Computer Engineering Graduate | University of Thessaly
- 🎹 Music Producer & DJ
- 🥁 Professional Drummer
- 💻 Full-stack Developer

Connect: kmelitzanis@outlook.com

## 📝 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 🙏 Credits

Inspired by:
- [Spek](https://www.spek.cc/) - Audio spectrum analyzer
- Serato DJ - UI design inspiration

---

Made with ❤️ by Kostas Melitzanis

