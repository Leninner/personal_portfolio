export class DateUtils {
  static normalize(date = 'Sat, 25 Mar 2023 03:41:36 GMT'): string {
    const [, dayNumber, month, year] = date.split(' ')

    return `${dayNumber} ${month} ${year}`
  }
}
