import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import Product from './product.model';
import Member from './member.model';

export enum StockEntryOperation {
  ADDITION = "addition",
  WITHDRAWAL = "withdrawal",
  ADJUSTMENT = "adjustment",
}

@Entity()
export default class StockEntry {

  @PrimaryGeneratedColumn('identity')
  id: number;

  @ManyToOne(() => Product, (p) => p.stockEntries)
  @JoinColumn()
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: "enum", enum: StockEntryOperation })
  operation: StockEntryOperation;

  @ManyToOne(() => Member, (m) => m.stockEntries)
  createBy: Member;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

}
