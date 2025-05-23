const formatMap: Record<string, Intl.DateTimeFormatOptions> = {
    'd MMM yyyy':   { day: 'numeric', month: 'short', year: 'numeric' },
    'MMMM yyyy':    { month: 'long',   year: 'numeric' },
    'EEEE':         { weekday: 'long' },
    'EEE':          { weekday: 'short' },
    'dd':           { day: '2-digit' },
    'd':            { day: 'numeric' },
    'MMMM':         { month: 'long' },
    'MMM':          { month: 'short' },
    'MM':           { month: '2-digit' },
    'M':            { month: 'numeric' },
    'yyyy':         { year: 'numeric' },
    'yy':           { year: '2-digit' },
    'HH':           { hour: '2-digit', hour12: false },
    'H':            { hour: 'numeric', hour12: false },
    'hh':           { hour: '2-digit', hour12: true },
    'h':            { hour: 'numeric', hour12: true },
    'mm':           { minute: '2-digit' },
    'm':            { minute: 'numeric' },
    'ss':           { second: '2-digit' },
    's':            { second: 'numeric' },
    'a':            { hour: 'numeric', hour12: true }, 
    'A':            { hour: 'numeric', hour12: true }
  };
  
  export function formatDate(date: Date, formatStr: string): string {
    if (formatStr === 'MMMM d, yyyy') {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day:   'numeric',
        year:  'numeric'
      });
    }
  
    if (formatStr === 'd MMM yyyy') {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    
    if (formatStr === 'd MMMM yyyy') {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (formatStr === 'MMMM yyyy') {
      return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    }
  
    const opts = formatMap[formatStr];
    if (opts) {
      const locale = (formatStr === 'a' || formatStr === 'A') ? 'en-US' : 'en-GB';
      const formatter = new Intl.DateTimeFormat(locale, opts);
  
      if (formatStr === 'a' || formatStr === 'A') {
        const part = formatter.formatToParts(date).find(p => p.type === 'dayPeriod');
        if (part) {
          return formatStr === 'A' ? part.value.toUpperCase() : part.value.toLowerCase();
        }
      }
  
      return formatter.format(date);
    }
  
    return date.toLocaleDateString('en-GB');
  }
  
  /**
   * Format Title event includes date
   * @param event The event object that must have title and date
   * @returns String with the format "Title of the event (d MMM yyyy)"
   */
  export function formatEventTitleWithDate(event: { title: string; date?: Date | string | null }): string {
    if (!event.date) return event.title;
  
    const date = typeof event.date === 'string' ? new Date(event.date) : event.date;
    const formattedDate = formatDate(date, 'd MMM yyyy');
  
    return `${event.title} (${formattedDate})`;
  }

  export function parseDate(dateString: string, formatStr: string, referenceDate: Date = new Date()): Date {
    if (formatStr === 'dd/MM/yyyy') {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(referenceDate);
  }
  
  export function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }
  
  export function getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  
  export function addDays(date: Date, days: number): Date {
    const r = new Date(date);
    r.setDate(r.getDate() + days);
    return r;
  }
  
  export function addWeeks(date: Date, weeks: number): Date {
    return addDays(date, weeks * 7);
  }
  
  export function addMonths(date: Date, months: number): Date {
    const r = new Date(date);
    r.setMonth(r.getMonth() + months);
    return r;
  }
  
  export function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate()
        && date1.getMonth() === date2.getMonth()
        && date1.getFullYear() === date2.getFullYear();
  }

  export function isSameWeek(date1: Date, date2: Date, options: { weekStartsOn: number } = { weekStartsOn: 1 }): boolean {
    const day1 = date1.getDay();
    const day2 = date2.getDay();
    const diff = day1 - day2;
    const weekStartsOn = options.weekStartsOn || 1;
    const normalizedDiff = ((diff + 7) % 7) + weekStartsOn;
    return normalizedDiff === 0;
  }
  
  export function isSameMonth(date1: Date, date2: Date): boolean {
    return date1.getMonth() === date2.getMonth()
        && date1.getFullYear() === date2.getFullYear();
  }
  
  export function getCalendarDays(
    year: number,
    month: number,
    selectedDate: Date = new Date()
  ): Array<{ date: Date; day: number; isCurrentMonth: boolean; isToday: boolean; isSelected: boolean }> {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let firstDow = firstDay.getDay() || 7;
    firstDow = firstDow === 0 ? 7 : firstDow;
    const daysToSubtract = firstDow - 1;
    const today = new Date();
  
    
    for (let i = daysToSubtract; i > 0; i--) {
      const d = new Date(year, month, -i + 1);
      days.push({
        date: d,
        day: d.getDate(),
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
        isSelected: isSameDay(d, selectedDate)
      });
    }
   
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const cd = new Date(year, month, d);
      days.push({
        date: cd,
        day: d,
        isCurrentMonth: true,
        isToday: isSameDay(cd, today),
        isSelected: isSameDay(cd, selectedDate)
      });
    }
    const daysToAdd = 42 - days.length;
    for (let i = 1; i <= daysToAdd; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        day: d.getDate(),
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
        isSelected: isSameDay(d, selectedDate)
      });
    }
    return days;
  }
  

  