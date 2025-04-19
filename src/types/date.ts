import dayjs from 'dayjs'

export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format('DD/MM/YYYY');
};

export const daysBetween = (startDate: string, endDate: string): number => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return end.diff(start, 'day');
};

export const isPastDate = (dateString: string): boolean => {
  return dayjs(dateString).isBefore(dayjs(), 'day');
};

export const calculateDelay = (deadlineDate: string): number => {
  if (!isPastDate(deadlineDate)) return 0;

  const deadline = dayjs(deadlineDate);
  const today = dayjs();
  return today.diff(deadline, 'day');
};

// Check if a date is within a given range
export const isDateInRange = (dateString: string, startDate: string, endDate: string): boolean => {
  const date = dayjs(dateString);
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  return date.isAfter(start) && date.isBefore(end);
};

// Format a date for input fields (YYYY-MM-DD)
export const formatForInput = (dateString: string): string => {
  return dayjs(dateString).format('YYYY-MM-DD');
};

// Get today's date in YYYY-MM-DD format
export const getTodayFormatted = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

// Get date from X days ago in YYYY-MM-DD format
export const getDaysAgoFormatted = (days: number): string => {
  return dayjs().subtract(days, 'day').format('YYYY-MM-DD');
};

// Get date X days from now in YYYY-MM-DD format
export const getDaysFromNowFormatted = (days: number): string => {
  return dayjs().add(days, 'day').format('YYYY-MM-DD');
};
