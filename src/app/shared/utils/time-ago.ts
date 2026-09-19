export const timeAgo = (timestamp: Date, locale = 'en'): string => {
  const diff = (new Date().getTime() - timestamp.getTime()) / 1000;
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (years > 0) {
    return rtf.format(0 - years, 'year');
  } else if (months > 0) {
    return rtf.format(0 - months, 'month');
  } else if (days > 0) {
    return rtf.format(0 - days, 'day');
  } else if (hours > 0) {
    return rtf.format(0 - hours, 'hour');
  } else {
    return rtf.format(0 - minutes, 'minute');
  }
};
