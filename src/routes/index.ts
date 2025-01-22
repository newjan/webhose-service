import { Router } from "express";
import postRoute from "./postRoutes";

const appRouter = Router();

appRouter.use(postRoute);

export default appRouter;
