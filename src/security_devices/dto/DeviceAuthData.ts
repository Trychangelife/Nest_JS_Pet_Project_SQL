
export class DeviceAuthData {
    constructor(
        public userId: string,
        public refreshToken: string,
        public ip: string,
        public title: string,
        public deviceId: string,
        public lastActiveDate: string
    ) { }
}
