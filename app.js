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
                    setCard({ 
                        ...json.major_arcana[record.index], 
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

    if (isLoading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white">加载中...</div>;

    const hasDrawnToday = !!history[getTodayStr()];

    return (
        // 使用 min-h-screen 替代 fixed inset-0，确保内容能撑开高度
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
            
            {/* 顶部导航 */}
            <header className="p-6 flex justify-center sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
                <div className="bg-slate-900 p-1 rounded-xl border border-white/10 flex">
                    <button onClick={() => setView('draw')} className={`px-6 py-2 rounded-lg text-sm ${view === 'draw' ? 'bg-indigo-600' : 'opacity-50'}`}>今日启示</button>
                    <button onClick={() => setView('calendar')} className={`px-6 py-2 rounded-lg text-sm ${view === 'calendar' ? 'bg-indigo-600' : 'opacity-50'}`}>时光月历</button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center px-6 pb-40">
                {view === 'draw' ? (
                    <div className="w-full max-w-sm flex flex-col items-center space-y-8 py-4">
                        <h1 className="text-xl tracking-widest text-indigo-200">🔮 TAROT DAILY</h1>
                        
                        {/* 牌面区域 */}
                        <div className="w-56 h-80 relative">
                            {isDrawing ? (
                                <div className="w-full h-full bg-indigo-900/20 rounded-2xl border border-indigo-500/30 animate-pulse flex items-center justify-center text-4xl">✨</div>
                            ) : card ? (
                                <img src={card.imageUrl} className={`w-full h-full object-cover rounded-2xl shadow-2xl border border-white/10 ${card.isUpright ? '' : 'rotate-180'}`} />
                            ) : (
                                <div className="w-full h-full bg-slate-900 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-white/10 italic text-sm">尚未抽牌</div>
                            )}
                        </div>

                        {/* 解读文本区域 */}
                        {card && !isDrawing && (
                            <div className="w-full space-y-4 animate-[fadeIn_0.5s]">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-yellow-400">{card.name}</h2>
                                    <p className="text-indigo-300 text-xs mt-1">{card.isUpright ? '正位 · UPRIGHT' : '逆位 · REVERSED'}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center opacity-70">
                                    {card.keywords?.map(k => <span key={k} className="text-[10px] px-2 py-1 bg-white/5 rounded">#{k}</span>)}
                                </div>
                                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <p className="text-sm leading-relaxed text-slate-300 italic">{card.meaning}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* 月历视图 */
                    <div className="w-full max-w-md space-y-6 pt-4">
                         <div className="flex justify-between items-center px-2">
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>◁</button>
                            <span className="font-serif">{currentMonth.getFullYear()} / {currentMonth.getMonth() + 1}</span>
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>▷</button>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                             {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => <div key={`e-${i}`} />)}
                             {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                 const day = i + 1;
                                 const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                 const record = history[dateStr];
                                 return (
                                     <div key={day} className="aspect-[2/3] bg-slate-900 rounded border border-white/5 flex items-center justify-center relative overflow-hidden">
                                         <span className="absolute top-0.5 left-1 text-[8px] opacity-20">{day}</span>
                                         {record && <img src={`images/${record.index}.jpg`} className={`w-full h-full object-cover ${record.isUpright ? '' : 'rotate-180'}`} />}
                                     </div>
                                 );
                             })}
                        </div>
                    </div>
                )}
            </main>

            {/* 吸底按钮：改用 absolute 定位确保不会因为 flex 挤压而消失 */}
            {view === 'draw' && (
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
                    <button 
                        onClick={drawCard} 
                        disabled={hasDrawnToday || isDrawing}
                        className={`w-full max-w-sm mx-auto block py-4 rounded-xl font-bold text-lg ${hasDrawnToday ? 'bg-slate-800 text-white/20' : 'bg-indigo-600 shadow-xl shadow-indigo-900/20'}`}
                    >
                        {hasDrawnToday ? '今日已占卜' : '开启今日启示'}
                    </button>
                    {/* 预留 Home Indicator 空间 */}
                    <div className="h-6"></div>
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
