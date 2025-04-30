import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import http from "http";
import { setupSwagger } from './swagger';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

setupSwagger(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const server = http.createServer(app);

export { app, server };
