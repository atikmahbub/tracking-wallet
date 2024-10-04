import { getHours } from "date-fns";

/**
 * Returns a greeting based on the current time.
 * @returns {string} The greeting ("Good Morning", "Good Afternoon", "Good Evening").
 */
export const getGreeting = (): string => {
  const currentHour = getHours(new Date());

  if (currentHour < 12) {
    return "Good Morning";
  } else if (currentHour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};
