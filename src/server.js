import app from './app';
import database from './database';
require('dotenv/config');

app.listen(process.env.PORT, () => {
  console.log(`Server Running`);

  try {
    database.connection.authenticate().then(() => {
      console.log('Connection has been established successfully.');
    });
  } catch (error) {
    console.log('Unable to connect to the database:', error);
  }
});
