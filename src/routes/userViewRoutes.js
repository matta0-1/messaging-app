import { Router } from 'express';
import { UserRepository } from '../domain/repositories/UserRepository.js';
import { UserService } from '../services/UserService.js';
import { UserViewController } from "../controllers/UserViewController.js";

const repo = new UserRepository();
const service = new UserService(repo);
const controller = new UserViewController(service);

export const userViewRoutes = Router();

userViewRoutes.get('/', controller.list);
