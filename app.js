const { useState, useEffect } = React;

function App() {
    const [card, setCard] = useState(null);
    const [data, setData] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    // 页面一加载，就去读取 JSON 文件
    useEffect(() => {
        fetch('cards_data.json')
            .then(res => res.json())
            .then(json => setData(json.major_arcana));
    }, []);

    const drawCard = () => {
        setIsDrawing(true);
        setTimeout(() => {
            const randomCard = data[Math.floor(Math.random() * data.length)];
            setCard(randomCard);
            setIsDrawing(false);
        }, 800);
    };

    return (
        <div className="text-center p-8 bg-slate-800/80 backdrop-blur rounded-2xl shadow-2xl border border-indigo-500/30 max-w-sm w-full">
            <h1 className="text-3xl font-serif mb-6 text-indigo-300">🔮 每日一占</h1>
            
            <div className="min-h-[160px] flex flex-col items-center justify-center mb-6">
                {isDrawing ? (
                    <div className="animate-spin text-4xl">⏳</div>
                ) : card ? (
                    <div className="animate-[fadeIn_0.5s]">
                        <h2 className="text-4xl font-bold text-yellow-400 mb-3">{card.name}</h2>
                        <div className="flex gap-2 justify-center flex-wrap">
                            {card.keywords.map(k => (
                                <span key={k} className="text-xs bg-indigo-900/50 px-2 py-1 rounded border border-indigo-400/30">{k}</span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-400 italic">静心，默想你的问题</p>
                )}
            </div>

            <button 
                onClick={drawCard}
                disabled={isDrawing || data.length === 0}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all active:scale-95 shadow-lg"
            >
                {card ? '再次启示' : '抽取今日牌'}
            </button>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
