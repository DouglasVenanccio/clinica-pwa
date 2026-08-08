import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function Calendar({ selectedDate, onSelect }) {
  const today = new Date();
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedStr = selectedDate
    ? `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`
    : null;

  const isPast = (d) => {
    const date = new Date(year, month, d);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < t;
  };

  const goPrev = () => setView(new Date(year, month - 1, 1));
  const goNext = () => setView(new Date(year, month + 1, 1));

  return (
    <div className="bg-white border border-[#E0DCD6] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <button onClick={goPrev} className="w-8 h-8 rounded-full hover:bg-[#F5EFE6] flex items-center justify-center text-[#2b2622]/60">
          <ChevronLeft size={18} />
        </button>
        <span className="font-display font-semibold text-[#2b2622]">
          {MONTHS[month]} {year}
        </span>
        <button onClick={goNext} className="w-8 h-8 rounded-full hover:bg-[#F5EFE6] flex items-center justify-center text-[#2b2622]/60">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="text-center text-[11px] text-[#2b2622]/40 font-medium py-1">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const date = new Date(year, month, d);
          const str = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          const isSelected = str === selectedStr;
          const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const disabled = isPast(d);
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => onSelect(date)}
              className={`h-9 rounded-full text-sm transition-all relative ${
                isSelected
                  ? 'bg-[#B67D35] text-white font-semibold shadow-[0_0_0_4px_rgba(182,125,53,0.15)]'
                  : disabled
                  ? 'text-[#2b2622]/20 cursor-not-allowed'
                  : 'text-[#2b2622]/80 hover:bg-[#F5EFE6]'
              }`}
            >
              {d}
              {isToday && !isSelected && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B67D35]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}