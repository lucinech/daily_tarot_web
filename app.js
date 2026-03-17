const { useState } = React;
function App() {
    const [result, setResult] = useState("点击下方按钮感应牌意");
    const draw = () => {
        const cards = ["愚者", "魔术师", "女祭司", "皇后", "皇帝"];
        setResult("你抽到了：" + cards[Math.floor(Math.random() * cards.length)]);
    };
    return (
        <div className="text-center p-10 bg-slate-800 rounded-xl shadow-xl">
            <h1 className="text-2xl mb-6">🔮 每日一占</h1>
            <p className="text-xl text-yellow-400 mb-8">{result}</p>
            <button onClick={draw} className="bg-indigo-600 px-6 py-2 rounded-lg">抽取今日牌</button>
        </div>
    );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
