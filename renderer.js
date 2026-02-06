// UI Elements
const dropZone = document.getElementById('drop-zone');
const mainContent = document.getElementById('main-content');
const selectFileBtn = document.getElementById('select-file-btn');
const changeFileBtn = document.getElementById('change-file-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const fileName = document.getElementById('file-name');
const fileDetails = document.getElementById('file-details');
const spectrumCanvas = document.getElementById('spectrum-canvas');
const waveformCanvas = document.getElementById('waveform-canvas');
const playhead = document.getElementById('playhead');

// Title bar controls
document.getElementById('minimize-btn').addEventListener('click', () => {
  window.electronAPI.minimizeWindow();
});

document.getElementById('maximize-btn').addEventListener('click', () => {
  window.electronAPI.maximizeWindow();
});

document.getElementById('close-btn').addEventListener('click', () => {
  window.electronAPI.closeWindow();
});

// Audio context and nodes
let audioContext;
let audioSource;
let analyser;
let audioBuffer;
let isPlaying = false;
let startTime = 0;
let pauseTime = 0;
let animationId;

// Initialize audio context
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 8192;
    analyser.smoothingTimeConstant = 0.8;
  }
}

// File selection
selectFileBtn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.selectFile();
  if (filePath) {
    loadAudioFile(filePath);
  }
});

changeFileBtn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.selectFile();
  if (filePath) {
    stopAudio();
    loadAudioFile(filePath);
  }
});

// Drag and drop
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('drag-over');
  
  const file = e.dataTransfer.files[0];
  if (file && isAudioFile(file.name)) {
    loadAudioFileFromDrop(file);
  }
});

function isAudioFile(filename) {
  const audioExtensions = ['.mp3', '.flac', '.wav', '.m4a', '.aac', '.ogg', '.opus'];
  return audioExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

// Load audio file from file path (Electron dialog)
async function loadAudioFile(filePath) {
  try {
    initAudioContext();
    
    const response = await fetch(`file://${filePath}`);
    const arrayBuffer = await response.arrayBuffer();
    
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Update UI
    const name = filePath.split(/[/\\]/).pop();
    fileName.textContent = name;
    fileDetails.textContent = `${formatDuration(audioBuffer.duration)} • ${audioBuffer.sampleRate} Hz • ${audioBuffer.numberOfChannels} channel${audioBuffer.numberOfChannels > 1 ? 's' : ''}`;
    
    // Update analysis
    document.getElementById('duration').textContent = formatDuration(audioBuffer.duration);
    document.getElementById('sample-rate').textContent = `${audioBuffer.sampleRate} Hz`;
    
    // Draw waveform
    drawWaveform();
    
    // Show main content
    dropZone.classList.add('hidden');
    mainContent.classList.remove('hidden');
    
    // Auto play
    playAudio();
  } catch (error) {
    console.error('Error loading audio file:', error);
    alert('Error loading audio file. Please try another file.');
  }
}

// Load audio file from drop
async function loadAudioFileFromDrop(file) {
  try {
    initAudioContext();
    
    const arrayBuffer = await file.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Update UI
    fileName.textContent = file.name;
    fileDetails.textContent = `${formatDuration(audioBuffer.duration)} • ${audioBuffer.sampleRate} Hz • ${audioBuffer.numberOfChannels} channel${audioBuffer.numberOfChannels > 1 ? 's' : ''}`;
    
    // Update analysis
    document.getElementById('duration').textContent = formatDuration(audioBuffer.duration);
    document.getElementById('sample-rate').textContent = `${audioBuffer.sampleRate} Hz`;
    
    // Draw waveform
    drawWaveform();
    
    // Show main content
    dropZone.classList.add('hidden');
    mainContent.classList.remove('hidden');
    
    // Auto play
    playAudio();
  } catch (error) {
    console.error('Error loading audio file:', error);
    alert('Error loading audio file. Please try another file.');
  }
}

// Play/Pause control
playPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
});

function playAudio() {
  if (!audioBuffer) return;
  
  if (audioSource) {
    audioSource.stop();
  }
  
  audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);
  
  const offset = pauseTime;
  audioSource.start(0, offset);
  startTime = audioContext.currentTime - offset;
  
  isPlaying = true;
  playIcon.classList.add('hidden');
  pauseIcon.classList.remove('hidden');
  
  audioSource.onended = () => {
    isPlaying = false;
    pauseTime = 0;
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    cancelAnimationFrame(animationId);
  };
  
  visualize();
}

function pauseAudio() {
  if (audioSource && isPlaying) {
    pauseTime = audioContext.currentTime - startTime;
    audioSource.stop();
    isPlaying = false;
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    cancelAnimationFrame(animationId);
  }
}

function stopAudio() {
  if (audioSource) {
    audioSource.stop();
    audioSource = null;
  }
  isPlaying = false;
  pauseTime = 0;
  playIcon.classList.remove('hidden');
  pauseIcon.classList.add('hidden');
  cancelAnimationFrame(animationId);
}

// Visualization
function visualize() {
  const canvas = spectrumCanvas;
  const canvasCtx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  function draw() {
    if (!isPlaying) return;
    
    animationId = requestAnimationFrame(draw);
    
    analyser.getByteFrequencyData(dataArray);
    
    // Clear canvas
    canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw spectrum
    const barCount = 128;
    const barWidth = canvas.width / barCount;
    
    let peakFreq = 0;
    let peakValue = 0;
    let totalLevel = 0;
    
    for (let i = 0; i < barCount; i++) {
      const index = Math.floor(i * bufferLength / barCount);
      const value = dataArray[index];
      const barHeight = (value / 255) * canvas.height;
      
      // Track peak frequency
      if (value > peakValue) {
        peakValue = value;
        peakFreq = (index / bufferLength) * (audioContext.sampleRate / 2);
      }
      
      totalLevel += value;
      
      // Create gradient
      const gradient = canvasCtx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
      gradient.addColorStop(0, '#00d4ff');
      gradient.addColorStop(0.5, '#0099ff');
      gradient.addColorStop(1, '#0066cc');
      
      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
      
      // Reflection effect
      const reflectionGradient = canvasCtx.createLinearGradient(0, canvas.height, 0, canvas.height + barHeight * 0.3);
      reflectionGradient.addColorStop(0, 'rgba(0, 212, 255, 0.2)');
      reflectionGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
      
      canvasCtx.fillStyle = reflectionGradient;
      canvasCtx.fillRect(i * barWidth, canvas.height, barWidth - 2, barHeight * 0.3);
    }
    
    // Update analysis
    document.getElementById('peak-freq').textContent = `${Math.round(peakFreq)} Hz`;
    const avgLevel = Math.round((totalLevel / barCount / 255) * 100);
    document.getElementById('avg-level').textContent = `${avgLevel}%`;
    
    // Update playhead
    if (audioBuffer) {
      const currentTime = audioContext.currentTime - startTime;
      const progress = (currentTime / audioBuffer.duration) * 100;
      playhead.style.left = `${Math.min(progress, 100)}%`;
    }
  }
  
  draw();
}

// Draw waveform
function drawWaveform() {
  const canvas = waveformCanvas;
  const canvasCtx = canvas.getContext('2d');
  
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  const data = audioBuffer.getChannelData(0);
  const step = Math.ceil(data.length / canvas.width);
  const amp = canvas.height / 2;
  
  canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  
  canvasCtx.strokeStyle = '#00d4ff';
  canvasCtx.lineWidth = 1.5;
  canvasCtx.beginPath();
  
  for (let i = 0; i < canvas.width; i++) {
    let min = 1.0;
    let max = -1.0;
    
    for (let j = 0; j < step; j++) {
      const datum = data[(i * step) + j];
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    
    const yMin = (1 + min) * amp;
    const yMax = (1 + max) * amp;
    
    if (i === 0) {
      canvasCtx.moveTo(i, yMin);
    } else {
      canvasCtx.lineTo(i, yMin);
    }
    canvasCtx.lineTo(i, yMax);
  }
  
  canvasCtx.stroke();
}

// Utility functions
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Handle window resize
window.addEventListener('resize', () => {
  if (audioBuffer) {
    drawWaveform();
  }
});
