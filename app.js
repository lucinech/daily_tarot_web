const { useState, useEffect } = React;

function App() {
    const [view, setView] = useState('draw'); 
    const [card, setCard] = useState(null);
    const [data, setData] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('tarot_history') || '{}'));
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // 获取今天的日期字符串 (YYYY-MM-DD)
    const getTodayStr = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetch('cards_data.json')
            .then(res => res.json())
            .then(json => {
                setData(json.major_arcana);
                // 初始化检查：如果今天已经抽过，直接显示结果
                const today = getTodayStr();
                if (history[today]) {
                    const record = history[today];
                    setCard({ ...json.major_arcana[record.index], isUpright: record.isUpright, imageUrl: `images/${record.index}.jpg` });
                }
            });
    }, []);

    const drawCard = () => {
        const today = getTodayStr();
        // 二次校验，防止通过控制台等手段重复触发
        if (history[today]) return;

        setIsDrawing(true);
        setTimeout(() => {
            const index = Math.floor(Math.random() * data.length);
            const isUpright = Math.random() > 0.5;
            
            const newResult = { index, isUpright, name: data[index].name, time: new Date().getTime() };
            const newHistory = { ...history, [today]: newResult };
            
            setHistory(newHistory);
            localStorage.setItem('tarot_history', JSON.stringify(newHistory));
            
            setCard({ ...data[index], isUpright, imageUrl: `images/${index}.jpg` });
            setIsDrawing(false);
        }, 1200);
    };

    // 日历逻辑 (保持不变)
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        return { firstDay, totalDays, year, month };
    };

    const renderCalendar = () => {
        const { firstDay, totalDays, year, month } = getDaysInMonth(currentMonth);
        const cells = [];
        for (let i = 0; i < firstDay; i++) cells.push(<div key={`empty-${i}`} className="h-24 opacity-0"></div>);
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = history[dateStr];
            const isToday = dateStr === getTodayStr();
            cells.push(
                <div key={day} className={`relative h-28 border ${isToday ? 'border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'border-white/5'} rounded-xl overflow-hidden bg-slate-900/50`}>
                    <span className={`absolute top-1 left-2 text-[10px] z-10 ${isToday ? 'text-indigo-400 font-bold' : 'text-white/20'}`}>{day}</span>
                    {record ? (
                        <div className="w-full h-full animate-[fadeIn_0.5s]">
                            <img src={`images/${record.index}.jpg`} className={`w-full h-full object-cover opacity-60 ${record.isUpright ? '' : 'rotate-180'}`} />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-6 h-10 border border-white/5 rounded-[2px] opacity-10"></div>
                        </div>
                    )}
                </div>
            );
        }
        return cells;
    };

    const hasDrawnToday = !!history[getTodayStr()];

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col items-center">
            {/* 顶部 Tab 切换 */}
            <div className="fixed top-6 z-50 flex bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-xl">
                <button onClick={() => setView('draw')} className={`px-8 py-2 rounded-xl transition-all ${view === 'draw' ? 'bg-indigo-600 shadow-lg' : 'text-white/40'}`}>今日启示</button>
                <button onClick={() => setView('calendar
