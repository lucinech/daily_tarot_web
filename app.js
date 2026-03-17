const { useState, useEffect } = React;

function App() {
    const [view, setView] = useState('draw'); 
    const [card, setCard] = useState(null);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);
    
    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('tarot_history');
            return saved ? JSON.parse(saved) : {};
        } catch { return {}; }
    });

    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getTodayStr = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    useEffect(() => {
        fetch('cards_data.json')
            .then(res => res.json())
            .then(json => {
                setData(json.major_arcana);
                const today = getTodayStr();
                if (history[today]) {
                    const record = history[today];
                    const fullCardData = json.major_arcana[record.index];
                    setCard({ 
                        ...fullCardData, 
                        isUpright: record.isUpright, 
                        imageUrl: `images/${record.index}.jpg` 
                    });
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const drawCard = () => {
        const today = getTodayStr();
        if (history[today] || isDrawing) return;
        setIsDrawing(true);
        setTimeout(() => {
            const index = Math.floor(Math.random() * data.length);
            const isUpright = Math.random() > 0.5;
            const newHistory = { ...history, [today]: { index, isUpright } };
            setHistory(newHistory);
            localStorage.setItem('tarot_history', JSON.stringify(newHistory));
            setCard({ ...data[index], isUpright, imageUrl: `images/${index}.jpg` });
            setIsDrawing(false);
        }, 1500);
    };

    if (isLoading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white">唤醒中...</div>;

    const hasDrawnToday = !!history[getTodayStr()];

    return (
        // 关键：h-screen + overflow-hidden 锁死视口，防止整体拖动
        <div className="h-screen bg-slate-950 text-white flex flex-col font-sans overflow-hidden">
            
            {/* 1. 顶部导航 (固定) */}
            <header className="flex-none pt-12 pb-4 flex justify-center bg-slate-950 z-50">
                <div className="bg-slate-900/80 p-1 rounded-xl border border-white/10 flex">
                    <button onClick={() => setView('draw')} className={`px-6 py-2 rounded-lg text-sm transition ${view === 'draw' ? 'bg-indigo-600 shadow-lg' : 'opacity-40'}`}>启示</button>
                    <button onClick={() => setView('calendar')} className={`px-6 py-2 rounded-lg text-sm transition ${view === 'calendar' ? 'bg-indigo-600 shadow-lg' : 'opacity-40'}`}>月历</button>
                </div>
            </header>

            {/* 2. 中间内容区 (允许滚动) */}
            <main className="flex-1 overflow-y-auto px-6 scrolling-touch">
                {view === 'draw' ? (
                    <div className="w-full max-w-sm mx-auto flex flex-col items-center py-6 space-y-8">
                        <div className="text-center">
                            <h1 className="text-xl tracking-[0.3em] text-indigo-100 font-light">TAROT DAILY</h1>
                            {hasDrawnToday && <p className="text-[10px] text-indigo-400 mt-1 opacity-60 tracking-widest italic">Today's energy is locked</p>}
                        </div>
                        
                        <div className="w-56 h-80 relative flex-none">
                            {isDrawing ? (
                                <div className="w-full h-full bg-indigo-900/20 rounded-3xl border border-indigo-500/20 animate-pulse flex items-center justify-center text-4xl">🔮</div>
                            ) : card ? (
                                <img src={card.imageUrl} className={`w-full h-full object-cover rounded-3xl shadow-2xl border border-white/10 ${card.isUpright ? '' : 'rotate-180'}`} />
                            ) : (
                                <div className="w-full h-full bg-slate-900/50 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/10">
                                    <div className="w-8 h-12 border border-white/5 rounded-md mb-2 animate-pulse"></div>
                                    <span className="text-[10px] tracking-widest uppercase">Tap to reveal</span>
                                </div>
                            )}
                        </div>

                        {card && !isDrawing && (
                            <div className="w-full space-y-6 animate-[fadeIn_0.5s] pb-10">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-yellow-400 tracking-tight">{card.name}</h2>
                                    <p className="text-indigo-300 text-xs mt-1 uppercase tracking-widest font-light">{card.isUpright ? 'Upright · 正位' : 'Reversed · 逆位'}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {card.keywords?.map(k => <span key={k} className="text-[10px] px-3 py-1 bg-indigo-500/5 rounded-full border border-indigo-500/10 text-indigo-
