import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common"

var base64 = require('base-64')
var utf8 = require('utf8')

@Injectable()
export class BasicAuthGuard implements CanActivate {

    
    constructor () {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const headerAuth = req.headers.authorization
    var userNamePassword = 'admin:qwerty'
    var bytes = utf8.encode(userNamePassword)
    var encoded = 'Basic ' + base64.encode(bytes)
    if (!headerAuth || headerAuth.indexOf('Basic ') === - 1) {
        throw new HttpException('Missing Authorization Header',HttpStatus.UNAUTHORIZED)
    }
    else if (encoded !== headerAuth) {
        throw new HttpException('Incorrect password/login',HttpStatus.UNAUTHORIZED)
    }
    else {
        return true
    }
}
}