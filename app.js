const { useState, useEffect } = React;

function App() {
    const [view, setView] = useState('draw'); 
    const [card, setCard] = useState(null);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);
    
    // 初始化本地存储，防止 JSON 解析失败导致崩溃
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
        // 增加 loading 状态保护
        fetch('cards_data.json')
            .then(res => res.json())
            .then(json => {
                setData(json.major_arcana);
                const today = getTodayStr();
                if (history[today]) {
                    const record = history[today];
                    setCard({ 
                        ...json.major_arcana[record.index], 
                        isUpright: record.isUpright, 
                        imageUrl: `images/${record.index}.jpg` 
                    });
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("配置加载失败，请检查文件路径");
                setIsLoading(false);
            });
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

    if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-indigo-300 animate-pulse">唤醒星象中...</div>;

    const hasDrawnToday = !!history[getTodayStr()];

    return (
        <div className="fixed inset-0 bg-slate-950 text-white flex flex-col items-center overflow-hidden font-sans">
            
            {/* 顶栏导航 */}
            <div className="z-50 mt-8 mb-4 bg-slate-900/80 p-1 rounded-2xl border border-white/10 backdrop-blur-md flex">
                <button onClick={() => setView('draw')} className={`px-8 py-2 rounded-xl text-sm transition-all ${view === 'draw' ? 'bg-indigo-600 shadow-lg' : 'opacity-40'}`}>今日启示</button>
                <button onClick={() => setView('calendar')} className={`px-8 py-2 rounded-xl text-sm transition-all ${view === 'calendar' ? 'bg-indigo-600 shadow-lg' : 'opacity-40'}`}>时光月历</button>
            </div>

            <main className="flex-1 w-full max-w-md flex flex-col items-center justify-center p-6 pb-12">
                {view === 'draw' ? (
                    <div className="w-full flex flex-col items-center justify-between h-full max-h-[700px]">
                        
                        <div className="text-center">
                            <h1 className="text-2xl font-serif tracking-[0.3em] text-indigo-100">TAROT DAILY</h1>
                            <div className="h-1 w-12 bg-indigo-500/30 mx-auto mt-2 rounded-full"></div>
                        </div>

                        {/* 核心展示区：永不返回空，确保有东西显示 */}
                        <div className="relative flex-1 flex items-center justify-center w-full">
                            {isDrawing ? (
                                <div className="w-56 h-96 bg-indigo-600/5 rounded-3xl border-2 border-indigo-500/20 animate-pulse flex items-center justify-center">
                                    <span className="text-5xl animate-bounce">🔮</span>
                                </div>
                            ) : card ? (
                                <div className="flex flex-col items-center animate-[fadeIn_0.6s_ease-out]">
                                    <div className="relative mb-6">
                                        <img src={card.imageUrl} className={`w-56 h-96 object-cover rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/20 ${card.isUpright ? '' : 'rotate-180'}`} />
                                        <div className="absolute -inset-4 border border-indigo-500/10 rounded-[3rem] -z-10 animate-pulse"></div>
                                    </div>
                                    <h2 className="text-4xl font-bold text-yellow-400 mb-1 drop-shadow-md">{card.name}</h2>
                                    <p className="text-indigo-200 tracking-widest text-sm opacity-80">{card.isUpright ? '✦ 正位 UPRIGHT ✦' : '✦ 逆位 REVERSED ✦'}</p>
                                </div>
                            ) : (
                                /* 没抽牌时的保底 UI */
                                <div className="flex flex-col items-center space-y-6">
                                    <div className="w-56 h-96 bg-slate-900/80 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center group">
                                        <div className="w-16 h-24 border-2 border-white/5 rounded-lg mb-4 group-hover:border-indigo-500/30 transition-colors"></div>
                                        <p className="text-white/20 text-xs italic tracking-widest">尚未开启今日契约</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 按钮区 */}
                        <button 
                            onClick={drawCard} 
                            disabled={hasDrawnToday || isDrawing}
                            className={`w-full py-5 rounded-[2rem] font-bold text-lg tracking-widest transition-all shadow-xl ${hasDrawnToday ? 'bg-slate-800/50 text-white/20 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 active:scale-95'}`}
                        >
                            {hasDrawnToday ? '今日能量已锁定' : '开启今日启示'}
                        </button>
                    </div>
                ) : (
                    /* 月历视图逻辑保持稳健 */
                    <div className="w-full h-full bg-slate-900/30 backdrop-blur-xl rounded-[3rem] border border-white/10 p-6 flex flex-col">
                         <div className="flex justify-between items-center mb-8">
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 opacity-50 hover:opacity-100">◁</button>
                            <span className="text-xl font-serif">{currentMonth.getFullYear()} / {currentMonth.getMonth() + 1}</span>
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 opacity-50 hover:opacity-100">▷</button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 flex-1 overflow-y-auto pr-1">
                             {/* 简易日历渲染逻辑 */}
                             {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => <div key={`e-${i}`} />)}
                             {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                 const day = i + 1;
                                 const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                 const record = history[dateStr];
                                 return (
                                     <div key={day} className="aspect-[2/3] bg-slate-800/50 rounded-lg border border-white/5 overflow-hidden flex items-center justify-center">
                                         {record ? <img src={`images/${record.index}.jpg`} className={`w-full h-full object-cover ${record.isUpright ? '' : 'rotate-180'}`} /> : <span className="text-[10px] opacity-10">{day}</span>}
                                     </div>
                                 );
                             })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
