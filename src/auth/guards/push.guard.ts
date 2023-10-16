import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class PushGuard implements CanActivate {
  constructor(
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const { tokenpush } = req.headers

    if (tokenpush == "dsvquw4viq9n3498<DN9#") return true

    return false
  }
}

