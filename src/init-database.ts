import 'reflect-metadata';
import { AppDataSource } from './config/db';
import { color } from './utils/color.utils';
import { DataSource } from 'typeorm';
import Member, { MemberRole } from './models/member.model';
import { createInterface } from 'readline/promises';
import argon2 from 'argon2';
import Category from './models/category.model';
import Product from './models/product.model';

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
      await initialProduct(ads);
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

async function initialProduct(ads: DataSource) {
  
  // Initial category 
  const categoryRepo = ads.getRepository(Category);
  const [cat1, cat2] = categoryRepo.create([{ name: 'Vêtements' }, { name: 'Électronique' }]);
  const otherCat = categoryRepo.create([
    { "name": "Livres" },
    { "name": "Musique" },
    { "name": "Films" },
    { "name": "Jeux vidéo" },
    { "name": "Mobilier" },
    { "name": "Jardinage" },
    { "name": "Sport" },
    { "name": "Aliments" },
    { "name": "Boissons" },
    { "name": "Jouets" },
    { "name": "Bricolage" },
    { "name": "Bijoux" },
    { "name": "Logiciels" }
  ]);
  await categoryRepo.save([cat1, cat2, ...otherCat])
  console.log(color.info('Category created'));

  // Initial product 
  const productRepo = ads.getRepository(Product);
  const products = productRepo.create([
    {
      name: 'T-shirt en coton bio',
      ean13: '3612345678901',
      description: 'T-shirt confortable en coton biologique, idéal pour un usage quotidien.',
      category: cat1
    },
    {
      name: 'Montre connectée',
      ean13: '3612345678949',
      description: 'Montre connectée avec suivi d\'activité, notifications et GPS intégré.',
      category: cat2
    },
    {
      name: 'Smartphone 5G',
      ean13: '3612345678956',
      description: null,
      category: cat2
    },
    {
      name: 'Pull en laine mérinos',
      ean13: '3612345678932',
      description: 'Pull chaud et doux en laine mérinos, parfait pour les journées fraîches.',
      category: cat1
    },
    {
      name: 'Ordinateur portable',
      ean13: '3612345678970',
      description: null,
      category: cat2
    },
    {
      name: 'Tablette tactile',
      ean13: '3612345678987',
      description: 'Tablette tactile avec écran de 10 pouces, idéale pour la navigation web et le divertissement.',
      category: cat2
    }
  ]);
  await productRepo.save(products);
  console.log(color.info('Product created'));
}
