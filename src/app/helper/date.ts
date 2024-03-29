import dayjs from 'dayjs';

class DateHelper {
  static dayjsDate(date: Date | string) {
    return dayjs(date);
  }

  static todayDate() {
    return dayjs();
  }

  static getCurrentYearAndMonth(): number {
    const todayDate = this.todayDate().toDate();
    const month = todayDate.getMonth();
    const monthSanitize = month < 10 ? `0${month}` : month;
    return Number(`${todayDate.getFullYear()}${monthSanitize}`);
  }

  static getYearAndMonthFromDate(date: Date): number {
    const month = date.getMonth();
    const monthSanitize = month < 10 ? `0${month}` : month;
    return Number(`${date.getFullYear()}${monthSanitize}`);
  }
  static getLastDayOfMonth(): number {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  }
  static subtractDate(subtract: number) {
    return dayjs().subtract(subtract, 'month').toDate();
  }

  static isDateExistInCurrentMonth(date: Date) {
    const month = date.getMonth();
    const monthSanitize = month < 10 ? `0${month}` : month;
    return (
      this.getCurrentYearAndMonth() ===
      Number(`${date.getFullYear()}${monthSanitize}`)
    );
  }
  static formatDate(date: Date, sep: '/' | '-') {
    return dayjs(date).format(`DD${sep}MM${sep}YYYY`);
  }
  static getOnlyMonthAndYear(date: Date, sep = ' ') {
    return dayjs(date).format(`MMMM${sep}YYYY`);
  }
  static getTodayDateAndTime() {
    const date = new Date();
    return `${date.getDate()} ${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
  }
  static monthAccordingToDatabase = (month: number) => {
    return month < 10 ? `0${month}` : `${month}`;
  };
  static getFormatTime(date: Date) {
    return dayjs(date).format('hh:mma');
  }
}

export default DateHelper;
