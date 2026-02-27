const React = window.React;
const ReactDOM = window.ReactDOM;
const { useState, useMemo } = React;

const EighteenthHoleApp = () => {
  const [yourHcp, setYourHcp] = useState(8);
  const [oppHcp, setOppHcp] = useState(8);
  const [fatigueFactor, setFatigueFactor] = useState(0);
  const [moneyAmount, setMoneyAmount] = useState(0);
  const [mentalToughness, setMentalToughness] = useState(5);
  const [expandedSection, setExpandedSection] = useState('results');

  const calculateSingleHoleOdds = (yours, opp) => {
    const hcpDiff = Math.abs(yours - opp);
    let tieProb = 35;
    let yourWinProb = 32.5;
    let oppWinProb = 32.5;
    
    if (hcpDiff > 0) {
      const skillEdge = hcpDiff * 2;
      tieProb = Math.max(20, 35 - (hcpDiff * 1.5));
      if (yours < opp) {
        yourWinProb = 32.5 + (skillEdge / 2);
        oppWinProb = 32.5 - (skillEdge / 2);
      } else {
        yourWinProb = 32.5 - (skillEdge / 2);
        oppWinProb = 32.5 + (skillEdge / 2);
      }
    }
    
    const totalWinProb = yourWinProb + oppWinProb;
    yourWinProb = (yourWinProb / totalWinProb) * (100 - tieProb);
    oppWinProb = (oppWinProb / totalWinProb) * (100 - tieProb);
    
    let moneylineOdds = 0;
    if (Math.abs(yourWinProb - 50) < 0.1) {
      moneylineOdds = 100;
    } else if (yourWinProb > 50) {
      moneylineOdds = -Math.round((yourWinProb / (100 - yourWinProb)) * 100);
    } else {
      moneylineOdds = Math.round(((100 - yourWinProb) / yourWinProb) * 100);
    }
    
    return { moneylineOdds, baseWinProb: yourWinProb };
  };

  const { moneylineOdds: baseMoneyline, baseWinProb } = useMemo(
    () => calculateSingleHoleOdds(yourHcp, oppHcp),
    [yourHcp, oppHcp]
  );

  const baseTieProb = useMemo(() => {
    const hcpDiff = Math.abs(yourHcp - oppHcp);
    return Math.max(20, 35 - (hcpDiff * 1.5));
  }, [yourHcp, oppHcp]);

  const adjustedOdds = useMemo(() => {
    let adjustedWinProb = baseWinProb;
    let adjustedTieProb = baseTieProb;

    if (fatigueFactor > 0) {
      adjustedWinProb -= fatigueFactor * 1.5;
    } else if (fatigueFactor < 0) {
      adjustedWinProb += Math.abs(fatigueFactor) * 1.5;
    }

    if (moneyAmount > 0) {
      const moneyMap = [0, 1, 10, 50, 100, 250, 500, 1000];
      const actualMoney = moneyMap[moneyAmount];
      const pressureEffect = actualMoney * 0.02;
      if (baseWinProb > 50) {
        adjustedWinProb -= pressureEffect;
      } else if (baseWinProb < 50) {
        adjustedWinProb += pressureEffect * 0.3;
      }
      adjustedTieProb -= actualMoney * 0.003;
    }

    const mentalEdge = (mentalToughness - 5) * 1.2;
    adjustedWinProb += mentalEdge;

    adjustedWinProb = Math.max(5, Math.min(95, adjustedWinProb));
    adjustedTieProb = Math.max(8, adjustedTieProb);
    
    if (adjustedWinProb + adjustedTieProb > 100) {
      adjustedTieProb = 100 - adjustedWinProb - 5;
    }

    const oppWinProb = 100 - adjustedWinProb - adjustedTieProb;
    let finalOdds = 0;
    if (Math.abs(adjustedWinProb - oppWinProb) < 0.1) {
      finalOdds = 100;
    } else if (adjustedWinProb > oppWinProb) {
      finalOdds = -Math.round((adjustedWinProb / oppWinProb) * 100);
    } else {
      finalOdds = Math.round((oppWinProb / adjustedWinProb) * 100);
    }

    return { odds: finalOdds, winProb: Math.round(adjustedWinProb), tieProb: Math.round(adjustedTieProb) };
  }, [yourHcp, oppHcp, baseWinProb, baseTieProb, fatigueFactor, moneyAmount, mentalToughness]);

  const lossProb = 100 - adjustedOdds.winProb - adjustedOdds.tieProb;
  const oddsShift = adjustedOdds.odds - baseMoneyline;

  const getMoneyDisplay = () => {
    const moneyMap = [0, 1, 10, 50, 100, 250, 500, 1000];
    const amount = moneyMap[moneyAmount];
    if (amount === 0) return '$0';
    return `$${amount}`;
  };

  const getHandicapLabel = (hcp) => {
    if (hcp === 0) return 'Pro';
    if (hcp <= 5) return 'Elite';
    if (hcp <= 10) return 'Very Good';
    if (hcp <= 15) return 'Good';
    return 'Rec';
  };

  return React.createElement('div', { className: 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen text-white' },
    React.createElement('div', { className: 'h-4' }),
    React.createElement('div', { className: 'px-4 pt-2 pb-6' },
      React.createElement('h1', { className: 'text-3xl font-black tracking-tighter bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1' }, '18TH HOLE'),
      React.createElement('p', { className: 'text-slate-400 text-sm' }, 'Odds & Outcome')
    ),
    React.createElement('div', { className: 'px-4 mb-4' },
      React.createElement('div', { className: 'bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/40 rounded-2xl p-5 shadow-2xl' },
        React.createElement('p', { className: 'text-xs text-slate-400 uppercase tracking-widest font-semibold mb-4' }, 'Your Odds'),
        React.createElement('div', { className: 'grid grid-cols-3 gap-2 mb-6' },
          React.createElement('div', { className: 'bg-green-950/60 border border-green-500/50 rounded-lg p-3 text-center' },
            React.createElement('p', { className: 'text-xs text-slate-400 mb-2' }, 'Win'),
            React.createElement('p', { className: 'text-2xl font-black text-green-400'