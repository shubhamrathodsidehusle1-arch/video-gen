import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register.bind(authController));
router.post('/login', validateBody(loginSchema), authController.login.bind(authController));
router.post('/refresh', validateBody(refreshTokenSchema), authController.refresh.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.get('/me', authenticate, authController.getMe.bind(authController));
router.post(
  '/change-password',
  authenticate,
  validateBody(changePasswordSchema),
  authController.changePassword.bind(authController)
);

export default router;
