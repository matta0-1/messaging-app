import { Router } from 'express';
import { UserRepository } from '../domain/repositories/UserRepository.js';
import { UserService } from '../services/UserService.js';
import { validationResult } from 'express-validator';
import { upsertUser, idParam } from '../validators/userValidators.js';


const router = Router();

router.get('/', async (req, res, next) => {
    res.render("EH");
})


export { router as userViewRoutes }; 
