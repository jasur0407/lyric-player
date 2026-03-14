export function numberToFormat(num : number) {
    return `${String(Math.floor(num/60)).padStart(2, "0")}:${String(Math.floor(num % 60)).padStart(2, "0")}`
}