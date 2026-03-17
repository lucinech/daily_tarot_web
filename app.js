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
        } catch (e) { return {}; }
    });

    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getTodayStr = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    useEffect(() => {
        // 增加数据加载保底
        fetch('cards_data.json')
            .then(res => res.json())
            .then(json => {
                if (json && json.major_arcana) {
                    setData(json.major_arcana);
                    const today = getTodayStr();
                    if (history[today]) {
                        const record = history[today];
                        const fullCard = json.major_arcana[record.index];
                        if (fullCard) {
                            setCard({ ...fullCard, isUpright: record.isUpright, imageUrl: `images/${record.index}.jpeg` });
                        }
                    }
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setIsLoading(false);
            });
    }, []);

    const drawCard = () => {
        if (!data.length || isDrawing || !!history[getTodayStr()]) return;
        setIsDrawing(true);
        setTimeout(() => {
            const index = Math.floor(Math.random() * data.length);
            const isUpright = Math.random() > 0.5;
            const today = getTodayStr();
            const newHistory = { ...history, [today]: { index, isUpright } };
            setHistory(newHistory);
            localStorage.setItem('tarot_history', JSON.stringify(newHistory));
            setCard({ ...data[index], isUpright, imageUrl: `images/${index}.jpeg` });
            setIsDrawing(false);
        }, 1200);
    };

    if (isLoading) return <div style={{background:'#020617', color:'white', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>唤醒星象中...</div>;

    const hasDrawnToday = !!history[getTodayStr()];

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
            
            {/* 1. 顶部导航 - 确保有高度 */}
            <nav className="p-6 flex justify-center flex-none">
                <div className="bg-slate-900 border border-white/10 p-1 rounded-xl flex">
                    <button onClick={() => setView('draw')} className={`px-6 py-2 rounded-lg text-sm ${view === 'draw' ? 'bg-indigo-600' : 'opacity-50'}`}>启示</button>
                    <button onClick={() => setView('calendar')} className={`px-6 py-2 rounded-lg text-sm ${view === 'calendar' ? 'bg-indigo-600' : 'opacity-50'}`}>月历</button>
                </div>
            </nav>

            {/* 2. 中间内容 - 移除溢出隐藏，保证能看见 */}
            <main className="flex-1 w-full max-w-md mx-auto px-6 pb-40">
                {view === 'draw' ? (
                    <div className="flex flex-col items-center space-y-8 py-4">
                        <div className="text-center">
                            <h1 className="text-xl tracking-widest text-indigo-200">🔮 TAROT DAILY</h1>
                            {hasDrawnToday && <p className="text-[10px] text-indigo-500 mt-1 italic">今日能量已锁定</p>}
                        </div>

                        <div className="w-52 h-80 relative bg-slate-900 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                            {isDrawing ? (
                                <div className="w-full h-full flex items-center justify-center animate-pulse text-4xl">✨</div>
                            ) : card ? (
                                <img src={card.imageUrl} className={`w-full h-full object-cover ${card.isUpright ? '' : 'rotate-180'}`} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/10">尚未抽牌</div>
                            )}
                        </div>

                        {card && !isDrawing && (
                            <div className="w-full space-y-4 animate-[fadeIn_0.5s]">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-yellow-400">{card.name}</h2>
                                    <p className="text-indigo-300 text-xs mt-1 uppercase">{card.isUpright ? 'Upright · 正位' : 'Reversed · 逆位'}</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 shadow-inner">
                                    <p className="text-sm leading-relaxed text-slate-300 italic text-center">{card.meaning}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full pt-4">
                        <div className="flex justify-between items-center mb-6 px-2">
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

            {/* 3. 底部按钮 - 放弃 fixed，改用简单 sticky 或块布局 */}
            {view === 'draw' && (
                <div className="fixed bottom-0 left-0 right-0 p-6 pb-12 bg-gradient-to-t from-slate-950 to-transparent">
                    <button 
                        onClick={drawCard} 
                        disabled={hasDrawnToday || isDrawing}
                        className={`w-full max-w-sm mx-auto block py-4 rounded-xl font-bold text-lg ${hasDrawnToday ? 'bg-slate-800 text-white/20' : 'bg-indigo-600 shadow-xl'}`}
                    >
                        {hasDrawnToday ? '今日已占卜' : '开启启示'}
                    </button>
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
