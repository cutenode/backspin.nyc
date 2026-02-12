import { DateTime } from 'luxon';

export const dateCompare = {
	isDateBefore,
	isDateWithinOneWeek,
	isDateAfterOneWeek,
};

function isDateBefore(dateA: string, dateB: string): boolean {
	const a = DateTime.fromISO(dateA);
	const b = DateTime.fromISO(dateB);
	return a < b;
}

function isDateWithinOneWeek(date: string): boolean {
	const d = DateTime.fromISO(date);
	const diffInDays = d.diffNow('days').days + 1;

	if (0 <= diffInDays && diffInDays <= 7) {
		return true;
	}

	return false;
}

function isDateAfterOneWeek(date: string): boolean {
	const d = DateTime.fromISO(date);
	const diffInDays = d.diffNow('days').days;

	if (diffInDays > 7) {
		return true;
	}

	return false
}