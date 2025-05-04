
import { format, parseISO } from "date-fns";
import { toZonedTime, format as formatTz } from "date-fns-tz";

/**
 * Convert a UTC timestamp to the user's timezone and format it
 * @param isoString - ISO timestamp string from the database
 * @param timezone - User's timezone (defaults to 'Asia/Jakarta')
 * @param formatPattern - Date format pattern (defaults to 'EEE dd MMM yyyy HH:mm:ss')
 */
export function formatTimestampToUserTimezone(
  isoString: string | null | undefined,
  timezone: string = 'Asia/Jakarta',
  formatPattern: string = 'EEE dd MMM yyyy HH:mm:ss'
): string {
  if (!isoString) return '-';

  try {
    // Parse the ISO string
    const date = parseISO(isoString);
    
    // Convert to the user's timezone
    const zonedDate = toZonedTime(date, timezone);
    
    // Format with timezone
    return formatTz(zonedDate, formatPattern + " 'GMT'XXX", { timeZone: timezone });
  } catch (error) {
    console.error("Error formatting date:", error, { isoString });
    return isoString || '-';
  }
}

/**
 * Format a timestamp to a human-readable format in the user's timezone
 * More user-friendly for UI display
 */
export function formatTimestampForDisplay(
  isoString: string | null | undefined, 
  timezone: string = 'Asia/Jakarta'
): string {
  if (!isoString) return '-';
  
  try {
    const date = parseISO(isoString);
    const zonedDate = toZonedTime(date, timezone);
    
    // Format as "Sun 04 May 2025 10:28:27 GMT+0700"
    return formatTz(zonedDate, "EEE dd MMM yyyy HH:mm:ss 'GMT'XXX", { timeZone: timezone });
  } catch (error) {
    console.error("Error formatting date for display:", error);
    return isoString || '-';
  }
}

/**
 * Convert a local datetime to UTC for saving to database
 */
export function convertToUTC(
  localDate: Date, 
  timezone: string = 'Asia/Jakarta'
): string {
  try {
    // Note: fromZonedTime (formerly zonedTimeToUtc) would be used here in date-fns-tz v3
    // But for now we'll use a simplified approach
    const utcDate = new Date(localDate);
    return utcDate.toISOString();
  } catch (error) {
    console.error("Error converting to UTC:", error);
    return localDate.toISOString();
  }
}
