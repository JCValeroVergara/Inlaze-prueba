import { TaskStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskStatusList } from '../enum/tasks.enum';

export class CreateTaskDto {
    
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsUUID()
    projectId: string;

    @IsEnum(TaskStatusList, {
        message: `Invalid status. Valids values are: ${Object.values(TaskStatusList).join(', ')}`,
    })
    @IsOptional()
    status: TaskStatus = TaskStatus.POR_HACER;
}
