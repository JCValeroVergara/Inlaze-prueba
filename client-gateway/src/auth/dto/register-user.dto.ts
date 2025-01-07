import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { Role, RolesList } from '../enum/roles.enum';

export class RegisterUserDto {

    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword()
    password: string;

    @IsEnum(RolesList, {
        message: `Invalid role. Valids values are: ${RolesList.join(', ')}`,
    })
    @IsOptional()
    role?: Role = Role.MEMBER;
}