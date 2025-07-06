export interface ToolbarData {
  title: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
}

export enum ProductFilter {
  all = 1,
  top,
}

