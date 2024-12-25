import { Router } from 'express';
const router = Router();

router.get('/anotherpath', (req, res) => {
  res.send('Another response');
});

export default router;
