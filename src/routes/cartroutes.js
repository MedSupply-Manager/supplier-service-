import express from 'express';
import { getCartItems, addCartItem ,updateCartItem , deleteCartItem} from '../controllers/cartController.js';

const router = express.Router();

// Use the existing controller functions
router.get('/', getCartItems);
router.post('/', addCartItem);
router.put('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);
export default router;
