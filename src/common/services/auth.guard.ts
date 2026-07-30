import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../services/Token.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HUserDocument, User } from 'src/DB/Models/user.model';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request = context.switchToHttp().getRequest<Request>();
    if(!request){
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    }
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    let payload: any;
    try {
      payload = this.tokenService.verifyToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.userModel.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    (request as any).user = user;

    return true;
  }
}
