export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = pad(date.getFullYear() % 100);
  return `${day}/${month}/${year} ${pad(date.getHours())}:${pad(date.getMinutes())} น.`;
}
