const { useState, useEffect } = React;

function App() {
    const [card, setCard] = useState(null);
    const [data, setData] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    // 页面加载时读取配置文件
    useEffect(() => {
        fetch('cards_data.json')
            .then(res => res.json())
            .then(json => {
                setData(json.major_arcana);
            })
            .catch(err => console.error("数据加载失败:", err));
    }, []);

    const drawCard = () => {
        setIsDrawing(true);
        setCard(null); // 开启抽牌动画时先清空画面
        
        setTimeout(() => {
            const index = Math.floor(Math.random() * data.length);
            const randomCard = data[index];
            const isUpright = Math.random() > 0.5;
            
            // 使用最稳定的占位图源，确保 100% 显示成功
            // lock=${index} 确保每张牌对应的图片是固定且唯一的
            const imageUrl = `https://loremflickr.com/320/480/tarot,magic,mythology/all?lock=${index}`;
            
            setCard({ ...randomCard, isUpright, imageUrl });
            setIsDrawing(false);
        }, 1200); // 1.2秒的感应时间
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-sm mx-auto p-8 bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 text-white">
            {/* 顶部标题 */}
            <h1 className="text-3xl font-serif mb-8 tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-indigo-200 to-indigo-400 font-bold">
                🔮 每日一占
            </h1>

            {/* 卡牌展示区 */}
            <div className="relative w-full flex flex-col items-center justify-center mb-8 min-h-[380px]">
                {isDrawing ? (
                    <div className="flex flex-col items-center animate-pulse">
                        <div className="w-44 h-72 bg-slate-800 rounded-2xl border-2 border-dashed border-indigo-500/30 flex items-center justify-center mb-4">
                            <span className="text-5xl animate-spin-slow">⏳</span>
                        </div>
                        <p className="text-indigo-300 font-light tracking-widest text-sm">正在感应能量...</p>
                    </div>
                ) : card ? (
                    <div className="w-full animate-[fadeIn_0.6s_ease-out] text-center">
                        {/* 牌面图片：带正逆位旋转逻辑 */}
                        <div className="relative mb-6 flex justify-center group">
                            <img 
                                src={card.imageUrl} 
                                alt={card.name}
                                className={`w-44 h-72 object-cover rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] border border-white/20 transition-transform duration-1000 ease-in-out ${card.isUpright ? '' : 'rotate-180'}`}
                            />
                            <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none"></div>
                        </div>

                        {/* 牌名与位向 */}
                        <h2 className="text-4xl font-bold text-yellow-400 mb-4 drop-shadow-md">
                            {card.name}
                            <span className={`text-base ml-3 font-normal py-1 px-3 rounded-md bg-white/10 ${card.isUpright ? 'text-indigo-200' : 'text-purple-300'}`}>
                                {card.isUpright ? '正位' : '逆位'}
                            </span>
                        </h2>

                        {/* 关键词标签 */}
                        <div className="flex gap-2 justify-center flex-wrap px-2">
                            {card.keywords.map(k => (
                                <span key={k} className="text-xs font-light bg-indigo-500/10 text-indigo-200 px-3 py-1.5 rounded-full border border-indigo-400/20 shadow-sm">
                                    {k}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center animate-fade-in">
                        <p className="text-slate-400 italic text-lg leading-relaxed">
                            静心，默想你的问题<br/>
                            <span className="text-sm opacity-60 mt-2 block">— 准备好后开启启示 —</span>
                        </p>
                    </div>
                )}
            </div>

            {/* 操作按钮 */}
            <button 
                onClick={drawCard}
                disabled={isDrawing || data.length === 0}
                className="group relative w-full py-4 overflow-hidden rounded-2xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 group-hover:opacity-90 transition-opacity"></div>
                <span className="relative z-10 tracking-widest">
                    {card ? '再次启示' : '抽取今日牌'}
                </span>
            </button>
        </div>
    );
}

// 渲染到页面
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
