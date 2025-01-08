import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common';
import { TaskStatus, TaskStatusList } from '../enum/tasks.enum';

export class TaskPaginationDto extends PaginationDto {

    @IsOptional()
    @IsEnum(TaskStatusList, {
        message: `Status must be one of the following values: ${Object.values(TaskStatusList)}`
    })
    status: TaskStatus;

    @IsOptional()
    @IsUUID()
    projectId: string;
}