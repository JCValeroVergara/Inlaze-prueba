import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {

    @IsString()
    public name: string;

    @IsString()
    public client: string;

    @IsString()
    public description: string;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    public startDate: Date;

    @IsBoolean()
    @IsOptional()
    public active?: boolean;
}