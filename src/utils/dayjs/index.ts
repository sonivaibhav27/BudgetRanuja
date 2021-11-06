import dayjs from 'dayjs';

class Dayjs {
  static todayDate() {
    console.log(dayjs());
    return dayjs();
  }

  static getCurrentMonthAndYear(): number {
    return Number(`${dayjs().get('M') + 1}${dayjs().get('y')}`);
  }
}

export default Dayjs;
