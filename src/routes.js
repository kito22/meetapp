import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';

import configMulter from './config/multer';
import MeetupController from './app/controllers/MeetupController';

import SubscriptionController from './app/controllers/SubscriptionController';
import OrganizationController from './app/controllers/OrganizationController';

const routes = new Router();

const upload = multer(configMulter);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', MeetupController.store);
routes.put('/meetups', MeetupController.update);
routes.get('/meetups', MeetupController.index);
routes.delete('/meetups/:id', MeetupController.delete);

routes.post('/meetups/:meetupId/subscriptions', SubscriptionController.store);

routes.get('/meetups/organization', OrganizationController.index);
routes.get('/subscriptions', SubscriptionController.index);

export default routes;
