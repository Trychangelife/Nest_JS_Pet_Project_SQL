// new ParseEnumPipe (LIKES, {
//     errorHttpStatusCode: HttpStatus.BAD_REQUEST,
//     exceptionFactory: error => {
//         throw new BadGatewayException({
//             errorsMessages: [{
//                 message: error,
//                 field: "likeStatus"
//             }]
//         })
//     }
// }))