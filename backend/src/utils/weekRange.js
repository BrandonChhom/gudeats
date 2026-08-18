// codeProjects/gudeats/backend/src/utils/weekRange.js

// Returns the [start, end) boundaries of the current calendar week in UTC,
// where the week starts on Monday 00:00:00 UTC.
const getCurrentWeekRange = (referenceDate = new Date()) => {
  const dateOnly = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
    ),
  );

  const dayOfWeek = dateOnly.getUTCDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const start = new Date(dateOnly);
  start.setUTCDate(dateOnly.getUTCDate() - daysSinceMonday);

  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 7);

  return { start, end };
};

export default getCurrentWeekRange;
