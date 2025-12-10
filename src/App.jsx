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
    const colors = ['#FF6B9D', '#C44569', '#FFA07A', '#FFD93D', '#6BCF7F', '#4ECDC4', '#45B7D1', '#A29BFE', '#FD79A8'];
    
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.3 + 's';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 10 + 5 + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  const createClickEffect = (e) => {
    const effect = document.createElement('div');
    effect.className = 'fixed pointer-events-none text-5xl font-black z-50';
    effect.style.left = e.clientX + 'px';
    effect.style.top = e.clientY + 'px';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.textContent = '+1';
    effect.style.color = '#FFD93D';
    effect.style.textShadow = '0 0 20px rgba(255, 217, 61, 0.8)';
    effect.style.animation = 'float-up 1s ease-out forwards';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-up {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -150%) scale(1.8); }
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
    if (totalClicks < 10) return "Join the clicking revolution! 🚀";
    if (totalClicks < 100) return "You're unstoppable! Keep clicking! 💪";
    if (totalClicks < 1000) return "The world is watching! Don't stop! 🌍";
    if (totalClicks < 10000) return "VIRAL ALERT! This is insane! 🔥";
    return "INTERNET LEGEND! You're making history! ⚡";
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      {milestone && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full text-2xl md:text-3xl font-black animate-bounce z-50 shadow-2xl border-4 border-white">
          🎉 {formatNumber(milestone)} CLICKS! 🎉
        </div>
      )}

      <div className="text-center mb-6 z-10">
        <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-4 drop-shadow-2xl" style={{ fontFamily: "'Fredoka', 'Poppins', sans-serif", letterSpacing: '-0.02em' }}>
          THE BUTTON
        </h1>
        <p className="text-xl md:text-3xl text-white font-bold mb-2 drop-shadow-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {getMotivationalText()}
        </p>
      </div>

      <div className="mb-8 text-center z-10">
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl px-10 py-8 border-4 border-white/40 shadow-2xl">
          <p className="text-sm md:text-base text-yellow-200 uppercase tracking-wider mb-2 font-bold">🌎 Global Clicks 🌎</p>
          <p className="text-7xl md:text-9xl font-black text-white drop-shadow-2xl" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {formatNumber(totalClicks)}
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-sm md:text-base text-green-200 font-semibold">Live • People clicking NOW!</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleClick}
        className={`relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 hover:from-yellow-300 hover:via-pink-400 hover:to-purple-500 active:scale-90 transition-all duration-200 shadow-2xl border-8 border-white/50 ${showRipple ? 'ripple-effect' : ''}`}
        style={{ 
          boxShadow: '0 0 60px rgba(255, 255, 255, 0.5), 0 0 120px rgba(255, 105, 180, 0.4)',
          animation: 'pulse-glow 1.5s ease-in-out infinite, float 3s ease-in-out infinite'
        }}
      >
        <div className="absolute inset-0 rounded-full bg-white/30 blur-2xl animate-pulse"></div>
        <span className="relative text-5xl md:text-7xl font-black text-white drop-shadow-2xl" style={{ fontFamily: "'Fredoka', sans-serif", textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
          CLICK ME!
        </span>
      </button>

      <div className="mt-8 text-center z-10">
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl px-8 py-5 border-4 border-white/40 shadow-xl">
          <p className="text-sm md:text-base text-yellow-200 mb-2 font-bold uppercase tracking-wide">⭐ Your Clicks ⭐</p>
          <p className="text-5xl md:text-6xl font-black text-white drop-shadow-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>{clicks.toLocaleString()}</p>
          {clickSpeed > 1 && (
            <div className="mt-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-1 rounded-full text-sm font-bold inline-block">
              🔥 {clickSpeed} clicks/sec! 🔥
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 text-center z-10 px-4">
        <p className="text-lg md:text-xl text-white font-bold drop-shadow-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
          💫 Share with friends and GO VIRAL! 💫
        </p>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-40 h-40 bg-yellow-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@700&family=Poppins:wght@400;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
};

export default ViralClicker;
