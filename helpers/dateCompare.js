import { DateTime } from 'luxon';
export const dateCompare = {
    isDateBefore,
    withinNextWeek,
    beyondNextWeek,
};
function isDateBefore(dateA, dateB) {
    const a = DateTime.fromISO(dateA);
    const b = DateTime.fromISO(dateB);
    return a < b;
}
function withinNextWeek(date) {
    const d = DateTime.fromISO(date);
    const diffInDays = d.diffNow('days').days + 1;
    if (0 <= diffInDays && diffInDays <= 7) {
        return true;
    }
    return false;
}
function beyondNextWeek(date) {
    const d = DateTime.fromISO(date);
    const diffInDays = d.diffNow('days').days;
    if (diffInDays > 7) {
        return true;
    }
    return false;
}
//# sourceMappingURL=dateCompare.js.map