import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import matchRoutes from './routes/match.routes.js';
import interestRoutes from './routes/interest.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import contentRoutes from './routes/content.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import messageRoutes from './routes/message.routes.js';
import adminRoutes from './routes/admin.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Backend is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Global Error Handler Middleware (should be the last one)
app.use(errorMiddleware);

export default app;