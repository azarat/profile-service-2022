export class Utils {
  constructor() {}

  static transformStringToDate (value) {
    const PM = {
      1: 13,
      2: 14,
      3: 15,
      4: 16,
      5: 17,
      6: 18,
      7: 19,
      8: 20,
      9: 21,
      10: 22,
      11: 23,
      12: 0,
    }
    const splitedDate = value.split('.').map((item) => +item)
    const now = new Date()
      .toLocaleString('en-US', { timeZone: 'Europe/Kiev' })
      .split(' ')
    const halfOfDay = now[2]
    const time = now[1].split(':').map((item) => +item)

    return new Date(
      Date.UTC(
        splitedDate[2],
        splitedDate[1] - 1,
        splitedDate[0],
        halfOfDay === 'PM' ? PM[time[0]] : time[0],
        time[1],
        time[2],
      ),
    )
  }
}
