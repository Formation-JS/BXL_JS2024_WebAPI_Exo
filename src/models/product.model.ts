import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne } from 'typeorm';
import Category from './category.model';

@Entity()
export default class Product {

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'character varying', length: 50 })
  name: string;

  @Column({ type: 'character', length: 13})
  @Unique('UK_Product_EAN13', (product) => product.ean13)
  ean13: string;

  @Column({ type: 'character varying', length: 1_000, nullable: true })
  description: string | null;

  @ManyToOne(() => Category, (c) => c.products)
  @JoinColumn()
  category: Category;

}
