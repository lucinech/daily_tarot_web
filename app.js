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
            .catch(err => setIsLoading(false));
    }, []);

    const drawCard = () => {
        const today = getTodayStr();
        if (history[today] || isDrawing) return;

        setIsDrawing(true);
        setCard(null); 
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

    if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-indigo-300 animate-pulse">唤醒星象中...</div>;

    const hasDrawnToday = !!history[getTodayStr()];

    return (
        <div className="fixed inset-0 bg-slate-950 text-white flex flex-col items-center font-sans overflow-hidden">
            
            {/* 顶部导航 - 增加 PaddingTop 避开刘海 */}
            <div className="z-50 pt-10 pb-4 w-full flex justify-center">
                <div className="bg-slate-900/80 p-1 rounded-2xl border border-white/10 backdrop-blur-md flex scale-90">
                    <button onClick={() => setView('draw')} className={`px-8 py-2 rounded-xl text-sm transition-all ${view === 'draw' ? 'bg-indigo-600 shadow-lg' : 'opacity-40'}`}>今日启示</button>
                    <button onClick={() => setView('calendar')} className={`px-8 py-2 rounded-xl text-sm transition-all ${view === 'calendar' ? 'bg-indigo-600 shadow-lg' : 'opacity-40'}`}>时光月历</button>
                </div>
            </div>

            {/* 内容区：增加 pb-24 确保内容不被按钮挡住，允许滚动 */}
            <main className="flex-1 w-full max-w-md overflow-y-auto px-6 pb-32">
                {view === 'draw' ? (
                    <div className="w-full flex flex-col items-center py-4 space-y-8">
                        
                        <div className="text-center">
                            <h1 className="text-xl font-serif tracking-[0.3em] text-indigo-100 uppercase">Tarot Daily</h1>
                            {hasDrawnToday && <p className="text-[10px] text-indigo-400 mt-1 tracking-widest opacity-60 italic">— 今日能量已锁定 —</p>}
                        </div>

                        <div className="relative flex flex-col items-center w-full">
                            {isDrawing ? (
                                <div className="w-48 h-72 bg-indigo-600/5 rounded-3xl border-2 border-indigo-500/20 animate-pulse flex items-center justify-center">
                                    <span className="text-5xl animate-bounce">🔮</span>
                                </div>
                            ) : card ? (
                                <div className="flex flex-col items-center animate-[fadeIn_0.8s_ease-out] w-full">
                                    <img src={card.imageUrl} className={`w-48 h-72 object-cover rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/20 mb-6 ${card.isUpright ? '' : 'rotate-180'}`} />
                                    
                                    <div className="text-center space-y-4 w-full">
                                        <div>
                                            <h2 className="text-3xl font-bold text-yellow-400 mb-1">{card.name}</h2>
                                            <span className="text-[10px] tracking-[0.2em] text-indigo-200 bg-indigo-500/10 px-4 py-1 rounded-full border border-indigo-500/20 uppercase font-light">
                                                {card.isUpright ? 'Upright 正位' : 'Reversed 逆位'}
                                            </span>
                                        </div>

                                        <div className="flex gap-2 justify-center flex-wrap opacity-60">
                                            {card.keywords && card.keywords.map(k => (
                                                <span key={k} className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/5">#{k}</span>
                                            ))}
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 text-left shadow-inner">
                                            <p className="text-
