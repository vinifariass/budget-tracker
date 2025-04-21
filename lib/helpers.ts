export function DateToUTCTDate(date: Date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getHours(), date.getMinutes(), date.getSeconds(),date.getMilliseconds()))
}