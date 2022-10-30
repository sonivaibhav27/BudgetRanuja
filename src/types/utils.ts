export type TTextType = 'heading' | 'subheading' | 'normal' | 'paragraph';
export interface TOnlyInformationFromBill {
  billAmount: number;
  typeOfBill?: 'expense' | 'income';
  categoryId: string;
}
export type TFullScreenModalRef = {
  close: (cb: () => void) => void;
};
export type TBottomSheetRef = {
  close: () => void;
};
