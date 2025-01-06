
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus, TaskStatusList } from '../enum/tasks.enum';

export class CreateTaskDto {
    
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsEnum(TaskStatusList, {
        message: `Invalid status. Valids values are: ${Object.values(TaskStatusList).join(', ')}`,
    })
    @IsOptional()
    status: TaskStatus = TaskStatus.POR_HACER;
}
