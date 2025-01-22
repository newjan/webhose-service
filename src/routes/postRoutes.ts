import { Router } from 'express';
import * as postController from '@/controllers/postController';
import { requestHandler } from '@/middlewares/request-handler';

const postRoute = Router();

postRoute.post('/fetchPosts', requestHandler(postController.fetchAndStorePostsFromAPI),);

export default postRoute;