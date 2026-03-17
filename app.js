const { useState, useEffect } = React;

function App() {
    const [card, setCard] = useState(null);
    const [data, setData] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        fetch('cards_data.json')
            .then(res => res.json())
            .then(json => setData(json.major_arcana));
    }, []);

    const drawCard = () => {
        setIsDrawing(true);
        setCard(null);
        setTimeout(() => {
            const index = Math.floor(Math.random() * data.length);
            const randomCard = data[index];
            const isUpright = Math.random() > 0.5;
            const imageUrl = `images/${index}.jpg`; 
            setCard({ ...randomCard, isUpright, imageUrl, index });
            setIsDrawing(false);
        }, 1200);
    };

    return (
        // 这里的 w-[92%] 保证了手机两侧有呼吸感，max-w-md 保证电脑上不会太宽
        <div className="flex flex-col items-center justify-center min-h-[550px] w-[92%] max-w-md mx-auto my-8 p-6 md:p-8 bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/10 text-white">
            <h1 className="text-2xl md:text-3xl font-serif mb-6 tracking-widest text-indigo-200">🔮 每日一占</h1>

            <div className="relative w-full flex flex-col items-center justify-center mb-8 min-h-[420px]">
                {isDrawing ? (
                    <div className="flex flex-col items-center animate-pulse">
                        <div className="w-48 h-80 bg-indigo-500/10 rounded-2xl border border-indigo-500/30 flex items-center justify-center">
                            <span className="text-5xl">✨</span>
                        </div>
                    </div>
                ) : card ? (
                    <div className="w-full animate-[fadeIn_0.5s]">
                        <div className="relative mb-6 flex justify-center">
                            <div className="w-48 h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-800">
                                <img 
                                    src={card.imageUrl} 
                                    alt={card.name}
                                    className={`w-full h-full object-cover transition-transform duration-1000 ${card.isUpright ? '' : 'rotate-180'}`}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="hidden absolute inset-0 items-center justify-center text-4xl bg-indigo-900/50">{card.index}</div>
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
                            {card.name}
                            <span className="text-sm ml-2 font-normal px-2 py-1 bg-white/10 rounded uppercase">
                                {card.isUpright ? '正位' : '逆位'}
                            </span>
                        </h2>

                        <div className="flex gap-2 justify-center flex-wrap px-2">
                            {card.keywords.map(k => (
                                <span key={k} className="text-xs bg-indigo-500/20 px-3 py-1.5 rounded-full border border-indigo-400/20 text-indigo-100">
                                    {k}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-400 italic text-lg">静心，默想你的问题</p>
                    </div>
                )}
            </div>

            <button 
                onClick={drawCard} 
                disabled={isDrawing} 
                className="w-full py-4 md:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-bold text-lg active:scale-95 transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-50"
            >
                {card ? '再次启示' : '抽取今日牌'}
            </button>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
