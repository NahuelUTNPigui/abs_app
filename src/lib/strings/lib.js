export default function emptyString(cadena){
    return (!cadena || cadena.length === 0 );
}
export function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}