/* eslint-disable prettier/prettier */
import { Router } from 'express';
require('dotenv/config');

const asyncHandler = require('express-async-handler');

import UserController from './app/controllers/UserController';
import ImageController from './app/controllers/ImageController';
import Auth from './app/middlewares/auth';

const routes = new Router();

// Image
routes.get('/image/:image_id', asyncHandler(ImageController.show));

// User
routes.get('/user', Auth.verify, asyncHandler(UserController.find));
routes.post('/user/signin', asyncHandler(UserController.signin));
routes.post('/user/signup', asyncHandler(UserController.signup));
routes.put('/user/:user_id', asyncHandler(UserController.update));

export default routes;
