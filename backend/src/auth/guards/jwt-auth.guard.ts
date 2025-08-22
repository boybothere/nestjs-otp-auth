import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) throw new UnauthorizedException('Invalid access!')
        const token = authHeader.split(' ')[1];

        try {
            const decodeToken = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET')
            })

            request.user = {
                id: decodeToken.sub,
                email: decodeToken.email
            }
        } catch (err) {
            throw new UnauthorizedException('Invalid access!')
        }
        return true;
    }
}