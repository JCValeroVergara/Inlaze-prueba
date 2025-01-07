import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';

import { LoginUserDto, RegisterUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.inteface';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('AuthService');

    constructor(
        private readonly jwtService: JwtService
    ) { 
        super();
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    async singJWT(payload: JwtPayload) {
        return this.jwtService.sign(payload);
    }

    async registerUser(registerUserDto: RegisterUserDto) {
        
        const { name, email, password, role } = registerUserDto;

        try {
            const user = await this.user.findUnique({
                where: { email }
            });

            if (user) {
                throw new RpcException({
                    status: 400,
                    message: `User with email ${email} already exists`
                });
            }

            const newUser = await this.user.create({
                data: {
                    name: name,
                    email: email,
                    password: bcrypt.hashSync(password, 10),
                    role: role
                }
            });

            const { password: __, ...rest } = newUser;

            return {
                user: rest,
                token: await this.singJWT(rest)
            }


        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    async loginUser(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        try {
            const user = await this.user.findUnique({
                where: { email }
            });

            if (!user) {
                throw new RpcException({
                    status: 400,
                    message: `Invalid email or password`
                });
            }

            const isValid = bcrypt.compareSync(password, user.password);
            if (!isValid) {
                throw new RpcException({
                    status: 400,
                    message: `Invalid password`
                });
            }

            const { password: __, ...rest } = user;

            return {
                user: rest,
                token: await this.singJWT(rest)
            }


        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            });
        }
    }

    verifyUser() {
        return 'User verified';
    }
}
