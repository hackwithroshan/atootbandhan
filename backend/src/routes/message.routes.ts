import { Router } from 'express';
import { protect as auth } from '../middlewares/auth.middleware.js';
import { getConversations, getMessagesForConversation, sendMessage } from '../controllers/message.controller.js';

const router = Router();

router.use(auth);

router.get('/conversations', getConversations);
router.get('/:userId', getMessagesForConversation);
router.post('/:userId', sendMessage);

export default router;
