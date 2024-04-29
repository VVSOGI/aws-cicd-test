import { dataSource } from './data-source';

async function runMigrations() {
  await dataSource.initialize();

  // console.log('Migrations have been run successfully.');
}

runMigrations().catch((error) => {
  console.error('Error during migrations', error);
});
