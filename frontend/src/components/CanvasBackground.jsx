import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CanvasBackground = ({ scrollerRef }) => {
  const canvasRef = useRef(null);
  
  // Cache stores our Image objects so we don't re-download them
  const imageCache = useRef(new Map()); 
  
  // Track what is currently on screen to prevent overlapping renders
  const currentDrawRef = useRef({ folder: -1, frame: -1 });

  const folders = ['frames1', 'frames2', 'frames3', 'frames4', 'frames5'];
  const framesPerFolder = 300;
  const totalFrames = folders.length * framesPerFolder;

  // 1. Core loading function (loads dynamically on the fly)
  const preloadImage = (folderIdx, frameIdx) => {
    const key = `${folderIdx}-${frameIdx}`;
    
    // If we already loaded it, return it instantly
    if (imageCache.current.has(key)) return imageCache.current.get(key);

    const img = new Image();
    const indexStr = frameIdx.toString().padStart(3, '0');
    img.src = `/${folders[folderIdx]}/ezgif-frame-${indexStr}.jpg`;
    
    imageCache.current.set(key, img);
    return img;
  };

  // 2. Preload the very first sequence lightly so the page starts smooth
  useEffect(() => {
    for (let i = 1; i <= 30; i++) {
      preloadImage(0, i);
    }
  }, []);

  // 3. Main GSAP Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      
      // Force redraw of current frame on resize
      const { folder, frame } = currentDrawRef.current;
      if (folder !== -1) {
        currentDrawRef.current = { folder: -1, frame: -1 };
        drawFrame(folder, Math.max(1, frame));
      }
    };

    const drawFrame = (folderIdx, frameIdx) => {
      // Don't redraw if it's the exact same frame
      if (currentDrawRef.current.folder === folderIdx && currentDrawRef.current.frame === frameIdx) return;
      currentDrawRef.current = { folder: folderIdx, frame: frameIdx };

      const img = preloadImage(folderIdx, frameIdx);
      
      const render = () => {
        // If user scrolled super fast and we are already on a new frame, abandon this render
        if (currentDrawRef.current.folder !== folderIdx || currentDrawRef.current.frame !== frameIdx) return;
        
        const logicalWidth = window.innerWidth;
        const logicalHeight = window.innerHeight;
        const hRatio = logicalWidth / img.naturalWidth;
        const vRatio = logicalHeight / img.naturalHeight;
        const ratio = Math.max(hRatio, vRatio);
        
        const drawWidth = img.naturalWidth * ratio;
        const drawHeight = img.naturalHeight * ratio;
        const centerShift_x = (logicalWidth - drawWidth) / 2;
        const centerShift_y = (logicalHeight - drawHeight) / 2;
        
        ctx.fillStyle = '#050505'; 
        ctx.fillRect(0, 0, logicalWidth, logicalHeight);
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, centerShift_x, centerShift_y, drawWidth, drawHeight);
      };

      if (img.complete && img.naturalWidth > 0) {
        render(); // Instantly draw if it was cached
      } else {
        img.onload = render; // Wait for download if it wasn't
      }
      
      // Lookahead: Aggressively preload the NEXT 15 frames into the cache so they are ready before the user scrolls to them
      for (let i = 1; i <= 15; i++) {
        let nextFrame = frameIdx + i;
        let nextFolder = folderIdx;
        
        if (nextFrame > framesPerFolder) {
          nextFrame -= framesPerFolder;
          nextFolder++;
        }
        
        if (nextFolder < folders.length) {
          preloadImage(nextFolder, nextFrame);
        }
      }
    };

    // Draw the very first frame on load
    resizeCanvas();
    drawFrame(0, 1);
    
    // console.log("[GSAP Debug] Multi-Sequence Engine Running. Total Frames:", totalFrames);
    
    const ctx_gsap = gsap.context(() => {
      const firstSection = scrollerRef.current.querySelector('section');
      
      ScrollTrigger.create({
        scroller: scrollerRef.current, 
        trigger: firstSection || scrollerRef.current, 
        start: 'top top',
        end: () => {
          const maxScroll = Math.max(1, scrollerRef.current.scrollHeight - scrollerRef.current.clientHeight);
          return "+=" + maxScroll;
        },
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // self.progress (0.0 to 1.0) maps absolutely from frame 1 to frame 1500!
          const absoluteFrame = Math.round(1 + (totalFrames - 1) * self.progress);
          
          // Math to figure out WHICH folder we are in
          let folderIdx = Math.floor((absoluteFrame - 1) / framesPerFolder);
          folderIdx = Math.min(folderIdx, folders.length - 1);
          
          // Math to figure out WHICH frame inside that folder we need
          let localFrame = ((absoluteFrame - 1) % framesPerFolder) + 1;

          // console.log(`[Multi-Sequence] Progress: ${(self.progress * 100).toFixed(1)}% | Folder: ${folders[folderIdx]} | Frame: ${localFrame}`);
          
          drawFrame(folderIdx, localFrame);
        }
      });

      window.addEventListener('resize', resizeCanvas);
      ScrollTrigger.refresh();
    });

    return () => {
      ctx_gsap.revert();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [scrollerRef]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%',
          height: '100%',
          opacity: 1 // Canvas fades in instantly
        }}
      />
    </div>
  );
};

export default CanvasBackground;
