export class Utils {
  constructor() {}

  static transformStringToDate (value) {
    const date = value.split(' ')[0];
    const time = value.split(' ')[1];

    const splitedDate = date.split('-').map((item) => +item)
    const splitedtime = time.split(':').map((item) => +item)

    let year = splitedDate[0]
    let dayOfMonth = splitedDate[2]
  
    if (splitedDate[2].toString().length == 4) {
      year = splitedDate[2]
      dayOfMonth = splitedDate[0]
    }
    
    return new Date(
      Date.UTC(
        year,
        splitedDate[1] - 1,
        dayOfMonth,
        splitedtime[0],
        splitedtime[1],
        splitedtime[2],
      ),
    )
  }
}
