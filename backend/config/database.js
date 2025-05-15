const mongoose = require('mongoose');
require('dotenv').config();

const { MONGODB_URL } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'credzin' // specify database name
    })
    .then(() => {
      console.log(`DB Connection Success - Connected to Welzin cluster, credzin database`);
      
      // Verify connection and collection
      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'MongoDB connection error:'));
      db.once('open', async () => {
        try {
          // Check if collection exists
          const collections = await db.db.listCollections().toArray();
          const hasCollection = collections.some(col => col.name === 'credit_cards');
          
          if (!hasCollection) {
            console.warn('Warning: credit_cards collection not found in credzin database');
          } else {
            console.log('Successfully connected to credit_cards collection');
          }
        } catch (err) {
          console.error('Error checking collections:', err);
        }
      });
    })
    .catch((err) => {
      console.error('Error connecting to DB:', err);
      throw new Error('Error connecting to DB');
    });
};