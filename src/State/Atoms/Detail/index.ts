import {atom, selector} from 'recoil';

interface Data {
  category: string;
  amount: number;
  date: Date;
  type: 'income' | 'expense';
}

const newDAta = new Array(6000).fill({
  category: 'Education',
  amount: 10000,
  date: new Date(),
  type: 'expense',
});
const Data: Data[] = [
  {
    category: 'Education',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Travel',
    amount: 400,
    date: new Date(Date.now()),
    type: 'expense',
  },
  {
    category: 'Income',
    amount: 4000,
    date: new Date(Date.now()),
    type: 'income',
  },
  {
    category: 'Education',
    amount: 10000,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Education',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Travel',
    amount: 700,
    date: new Date(),
    type: 'expense',
  },
  {
    category: 'Groceries',
    amount: 200,
    date: new Date(),
    type: 'expense',
  },
];
export const selectedType = atom({
  key: 'selectedType',
  default: 'expense',
});

export const dataForDetail = selector({
  key: 'dataSelector',
  get: ({get}) => {
    const getSelectedType = get(selectedType);
    if (getSelectedType === 'expense') {
      const filtered = Data.filter(data => {
        return data.type === 'expense';
      });
      const seenType: string[] = [];
      const returned: Data[] = [];
      for (let i = 0; i < filtered.length; i++) {
        if (seenType.includes(filtered[i].category)) {
          const find = returned.find(data => {
            return data.category === filtered[i].category;
          });

          filtered[i].amount = filtered[i].amount + find?.amount;
          if (find) {
            var index = returned.indexOf(find);
            returned.splice(index, 1);
            returned.push(filtered[i]);
          }
        } else {
          seenType.push(filtered[i].category);
          returned.push(filtered[i]);
        }
      }

      return returned;
    }
    return Data.filter(data => {
      return data.type === 'income';
    });
  },
});
