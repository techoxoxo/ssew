export type Machine = {
  _id?: string;
  name: string;
  hindiName: string;
  heads: number;
  quantity: number;
  imageUrl: string;
  specifications: string[];
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
};
