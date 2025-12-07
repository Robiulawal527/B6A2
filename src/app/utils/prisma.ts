import { PrismaClient } from '@prisma/client';
import config from '../config';

const prisma = new PrismaClient();

export default prisma;
