import Category from '../models/category.model';

export class CategoryDataDTO {
  id: number;
  name: string;

  constructor(category: Category) {
    this.id = category.id,
      this.name = category.name;
  }
}

