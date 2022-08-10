/* eslint-disable prettier/prettier */
import { Router } from 'express';
require('dotenv/config');

const asyncHandler = require('express-async-handler');

import UserController from './app/controllers/UserController';
import ImageController from './app/controllers/ImageController';
import ContactController from './app/controllers/ContactController';
import Auth from './app/middlewares/auth';

const routes = new Router();

// Image
routes.get('/image/:image_id', asyncHandler(ImageController.show));

// User
routes.get('/user', Auth.verify, asyncHandler(UserController.find));
routes.post('/user/signin', asyncHandler(UserController.signin));
routes.post('/user/signup', asyncHandler(UserController.signup));
routes.put('/user', Auth.verify, asyncHandler(UserController.update));

// Contact
routes.get('/contact', Auth.verify, asyncHandler(ContactController.index));
routes.get('/contact/:contact_id', Auth.verify, asyncHandler(ContactController.find));
routes.post('/contact', Auth.verify, asyncHandler(ContactController.create));
routes.put('/contact/:contact_id', Auth.verify, asyncHandler(ContactController.update));
routes.delete('/contact/:contact_id', Auth.verify, asyncHandler(ContactController.destroy));

export default routes;
