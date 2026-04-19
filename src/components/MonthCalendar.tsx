import React, { useEffect, useRef, useState } from 'react';

interface MonthCalendarProps {
  year: number;
  month: number; // 0-11
  onClose?: () => void;
  inline?: boolean;
  events?: Record<string, Array<{ title?: string; time?: string; logoUrl?: string }>>;
}

const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthCalendar: React.FC<MonthCalendarProps> = ({ year, month, onClose, inline, events }) => {
  // build array of dates for the calendar grid
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const startDay = firstOfMonth.getDay();
  const daysInMonth = lastOfMonth.getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthName = firstOfMonth.toLocaleString(undefined, { month: 'long' });

  // Measure grid width and set fixed pixel column width to avoid browser auto-sizing differences
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [colWidth, setColWidth] = useState<number>(0);

  useEffect(() => {
    const update = () => {
      const el = gridRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const w = rect.width || el.clientWidth || 0;
      if (w > 0) {
        const styles = window.getComputedStyle(el);
        // column-gap may be reported as '8px' etc.
        const gap = parseFloat(styles.columnGap || styles.getPropertyValue('gap') || '0') || 0;
        const totalGap = gap * (7 - 1);
        const available = Math.max(0, w - totalGap);
        const col = Math.floor(available / 7);
        setColWidth(col);
      }
    };

    update();
    const ro = new ResizeObserver(update);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [year, month]);

  // If inline, render without backdrop/fixed positioning and without Close button
  if (inline) {
    return (
      <div className="w-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">{monthName} {year}</h3>
          <div className="text-sm text-muted-foreground">Calendar View</div>
        </div>

        <div
          ref={gridRef}
          className="grid gap-2 text-center w-full justify-items-stretch"
          style={colWidth > 0 ? { gridTemplateColumns: `repeat(7, ${colWidth}px)` } : { gridTemplateColumns: 'repeat(7, 1fr)' }}
        >
          {weekdayNames.map(w => (
            <div key={w} className="text-xs font-medium text-muted-foreground min-w-0">{w}</div>
          ))}

          {cells.map((d, i) => {
            const dateKey = d
              ? `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
              : null;
            const dayEvents = dateKey && events ? events[dateKey] : undefined;
            const firstEvent = dayEvents && dayEvents.length > 0 ? dayEvents[0] : undefined;
            return (
              <div key={i} className="p-2 rounded-md border border-border bg-background/30 flex flex-col items-start justify-start gap-2 w-full min-w-0 box-border">
                  {d ? (
                    <>
                      <div className="w-full flex items-start justify-between">
                        <div className="text-sm font-medium text-foreground">{d}</div>
                        <div className="text-xs text-muted-foreground">{firstEvent?.time ?? ''}</div>
                      </div>
                      {/* Event title below the date */}
                      <div className="w-full text-sm font-medium text-foreground min-h-[3rem] break-words">{firstEvent?.title ?? ''}</div>
                      
                      <div className="w-full text-xs text-muted-foreground">{dayEvents && dayEvents.length > 1 ? `+${dayEvents.length - 1} more` : ''}</div>
                    </>
                  ) : null}
                </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-2xl mx-auto bg-card border border-border rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{monthName} {year}</h3>
            <div className="text-sm text-muted-foreground">School year calendar view</div>
          </div>
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">Close</button>
        </div>

        <div
          ref={gridRef}
          className="grid gap-2 text-center w-full justify-items-stretch"
          style={colWidth > 0 ? { gridTemplateColumns: `repeat(7, ${colWidth}px)` } : { gridTemplateColumns: 'repeat(7, 1fr)' }}
        >
          {weekdayNames.map(w => (
            <div key={w} className="text-xs font-medium text-muted-foreground min-w-0">{w}</div>
          ))}

          {cells.map((d, i) => (
            <div key={i} className="p-2 rounded-md border border-border bg-background/30 flex flex-col items-start justify-start gap-2 w-full min-w-0 box-border">
              {d ? (
                <>
                  <div className="w-full flex items-start justify-between">
                    <div className="text-sm font-medium text-foreground">{d}</div>
                    <div className="text-xs text-muted-foreground"> </div>
                  </div>
                  <div className="w-full text-sm font-medium text-foreground min-h-[3rem] break-words">&nbsp;</div>
                  <div className="w-full flex items-center justify-center mt-1">
                    <div className="h-12 max-w-full rounded-sm bg-background/30 mx-auto" />
                  </div>
                  <div className="w-full text-xs text-muted-foreground">&nbsp;</div>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthCalendar;
