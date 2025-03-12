import 'reflect-metadata';
import { AppDataSource } from './config/db';
import { color } from './utils/color.utils';

//! Get params 'drop-db' in cmd
const dropDB = process.argv.includes('--drop-db');

(async () => {
  let exitCode = 0;

  //! Database
  try {
    //? Sync
    const ads = await AppDataSource.initialize();
    await ads.synchronize(dropDB);
    
    console.log(color.success('Database initialize !'));
  }
  catch(error) {
    //? Display Error
    console.log(color.error('Database on error !'));
    console.log(error instanceof(Error) ? error.message : error);
    exitCode = 1;
  }
  finally {
    //? Stop process
    process.exit(exitCode);
  }
})();