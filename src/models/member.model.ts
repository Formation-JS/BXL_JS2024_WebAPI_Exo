import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

//? Les enum sont supporté en PostgreSQL 😉
export enum MemberRole {
  ADMIN = "admin",
  MANAGER = "manager",
  MEMBER = "member",
}

@Entity()
export default class Member {

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'character varying', length: 50 })
  @Unique('UK_Member_Login', (member) => member.login)
  login: string;

  @Column({ type: 'character', length: 97, nullable: false})
  password: string | null;

  @Column({ type: 'character varying', length: 200 })
  email: string;

  @Column({ type: 'character varying', length: 50, nullable: true })
  firstname: string | null;

  @Column({ type: 'character varying', length: 50, nullable: true })
  lastname: string | null;

  @Column({ type: "enum", enum: MemberRole, default: MemberRole.MEMBER })
  role: MemberRole;

  @Column({ type: 'timestamp', nullable: true })
  lastConnection: Date;

  @Column({ type: 'bool', default: false })
  isDisable: boolean;
}