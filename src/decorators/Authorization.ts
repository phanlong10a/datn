import { Reflector } from '@nestjs/core';
import {
  applyDecorators,
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GraphqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

export const CurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    if (data) return ctx.getContext().req.user[data];
    return ctx.getContext().req.user;
  },
);

export const RequestIp = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.ip;
  },
);

@Injectable()
class JwtPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) { }


  canActivate(context: ExecutionContext): boolean {
    const user = GqlExecutionContext.create(context).getContext().req.user;
    if (!!user) {
      return true;
    } else {
      return false
    }
  }
}

export const Auth = () => {
  return applyDecorators(UseGuards(GraphqlAuthGuard, JwtPermissionsGuard));
};
