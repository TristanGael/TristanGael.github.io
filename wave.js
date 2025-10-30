const svg = document.getElementById('stage');
const wave = document.getElementById('wave');
const targets = Array.from(document.querySelectorAll('.target'));

let amplitude = 0;
let targetAmplitude = 10; // Start with idle amplitude
let phase = 0;
let animating = true; // Always animate

// Timed animation state
let animationActive = false;
let animationStartTime = 0;
let animationDuration = 1000; // 1 second to match sound
let currentFrequency = 440;
let maxAmplitude = 100;

// Mobile detection for reduced amplitude
function isMobile() {
  return window.innerWidth <= 768;
}

// Audio context for generating sounds
let audioContext;
let isAudioInitialized = false;

// Initialize audio context (must be done after user interaction)
function initializeAudio() {
  if (!isAudioInitialized) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume context if it's suspended (required by some browsers)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      isAudioInitialized = true;
      console.log('Audio initialized successfully');
    } catch (error) {
      console.log('Audio initialization failed:', error);
    }
  }
}

// Function to play a tone
function playTone(frequency, duration = 1000, volume = 0.1) {
  try {
    if (!isAudioInitialized) {
      initializeAudio();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure the sound
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine'; // Smooth sine wave sound
    
    // Create a smooth fade in/out envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    console.log('Audio not available:', error);
  }
}

function makeWavePath(amp, phase, segments = 200) {
  const width = 800;
  const centerY = 10;

  let d = `M 0 ${centerY}`;
  
  if (animationActive) {
    // Calculate animation progress (0 to 1)
    const currentTime = performance.now();
    const elapsed = currentTime - animationStartTime;
    const progress = Math.min(elapsed / animationDuration, 1);
    
    // Create envelope that starts strong and fades out
    const envelope = Math.sin(progress * Math.PI); // Creates a bell curve over 1 second
    const currentAmplitude = maxAmplitude * envelope;
    
    // Sound wave pattern based on frequency - CENTER FOCUSED
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const x = t * width;
      
      // Calculate distance from center (0.5)
      const distanceFromCenter = Math.abs(t - 0.5);
      
      // Create center-focused envelope with smoother edges (affects center 85% instead of 70%)
      // Use a smoother curve instead of linear dropoff for more natural transitions
      const normalizedDistance = distanceFromCenter * 2.35; // Reduced from 2.8 to 2.35 for bigger coverage
      const centerEnvelope = Math.max(0, Math.pow(Math.max(0, 1 - normalizedDistance), 2)); // Smooth quadratic fade
      
      // Create wave only if we're in the center region
      let wave = 0;
      if (centerEnvelope > 0) {
        const frequencyFactor = currentFrequency / 261.63; // Normalize to C4
        // Reduce frequency multiplier to prevent aliasing on high frequencies
        const wavePhase = (t - 0.5) * Math.PI * 4 * frequencyFactor;
        
        // Single clean sine wave with center focus - stationary
        wave = Math.sin(wavePhase) * currentAmplitude * centerEnvelope;
      }
      
      const y = centerY + wave;
      
      d += ` L ${x} ${y}`;
    }
    
    // Check if animation should end
    if (progress >= 1) {
      animationActive = false;
      wave.setAttribute('filter', 'url(#whiteGlow)');
      wave.setAttribute('stroke-width', '3');
      wave.setAttribute('vector-effect', 'non-scaling-stroke');
      wave.setAttribute('stroke-linecap', 'round');
      wave.setAttribute('stroke-linejoin', 'round');
    }
  } else {
    // Normal idle wave mode
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const x = t * width;
      
      // Simplified wave calculation for smoother results
      const wavePhase = phase + t * Math.PI * 4;
      
      // Single smooth sine wave with gentle envelope
      const envelope = Math.sin(t * Math.PI);
      const wave = Math.sin(wavePhase) * amp * envelope;
      
      const y = centerY + wave;
      
      d += ` L ${x} ${y}`;
    }
  }
  
  return d;
}

function updatePath() {
  if (!animationActive) {
    // Normal idle animation
    amplitude += (targetAmplitude - amplitude) * 0.1;
    phase += 0.01;
  }
  
  const d = makeWavePath(amplitude, phase);
  wave.setAttribute('d', d);
}

function tick() {
  updatePath();
  requestAnimationFrame(tick);
}

function triggerWaveAnimation(customAmplitude, frequency) {
  // Always trigger new animation - interrupt previous one if active
  
  // Play sound with the specified frequency
  playTone(frequency);
  
  // Start/restart timed animation
  animationActive = true;
  animationStartTime = performance.now(); // Reset start time for new animation
  currentFrequency = frequency;
  
  // Reduce amplitude on mobile devices
  const amplitudeMultiplier = isMobile() ? 0.4 : 1.2; // 40% on mobile, 120% on desktop
  maxAmplitude = customAmplitude * amplitudeMultiplier;
  
  // Enhance glow during animation
  wave.setAttribute('filter', 'url(#activeGlow)');
  wave.setAttribute('stroke-width', '4');
  wave.setAttribute('vector-effect', 'non-scaling-stroke');
  wave.setAttribute('stroke-linecap', 'round');
  wave.setAttribute('stroke-linejoin', 'round');
}

function showWave(customAmplitude, frequency) {
  // This is now just used for the old mouseleave behavior
  // We'll keep it for compatibility but it won't be used
}

function hideWave() {
  // No longer needed since animation is timed
  // Keep for compatibility
}

// Map each circle to its specific amplitude and sound frequency
// element-1 = yellow = 250, element-2 = pink = 190, element-3 = blue = 170, element-4 = green = 230
const circleConfig = {
  'element-1': { amplitude: 250, frequency: 523.25 }, // yellow - C5 (bright, high)
  'element-2': { amplitude: 190, frequency: 392.00 }, // pink - G4 (pleasant, mid-high)  
  'element-3': { amplitude: 170, frequency: 329.63 }, // blue - E4 (gentle, mid)
  'element-4': { amplitude: 230, frequency: 261.63 }, // green - C4 (warm, lower)
  'element-5': { amplitude: 210, frequency: 440.00 }, // purple - A4 (mysterious, mid-high)
  'element-6': { amplitude: 270, frequency: 587.33 }, // red - D5 (powerful, high)
  'element-7': { amplitude: 200, frequency: 349.23 }, // orange - F4 (warm, mid)
  'element-8': { amplitude: 220, frequency: 293.66 }  // teal - D4 (calm, mid-low)
};

targets.forEach(target => {
  // Get the element class to determine which circle this is
  const elementClass = Array.from(target.classList).find(cls => cls.startsWith('element-'));
  const config = circleConfig[elementClass] || { amplitude: 140, frequency: 440 }; // fallback
  
  target.addEventListener('mouseenter', () => triggerWaveAnimation(config.amplitude, config.frequency));
  // Remove mouseleave handler since we now use timed animations
});

// Start the continuous animation
requestAnimationFrame(tick);
0