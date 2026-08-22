interface DayHours {
  open: string;
  close: string;
}

// Keyed by Date.getDay(): 0 = Sunday ... 6 = Saturday. null = closed all day.
// Bank holidays follow Sunday hours, but we can't detect bank holidays from
// the date alone, so that part isn't modelled here.
const OPENING_HOURS: Record<number, DayHours | null> = {
  0: { open: '17:00', close: '22:30' },
  1: null,
  2: { open: '17:00', close: '23:00' },
  3: { open: '17:00', close: '23:00' },
  4: { open: '17:00', close: '23:00' },
  5: { open: '17:00', close: '23:00' },
  6: { open: '17:00', close: '23:00' },
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'pm' : 'am';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}${period}` : `${hour12}:${String(m).padStart(2, '0')}${period}`;
}

export interface OpenStatusResult {
  isOpen: boolean;
  label: string;
}

export function getOpenStatus(now: Date = new Date()): OpenStatusResult {
  const day = now.getDay();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const today = OPENING_HOURS[day];

  if (today) {
    const openMinutes = toMinutes(today.open);
    const closeMinutes = toMinutes(today.close);

    if (nowMinutes >= openMinutes && nowMinutes < closeMinutes) {
      return { isOpen: true, label: `Open now · until ${formatTime(today.close)}` };
    }
    if (nowMinutes < openMinutes) {
      return { isOpen: false, label: `Closed · opens today at ${formatTime(today.open)}` };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const nextDay = (day + i) % 7;
    const nextHours = OPENING_HOURS[nextDay];
    if (nextHours) {
      const dayLabel = i === 1 ? 'tomorrow' : DAY_NAMES[nextDay];
      return { isOpen: false, label: `Closed · opens ${dayLabel} at ${formatTime(nextHours.open)}` };
    }
  }

  return { isOpen: false, label: 'Closed' };
}
