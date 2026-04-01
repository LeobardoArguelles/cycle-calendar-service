function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfWeekMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildCycleData({ cycle_start, cycle_length = 28, period_length = 5 }) {
  const cycleStart = new Date(`${cycle_start}T12:00:00`);

  if (Number.isNaN(cycleStart.getTime())) {
    throw new Error("cycle_start must be a valid date like 2026-03-27");
  }

  const cycleLength = Number(cycle_length);
  const periodLength = Number(period_length);

  const ovulationDate = addDays(cycleStart, cycleLength - 14);
  const fertileStart = addDays(ovulationDate, -5);
  const fertileEnd = ovulationDate;

  const markedDays = new Map();

  for (let i = 0; i < periodLength; i++) {
    markedDays.set(formatDate(addDays(cycleStart, i)), "menstruation");
  }

  for (let i = 0; i <= 5; i++) {
    const key = formatDate(addDays(fertileStart, i));
    if (!markedDays.has(key)) markedDays.set(key, "fertile");
  }

  markedDays.set(formatDate(ovulationDate), "ovulation");

  const rangeStart = startOfWeekMonday(addDays(cycleStart, -3));
  const totalDays = 42;

  const days = [];
  for (let i = 0; i < totalDays; i++) {
    const date = addDays(rangeStart, i);
    const key = formatDate(date);
    days.push({
      date: key,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      type: markedDays.get(key) || "normal",
    });
  }

  return {
    cycle_start,
    cycle_length: cycleLength,
    period_length: periodLength,
    ovulation_date: formatDate(ovulationDate),
    fertile_start: formatDate(fertileStart),
    fertile_end: formatDate(fertileEnd),
    period_end: formatDate(addDays(cycleStart, periodLength - 1)),
    range_start: formatDate(rangeStart),
    days,
  };
}

module.exports = {
  buildCycleData,
};
