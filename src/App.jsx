import React, { useState, useEffect } from 'react';

const ViralClicker = () => {
  const [clicks, setClicks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [showRipple, setShowRipple] = useState(false);
  const [milestone, setMilestone] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(Date.now());
  const [clickSpeed, setClickSpeed] = useState(0);

  useEffect(() => {
    const loadClicks = async () => {
      try {
        const result = await window.storage.get('global_clicks', true);
        if (result && result.value) {
          setTotalClicks(parseInt(result.value));
        }
      } catch (error) {
        console.log('Loading clicks...');
      }
    };
    loadClicks();

    const interval = setInterval(async () => {
      try {
        const result = await window.storage.get('global_clicks', true);
        if (result && result.value) {
          setTotalClicks(parseInt(result.value));
        }
      } catch (error) {}
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = async (e) => {
    const now = Date.now();
    const timeDiff = now - lastClickTime;
    const speed = timeDiff < 1000 ? Math.round(1000 / timeDiff) : 1;
    setClickSpeed(speed);
    setLastClickTime(now);

    const newClicks = clicks + 1;
    const newTotal = totalClicks + 1;
    
    setClicks(newClicks);
    setTotalClicks(newTotal);
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 600);

    try {
      await window.storage.set('global_clicks', newTotal.toString(), true);
    } catch (error) {
      console.log('Saving...');
    }

    if (newTotal % 1000 === 0) {
      setMilestone(newTotal);
      setTimeout(() => setMilestone(null), 3000);
      createConfetti(50);
    } else if (newTotal % 100 === 0) {
      createConfetti(20);
    }

    createClickEffect(e);
  };

  const createConfetti = (count) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#E74C3C', '#3498DB'];
    
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.3 + 's';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 10 + 5 + 'px';
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  const createClickEffect = (e) => {
    const effect = document.createElement('div');
    effect.className = 'fixed pointer-events-none text-4xl font-bold z-50';
    effect.style.left = e.clientX + 'px';
    effect.style.top = e.clientY + 'px';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.textContent = '+1';
    effect.style.color = '#60A5FA';
    effect.style.animation = 'float-up 1s ease-out forwards';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-up {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -150%) scale(1.5); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(effect);
    setTimeout(() => {
      effect.remove();
      style.remove();
    }, 1000);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const getMotivationalText = () => {
    if (totalClicks < 10) return "Every journey begins with a single click...";
    if (totalClicks < 100) return "You're on fire! Keep going!";
    if (totalClicks < 1000) return "The world is clicking together!";
    if (totalClicks < 10000) return "This is getting MASSIVE!";
    return "LEGENDARY STATUS ACHIEVED!";
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      {milestone && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-8 py-4 rounded-full text-2xl font-bold animate-bounce z-50 shadow-2xl">
          🎉 {formatNumber(milestone)} CLICKS! 🎉
        </div>
      )}

      <div className="text-center mb-8 z-10">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl">
          THE BUTTON
        </h1>
        <p className="text-xl md:text-2xl text-blue-200 font-semibold mb-2">
          {getMotivationalText()}
        </p>
      </div>

      <div className="mb-8 text-center z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl px-8 py-6 border-2 border-white/20 shadow-2xl">
          <p className="text-sm text-blue-200 uppercase tracking-wider mb-2">Global Clicks</p>
          <p className="text-6xl md:text-8xl font-black text-white">
            {formatNumber(totalClicks)}
          </p>
          <p className="text-sm text-blue-300 mt-2">People are clicking RIGHT NOW!</p>
        </div>
      </div>

      <button
        onClick={handleClick}
        className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 active:scale-95 transition-all duration-150 shadow-2xl pulse-glow float-animation ${showRipple ? 'ripple-effect' : ''}`}
      >
        <div className="absolute inset-0 rounded-full bg-white/20 blur-xl"></div>
        <span className="relative text-5xl md:text-6xl font-black text-white drop-shadow-lg">
          CLICK ME
        </span>
      </button>

      <div className="mt-8 text-center z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
          <p className="text-sm text-blue-200 mb-1">Your Clicks</p>
          <p className="text-4xl font-bold text-white">{clicks.toLocaleString()}</p>
          {clickSpeed > 1 && (
            <p className="text-xs text-yellow-300 mt-1">🔥 {clickSpeed} clicks/sec!</p>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 text-center z-10 px-4">
        <p className="text-sm text-white/60">Share with friends and watch the number grow! 🚀</p>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default ViralClicker;
