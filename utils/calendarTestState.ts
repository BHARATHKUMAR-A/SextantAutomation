/**
 * Shared mutable state between CAL0101 and CAL0102 spec files.
 *
 * When the full suite runs sequentially (cal-setup project → firefox project),
 * both specs execute in the same Node.js worker process so module-level state
 * is preserved across files.
 *
 * CAL0101 writes weekCode after generating it in beforeEach.
 * CAL0102 reads weekCode to select that specific week type in the combo.
 */
export const calendarTestState: {
    weekCode: string;
} = {
    weekCode: '',
};
