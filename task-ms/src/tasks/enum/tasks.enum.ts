import { TaskStatus } from '@prisma/client';

export const TaskStatusList = [
    TaskStatus.COMPLETADA,
    TaskStatus.POR_HACER,
    TaskStatus.EN_PROGRESO,
];