import argon2 from 'argon2';
import { MemberData } from '../@types/member';
import { AppDataSource } from '../config/db';
import Member from '../models/member.model';

export async function create(data: MemberData): Promise<Member> {
  const memberRepo = AppDataSource.getRepository(Member);
  const result = await memberRepo.create({
    login: data.login,
    email: data.email,
    password: !!data.password ? await argon2.hash(data.password) : null,
    firstname: data.firstname,
    lastname: data.lastname
  });
  await memberRepo.save(result);

  return {
    ...result,
    password: null
  };
};

export async function exists(login: string): Promise<boolean> {
  const memberRepo = AppDataSource.getRepository(Member);
  const count = await memberRepo.countBy({ login });

  return count !== 0;
}

export async function getInfo(id: number): Promise<Member | null> {
  const memberRepo = AppDataSource.getRepository(Member);
  const member = await memberRepo.findOneBy({ id });

  return !member ? null : { ...member, password: null };
}

export async function lockAccount(id: number): Promise<boolean> {
  const memberRepo = AppDataSource.getRepository(Member);
  const result = await memberRepo.update(id, {
    isDisable: true
  });

  return result.affected === 1;
}

export async function login(login: string, password: string): Promise<Member | null> {
  // NB: A la place de renvoyer "null", il est également possible de déclancher une erreur.

  const memberRepo = AppDataSource.getRepository(Member);
  const member = await memberRepo.findOneBy({ login, isDisable: false });

  if (!member || !member.password) {
    return null;
  }
  const isValid = await argon2.verify(member.password, password);
  if (!isValid) {
    return null;
  }

  //? Update "lastConnection" info
  memberRepo.update(member.id, { lastConnection: new Date() });

  return { ...member, password: null };
}

