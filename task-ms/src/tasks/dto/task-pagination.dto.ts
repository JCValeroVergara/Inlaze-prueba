import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common';
import { TaskStatusList } from '../enum/tasks.enum';
import { TaskStatus } from '@prisma/client';

export class TaskPaginationDto extends PaginationDto {

    @IsOptional()
    @IsEnum(TaskStatusList, {
        message: `Status must be one of the following values: ${Object.values(TaskStatusList)}`
    })
    status: TaskStatus;
}