export class Utils {
  constructor() {}

  static transformStringToDate (value) {
    const date = value.split(' ')[0];
    const time = value.split(' ')[1];

    const splitedDate = date.split('-').map((item) => +item)
    const splitedtime = time.split(':').map((item) => +item)

    return new Date(
      Date.UTC(
        splitedDate[0],
        splitedDate[1] - 1,
        splitedDate[2],
        splitedtime[0],
        splitedtime[1],
        splitedtime[2],
      ),
    )
  }
}
