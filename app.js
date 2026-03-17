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
            // 修正路径：确保是从根目录的 images 文件夹读取
            const imageUrl = `./images/${index}.jpg`;
            setCard({ ...randomCard, isUpright, imageUrl, index });
            setIsDrawing(false);
        }, 1200);
    };

    return (
        // 外层强制占满全屏，去除所有不必要的边距
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-4">
            
            {/* 主容器：利用 h-full 和 max-h 确保在不同手机上都能优雅展示 */}
            <div className="w-full max-w-[450px] h-[92vh] flex flex-col justify-between items-center p-6 sm:p-10 bg-slate-900/80 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] text-white relative">
                
                {/* 1. 顶部标题区 */}
                <div className="text-center pt-2">
                    <h1 className="text-2xl sm:text-3xl font-serif tracking-[0.3em] text-indigo-200 opacity-90">🔮 每日一占</h1>
                </div>

                {/* 2. 核心展示区 (自动伸缩) */}
                <div className="flex-1 w-full flex flex-col items-center justify-center">
                    {isDrawing ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <div className="w-52 h-80 sm:w-60 sm:h-96 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 flex items-center justify-center shadow-inner">
                                <span className="text-5xl animate-spin-slow text-indigo-400">✨</span>
                            </div>
                            <p className="mt-8 text-indigo-300/60 tracking-[0.4em] text-xs uppercase">Connecting to Stars...</p>
                        </div>
                    ) : card ? (
                        <div className="w-full animate-[fadeIn_0.8s_ease-out] flex flex-col items-center">
                            {/* 卡牌容器 */}
                            <div className="relative mb-8 group">
                                <div className="w-52 h-80 sm:w-60 sm:h-96 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.25)] border border-white/20 bg-slate-800 flex items-center justify-center">
                                    <img 
                                        src={card.imageUrl} 
                                        className={`w-full h-full object-cover transition-transform duration-1000 ease-in-out ${card.isUpright ? '' : 'rotate-180'}`}
                                        onError={(e) => {
                                            // 如果图片加载失败，显示更美观的文字占位
                                            e.target.className = "hidden";
                                            e.target.nextSibling.className = "flex items-center justify-center text-8xl font-black text-white/5 italic";
                                        }}
                                    />
                                    <div className="hidden">{card.index}</div>
                                </div>
                                {/* 装饰性发光底座 */}
                                <div className="absolute -bottom-4 w-1/2 h-1 bg-indigo-500/20 blur-xl mx-auto inset-x-0"></div>
                            </div>

                            {/* 信息文本 */}
                            <div className="text-center space-y-3">
                                <h2 className="text-4xl sm:text-5xl font-bold text-yellow-400 tracking-tight drop-shadow-2xl">
                                    {card.name}
                                </h2>
                                <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-white/5 border border-white/10">
                                    <span className={`w-2 h-2 rounded-full ${card.isUpright ? 'bg-emerald-400' : 'bg-purple-400'} animate-pulse`}></span>
                                    <span className="text-indigo-100 text-sm font-light tracking-widest">
                                        {card.isUpright ? '正位 · UPRIGHT' : '逆位 · REVERSED'}
                                    </span>
                                </div>
                                <div className="flex gap-2 justify-center flex-wrap pt-2 px-4">
                                    {card.keywords.map(k => (
                                        <span key={k} className="text-[10px] sm:text-xs font-light tracking-wider bg-indigo-500/10 text-indigo-200/80 px-3 py-1 rounded-full border border-indigo-500/10 uppercase">
                                            {k}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4 px-6">
                            <p className="text-slate-400 italic text-lg font-serif">"Fate is in your hands."</p>
                            <p className="text-slate-500 text-sm tracking-widest font-light leading-relaxed">请在心中默想你的问题<br/>然后触碰下方的启示按钮</p>
                        </div>
                    )}
                </div>

                {/* 3. 底部操作区 */}
                <div className="w-full pb-2">
                    <button 
                        onClick={drawCard} 
                        disabled={isDrawing || data.length === 0}
                        className="group relative w-full h-16 overflow-hidden rounded-3xl font-bold text-lg tracking-[0.3em] transition-all active:scale-[0.98] disabled:opacity-30"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 group-hover:brightness-125 transition-all"></div>
                        <span className="relative z-10 text-white drop-shadow-md">
                            {card ? 'RE-REVEAL' : 'REVEAL CARD'}
                        </span>
                    </button>
                </div>

            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
