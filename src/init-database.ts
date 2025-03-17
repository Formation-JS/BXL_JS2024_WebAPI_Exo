import 'reflect-metadata';
import { AppDataSource } from './config/db';
import { color } from './utils/color.utils';
import { DataSource } from 'typeorm';
import Member, { MemberRole } from './models/member.model';
import { createInterface } from 'readline/promises';
import argon2 from 'argon2';

//! Get params 'drop-db' in cmd
const dropDB = process.argv.includes('--drop-db');

(async () => {
  let exitCode = 0;

  //! Database
  try {
    //? Sync
    const ads = await AppDataSource.initialize();
    await ads.synchronize(dropDB);

    if (dropDB) {
      await initialMember(ads);
    }

    console.log(color.success('Database initialize !'));
  }
  catch (error) {
    //? Display Error
    console.log(color.error('Database on error !'));
    console.log(error instanceof (Error) ? error.message : error);
    exitCode = 1;
  }
  finally {
    //? Stop process
    process.exit(exitCode);
  }
})();

async function initialMember(ads: DataSource) {

  // Password for new member
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const password = await rl.question(color.warn('Password for new members : '));
  await rl.close();

  // Initial members 
  const memberRepo = ads.getRepository(Member);
  const members = memberRepo.create([
    {
      login: 'della',
      email: 'della.duck@demo.be',
      firstname: 'Della',
      lastname: 'Duck',
      role: MemberRole.ADMIN,
      password: await argon2.hash(password)
    },
    {
      login: 'gontran',
      email: 'gontran.bonheur@demo.be',
      firstname: 'Gontran',
      lastname: 'Bonheur',
      role: MemberRole.MEMBER,
      password: await argon2.hash(password)
    }
  ]);
  await memberRepo.save(members);

  console.log(color.info(`Login created for : ${members.map(m => m.login).join(', ')}.`));
}