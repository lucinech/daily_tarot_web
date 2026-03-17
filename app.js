const { useState, useEffect } = React;

function App() {
    const [view, setView] = useState('draw'); 
    const [card, setCard] = useState(null);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);
    
    // 初始化本地存储
    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('tarot_history');
            return saved ? JSON.parse(saved) : {};
        } catch { return {}; }
    });

    const [currentMonth, setCurrentMonth] = useState(new Date());

    // 🌟 统一后缀为 .jpeg
    const getImgPath = (idx) => `images/${idx}.jpeg`;

    const getTodayStr = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    useEffect(() => {
        fetch('cards_data.json')
            .then(res => res.json())
            .then(json => {
                const cardData = json.major_arcana || json; // 兼容不同格式的 JSON
                setData(cardData);
                
                const today = getTodayStr();
                if (history[today]) {
                    const record = history[today];
                    const fullCard = cardData[record.index];
                    if (fullCard) {
                        setCard({ 
                            ...fullCard, 
                            isUpright: record.isUpright, 
                            imageUrl: getImgPath(record.index) 
                        });
                    }
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const drawCard = () => {
        const today = getTodayStr();
        if (history[today] || isDrawing || data.length === 0) return;

        setIsDrawing(true);
        setTimeout(() => {
            const index = Math.floor(Math.random() * data.length);
            const isUpright = Math.random() > 0.5;
            const newHistory = { ...history, [today]: { index, isUpright } };
            
            setHistory(newHistory);
            localStorage.setItem('tarot_history', JSON.stringify(newHistory));
            
            setCard({ ...data[index], isUpright, imageUrl: getImgPath(index) });
            setIsDrawing(false);
        }, 1500);
    };

    if (isLoading) return <div className="h-full bg-slate-950 flex items-center justify-center text-white">唤醒星象中...</div>;

    const hasDrawnToday = !!history[getTodayStr()];

    return (
        <div className="h-full bg-slate-950 text-white flex flex-col overflow-hidden">
            
            {/* 顶部 (固定) */}
            <header className="flex-none pt-12 pb-4 flex justify-center z-50">
                <div className="bg-slate-900/80 p-1 rounded-xl border border-white/10 backdrop-blur-md flex">
                    <button onClick={() => setView('draw')} className={`px-8 py-2 rounded-lg text-sm transition-all ${view === 'draw' ? 'bg-indigo-600 shadow-lg' : 'opacity-40'}`}>今日启示</button>
                    <button onClick={() => setView('calendar')} className={`px-8 py-2 rounded-lg text-sm transition-all ${view === 'calendar' ? 'bg-indigo-600 shadow-lg' : 'opacity-40'}`}>时光月历</button>
                </div>
            </header>

            {/* 内容区 (仅此区域可滑动) */}
            <main className="flex-1 overflow-y-auto no-scrollbar px-6">
                {view === 'draw' ? (
                    <div className="flex flex-col items-center py-6 space-y-8 min-h-full">
                        <div className="text-center">
                            <h1 className="text-xl tracking-[0.3em] font-light text-indigo-100 uppercase">Tarot Daily</h1>
                            {hasDrawnToday && <p className="text-[10px] text-indigo-400 mt-2 tracking-widest opacity-60 italic">今日能量已锁定</p>}
                        </div>

                        {/* 牌面展示 */}
                        <div className="w-52 h-80 relative flex-none">
                            {isDrawing ? (
                                <div className="w-full h-full bg-indigo-900/20 rounded-3xl border border-indigo-500/30 animate-pulse flex items-center justify-center text-4xl">🔮</div>
                            ) : card ? (
                                <div className="animate-card w-full h-full">
                                    <img src={card.imageUrl} className={`w-full h-full object-cover rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 ${card.isUpright ? '' : 'rotate-180'}`} />
                                </div>
                            ) : (
                                <div className="w-full h-full bg-slate-900/50 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/10">
                                    <div className="w-8 h-12 border border-white/5 rounded-md mb-2 animate-pulse"></div>
                                    <span className="text-[10px] tracking-widest">等待开启</span>
                                </div>
                            )}
                        </div>

                        {/* 解读文本 */}
                        {card && !isDrawing && (
                            <div className="w-full space-y-6 animate-card pb-40">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-yellow-400 mb-1">{card.name}</h2>
                                    <p className="text-indigo-300 text-xs tracking-widest uppercase">{card.isUpright ? '✦ 正位 UPRIGHT ✦' : '✦ 逆位 REVERSED ✦'}</p>
                                </div>
                                <div className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/[0.05] shadow-inner">
                                    <p className="text-sm leading-relaxed text-slate-300 font-light italic text-center">
                                        {card.meaning}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* 月历视图 */
                    <div className="pb-32 pt-4 animate-card">
                         <div className="flex justify-between items-center mb-8 px-2">
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 opacity-30">◁</button>
                            <span className="text-lg font-serif tracking-widest">{currentMonth.getFullYear()} / {currentMonth.getMonth() + 1}</span>
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 opacity-30">▷</button>
                        </div>
                        <div className="grid grid-cols-7 gap-3">
                             {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => <div key={`e-${i}`} />)}
                             {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                 const day = i + 1;
                                 const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                 const record = history[dateStr];
                                 return (
                                     <div key={day} className="aspect-[2/3] bg-slate-900 rounded-lg border border-white/5 overflow-hidden flex items-center justify-center relative">
                                         <span className="absolute top-1 left-1 text-[8px] opacity-20 z-10">{day}</span>
                                         {record && <img src={getImgPath(record.index)} className={`w-full h-full object-cover ${record.isUpright ? '' : 'rotate-180'}`} />}
                                     </div>
                                 );
                             })}
                        </div>
                    </div>
                )}
            </main>

            {/* 底部按钮 (固定) */}
            {view === 'draw' && (
                <footer className="flex-none p-6 pb-12 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent z-50">
                    <button 
                        onClick={drawCard} 
                        disabled={hasDrawnToday || isDrawing}
                        className={`w-full max-w-sm mx-auto block py-5 rounded-2xl font-bold text-lg tracking-[0.2em] transition-all shadow-2xl ${hasDrawnToday ? 'bg-slate-800 text-white/20' : 'bg-gradient-to-r from-indigo-600 to-purple-600 active:scale-95'}`}
                    >
                        {hasDrawnToday ? '今日能量已锁定' : '开启今日启示'}
                    </button>
                </footer>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
