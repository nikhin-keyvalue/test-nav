export interface Item {
  name: string;
  testId?: string;
  id: string | number;
  disabled?: (arg: number) => boolean;
  onClick: (arg?: number | string | boolean, id?: string) => void;
}
