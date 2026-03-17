const { useState, useEffect } = React;

function App() {
    const [card, setCard] = useState(null);
    const [data, setData] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    // 初始化加载数据
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
        setCard(null); // 抽牌前先清空，增加仪式感
        
        setTimeout(() => {
            const index = Math.floor(Math.random() * data.length);
            const randomCard = data[index];
            const isUpright = Math.random() > 0.5;
            
            // 指向你仓库中 images 文件夹下的图片
            // 确保图片命名为 0.jpg, 1.jpg ... 21.jpg
            const imageUrl = `images/${index}.jpg`;
            
            setCard({ ...randomCard, isUpright, imageUrl, index });
            setIsDrawing(false);
        }, 1200);
    };

    return (
        // 外部容器：min-h-screen 确保铺满手机高度，p-4 留出微小边距
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4">
            
            {/* 主卡片容器：w-full 配合 max-w-md (大屏限制) 和 95% 的移动端占比 */}
            <div className="flex flex-col items-center justify-between w-full max-w-md aspect-[9/16] max-h-[90vh] p-8 bg-slate-900/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10 text-white relative overflow-hidden">
                
                {/* 顶部标题 */}
                <h1 className="text-2xl font-serif tracking-[0.2em] text-indigo-200 mt-2">🔮 每日一占</h1>

                {/* 内容核心区 */}
                <div className="flex-1 w-full flex flex-col items-center justify-center my-6">
                    {isDrawing ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <div className="w-56 h-96 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 flex items-center justify-center shadow-inner">
                                <span className="text-6xl animate-spin-slow">✨</span>
                            </div>
                            <p className="mt-6 text-indigo-300 tracking-widest font-light text-sm">正在读取星象...</p>
                        </div>
                    ) : card ? (
                        <div className="w-full animate-[fadeIn_0.6s_ease-out] flex flex-col items-center">
                            {/* 卡牌图片 */}
                            <div className="relative mb-8 group">
                                <div className="w-56 h-96 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.2)] border border-white/20 bg-slate-800">
                                    <img 
                                        src={card.imageUrl} 
                                        alt={card.name}
                                        className={`w-full h-full object-cover transition-transform duration-1000 ease-in-out ${card.isUpright ? '' : 'rotate-180'}`}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    {/* 图片加载失败时的占位数字 */}
                                    <div className="hidden absolute inset-0 items-center justify-center text-7xl font-bold bg-indigo-950/80 text-white/20">
                                        {card.index}
                                    </div>
                                </div>
                                {/* 图片外发光装饰 */}
                                <div className="absolute -inset-2 rounded-[2rem] border border-indigo-500/10 pointer-events-none"></div>
                            </div>

                            {/* 牌名信息 */}
                            <div className="text-center">
                                <h2 className="text-4xl font-bold text-yellow-400 mb-3 drop-shadow-lg tracking-wider">
                                    {card.name}
                                </h2>
                                <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-200 text-sm font-light mb-6">
                                    {card.isUpright ? '✦ 正位 ✦' : '✦ 逆位 ✦'}
                                </div>
                            </div>

                            {/* 关键词 */}
                            <div className="flex gap-2 justify-center flex-wrap max-w-[280px]">
                                {card.keywords.map(k => (
                                    <span key={k} className="text-xs font-light bg-indigo-500/10 text-indigo-100 px-3 py-1.5 rounded-full border border-indigo-400/20">
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 animate-fade-in">
                            <p className="text-slate-400 italic text-lg leading-relaxed px-10">
                                深呼吸，闭上眼<br/>
                                默想你当下的困惑<br/>
                                <span className="text-xs opacity-40 mt-4 block tracking-[0.3em]">— 点击下方开启 —</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* 操作按钮：始终在底部 */}
                <button 
                    onClick={drawCard} 
                    disabled={isDrawing || data.length === 0}
                    className="group relative w-full py-5 overflow-hidden rounded-2xl font-bold text-xl transition-all active:scale-95 disabled:opacity-50"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 group-hover:brightness-110 transition-all"></div>
                    <span className="relative z-10 tracking-[0.2em] text-white">
                        {card ? '再次感应' : '抽取今日启示'}
                    </span>
                </button>

            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
