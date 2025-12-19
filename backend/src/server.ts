import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database first, then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database. Server did not start.', err);
    // FIX: Suppress TypeScript error for `process.exit`. This is a valid Node.js function, but the type definitions seem to be incomplete in this project environment.
    // @ts-ignore
    process.exit(1);
});