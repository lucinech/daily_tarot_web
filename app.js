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
        setCard(null); // 抽牌时先清空上一张，增加仪式感
        setTimeout(() => {
            const index = Math.floor(Math.random() * data.length);
            const randomCard = data[index];
            const isUpright = Math.random() > 0.5;
          // 换用维基百科的开源维特塔罗图源（更稳，文件名对应牌名）
            const wikiFiles = [
                "RWS_Tarot_00_Fool", "RWS_Tarot_01_Magician", "RWS_Tarot_02_High_Priestess",
                "RWS_Tarot_03_Empress", "RWS_Tarot_04_Emperor", "RWS_Tarot_05_Hierophant",
                "RWS_Tarot_06_Lovers", "RWS_Tarot_07_Chariot", "RWS_Tarot_08_Strength",
                "RWS_Tarot_09_Hermit", "RWS_Tarot_10_Wheel_of_Fortune", "RWS_Tarot_11_Justice",
                "RWS_Tarot_12_Hanged_Man", "RWS_Tarot_13_Death", "RWS_Tarot_14_Temperance",
                "RWS_Tarot_15_Devil", "RWS_Tarot_16_Tower", "RWS_Tarot_17_Star",
                "RWS_Tarot_18_Moon", "RWS_Tarot_19_Sun", "RWS_Tarot_20_Judgement",
                "RWS_Tarot_21_World"
            ];
            const imageUrl = `https://raw.githubusercontent.com/mitchblank/fabulist/master/data/tarot/images/${wikiFiles[index]}.jpg`;
            
            setCard({ ...randomCard, isUpright, imageUrl });
            setIsDrawing(false);
        }, 1200);
    };
    return (
        <div className="text-center p-8 bg-slate-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-indigo-500/20 max-w-sm w-full mx-auto">
            <h1 className="text-3xl font-serif mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">🔮 每日一占</h1>
            
            <div className="min-h-[400px] flex flex-col items-center justify-center mb-6">
                {isDrawing ? (
                    <div className="flex flex-col items-center animate-pulse">
                        <div className="w-40 h-64 bg-slate-700 rounded-xl mb-4 border-2 border-dashed border-indigo-400/30 flex items-center justify-center">
                            <span className="text-4xl">⏳</span>
                        </div>
                        <p className="text-indigo-300">正在感应你的能量...</p>
                    </div>
                ) : card ? (
                    <div className="animate-[fadeIn_0.8s] w-full">
                        <div className="relative mb-6 flex justify-center">
                            <img 
                                src={card.imageUrl} 
                                alt={card.name}
                                className={`w-40 h-64 object-cover rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] border-2 border-indigo-500/30 transition-transform duration-1000 ${card.isUpright ? '' : 'rotate-180'}`}
                            />
                        </div>
                        <h2 className="text-4xl font-bold text-yellow-400 mb-3">
                            {card.name}
                            <span className="text-lg ml-2 font-normal text-indigo-200">
                                {card.isUpright ? '· 正位' : '· 逆位'}
                            </span>
                        </h2>
                        <div className="flex gap-2 justify-center flex-wrap">
                            {card.keywords.map(k => (
                                <span key={k} className="text-xs bg-indigo-500/20 text-indigo-200 px-3 py-1 rounded-full border border-indigo-400/20">{k}</span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-20">
                        <p className="text-slate-400 italic text-lg">闭上眼，默想你的问题<br/>准备好后点击下方按钮</p>
                    </div>
                )}
            </div>

            <button 
                onClick={drawCard}
                disabled={isDrawing || data.length === 0}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-indigo-900/20 disabled:opacity-50"
            >
                {card ? '再次启示' : '抽取今日牌'}
            </button>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
