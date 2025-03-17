import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne } from 'typeorm';
import Product from './product.model';

@Entity()
export default class Category {

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'character varying', length: 50 })
  @Unique('UK_Category_Name', (category) => category.name)
  name: string;

  @ManyToOne(() => Product, (p) => p.category)
  @JoinColumn()
  products: Product[];

}
