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
    const colors = ['#4ECDC4', '#45B7D1', '#6BCF7F', '#5DADE2', '#58D68D', '#73C6B6'];
    
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.3 + 's';
      confetti.style.width = Math.random() * 8 + 4 + 'px';
      confetti.style.height = Math.random() * 8 + 4 + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  const createClickEffect = (e) => {
    const effect = document.createElement('div');
    effect.className = 'fixed pointer-events-none text-3xl font-black z-50';
    effect.style.left = e.clientX + 'px';
    effect.style.top = e.clientY + 'px';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.textContent = '+1';
    effect.style.color = '#4ECDC4';
    effect.style.textShadow = '0 0 15px rgba(78, 205, 196, 0.8)';
    effect.style.animation = 'float-up 1s ease-out forwards';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-up {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -120%) scale(1.5); }
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
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const getProgressPercentage = () => {
    return Math.min((totalClicks / 8000000000) * 100, 100).toFixed(2);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      {milestone && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-6 py-2 rounded-full text-lg font-black z-50 shadow-xl border-2 border-white">
          🎉 {formatNumber(milestone)} 🎉
        </div>
      )}

      <div className="text-center mb-4 z-10">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
          THE BUTTON
        </h1>
        <p className="text-sm md:text-base text-white/90 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Global Goal: 8 Billion Clicks
        </p>
      </div>

      <div className="mb-4 text-center z-10">
        <div className="bg-white/25 backdrop-blur-lg rounded-2xl px-6 py-4 border-2 border-white/40 shadow-xl">
          <p className="text-xs text-white/80 uppercase tracking-wide mb-1 font-semibold">Global Clicks</p>
          <p className="text-5xl md:text-6xl font-black text-white drop-shadow-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {formatNumber(totalClicks)}
          </p>
          <div className="mt-2 w-full bg-white/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-400 to-teal-400 h-2 transition-all duration-500 rounded-full"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <p className="text-xs text-white/70 mt-1">{getProgressPercentage()}% to 8B</p>
        </div>
      </div>

      <button
        onClick={handleClick}
        className={`relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 hover:from-emerald-300 hover:via-teal-400 hover:to-cyan-500 active:scale-90 transition-all duration-200 shadow-2xl border-4 border-white/60 ${showRipple ? 'ripple-effect' : ''}`}
        style={{ 
          boxShadow: '0 0 40px rgba(78, 205, 196, 0.6)'
        }}
      >
        <span className="relative text-3xl md:text-4xl font-black text-white drop-shadow-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
          CLICK
        </span>
      </button>

      <div className="mt-4 text-center z-10">
        <div className="bg-white/25 backdrop-blur-lg rounded-2xl px-6 py-3 border-2 border-white/40 shadow-lg">
          <p className="text-xs text-white/80 mb-1 font-semibold uppercase tracking-wide">Your Clicks</p>
          <p className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{clicks.toLocaleString()}</p>
          {clickSpeed > 1 && (
            <p className="text-xs text-emerald-200 mt-1 font-bold">🔥 {clickSpeed}/sec</p>
          )}
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
};

export default ViralClicker;
