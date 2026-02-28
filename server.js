// configured the .env
const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const cron = require('node-cron');
const retryFailedDeliveries = require('./src/jobs/retryFailedDeliveries');

// Retrying of failure jobs using cron jobs every minute
cron.schedule('*/1 * * * *', () => {
    retryFailedDeliveries();
})

// connection of MongoDB
const connectDB = require('./src/config/db');
connectDB();

// Starting the server at the PORT 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});