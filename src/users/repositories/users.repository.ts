
import { sub } from "date-fns"
import { Model } from "mongoose"
import { usersModel } from "src/db"
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType, RefreshTokenStorageType, RegistrationDataType } from "src/utils/types"
import { NewPasswordType, RecoveryPasswordType } from "src/auth/dto/RecoveryPasswordType"
import { UsersType } from "src/users/dto/UsersType"
import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { DataSource } from "typeorm"
import { InjectDataSource } from "@nestjs/typeorm"
import { UUID } from "mongodb"

@Injectable()
export class UsersRepository {

    constructor (
        @InjectDataSource() protected dataSource: DataSource,
        @InjectModel('Users') public usersModel: Model<UsersType>,
        @InjectModel('RegistrationData') protected registrationDataModel: Model<RegistrationDataType>,
        @InjectModel('AuthData') protected authDataModel: Model<AuthDataType>,
        @InjectModel('CodeConfirm') protected codeConfirmModel: Model<ConfirmedAttemptDataType>,
        @InjectModel('EmailSend') protected emailSendModel: Model<EmailSendDataType>,
        @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>,
        @InjectModel('RecoveryPassword') protected recoveryPasswordModel: Model<RecoveryPasswordType>,
        @InjectModel('NewPassword') protected newPasswordModel: Model<NewPasswordType>
    ) {

    }
    async allUsers(
        skip: number,
        limit: number,
        sortDirection: string = 'desc',  // Значение по умолчанию
        sortingParam: string = 'createdAt',  // Значение по умолчанию
        page: number,
        searchLoginTerm: string = '',
        searchEmailTerm: string = ''
      ): Promise<object> {
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            await queryRunner.connect();

            // Условие фильтрации по логину и email
            let filterConditions = `WHERE 1=1`;
            if (searchLoginTerm) {
                filterConditions += ` AND u.login ILIKE '%' || $1 || '%'`;
            }
            if (searchEmailTerm) {
                filterConditions += ` AND u.email ILIKE '%' || $2 || '%'`;
            }

            // // Условие по бан-статусу
            // if (banStatus === BanStatus.banned) {
            //     filterConditions += ` AND bi.is_banned = true`;
            // } else if (banStatus === BanStatus.notBanned) {
            //     filterConditions += ` AND bi.is_banned = false`;
            // }
            // Основной запрос для выборки пользователей с необходимыми JOIN'ами
            const usersQuery = `
      SELECT u.id, u.login, u.email, u.created_at
      FROM users u
      LEFT JOIN account_user_data ad ON u.id = ad.user_id
      LEFT JOIN email_confirmation ec ON u.id = ec.user_id
      LEFT JOIN recovery_password_info rpi ON u.id = rpi.user_id
      LEFT JOIN ban_info bi ON u.id = bi.user_id
      ${filterConditions}
      ORDER BY u.${sortingParam} ${sortDirection}
      LIMIT $1 OFFSET $2;
    `;
            // Выполнение запроса на пользователей с пагинацией
            const users = await queryRunner.query(
                usersQuery,
                [limit, skip]
            );
            // Запрос для подсчёта общего количества пользователей (без лимитов)
            const totalCountQuery = `
      SELECT COUNT(*)
      FROM users u
      LEFT JOIN ban_info bi ON u.id = bi.user_id
      ${filterConditions};
    `;
            const totalCountResult = await queryRunner.query(
                totalCountQuery,
                []
            );
            const totalCount = parseInt(totalCountResult[0].count, 10);

            // Вычисление количества страниц
            const pagesCount = Math.ceil(totalCount / limit);
            // Формирование результата в виде ViewModel
            const result = {
                pagesCount: pagesCount,
                page: page,
                pageSize: limit,
                totalCount: totalCount,
                items: users.map(user => ({
                    id: user.id,
                    email: user.email,
                    login: user.login,
                    createdAt: user.created_at
                }))
            };

            return result;

        } catch (err) {
            throw new Error(`Ошибка при получении списка пользователей: ${err.message}`);
        } finally {
            await queryRunner.release();
        }
      }
      async createUser(newUser: UsersType): Promise<UsersType | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Шаг 1: Вставка данных в таблицу users
            const usersInsertResult = await queryRunner.query(
                `INSERT INTO users (login, email, created_at)
         VALUES ($1, $2, $3)
         RETURNING id`,
                [newUser.login, newUser.email, newUser.createdAt],
            );
            const userId = usersInsertResult[0].id;
            // Шаг 2: Вставка данных в таблицу account_user_data
            await queryRunner.query(
                `INSERT INTO account_user_data (user_id, password_hash, password_salt)
         VALUES ($1, $2, $3)`,
                [userId, newUser.password_hash, newUser.password_salt],
            );
            // Шаг 3: Вставка данных в таблицу email_confirmation
            await queryRunner.query(
                `INSERT INTO email_confirmation (user_id, code_for_activated, activated_status)
         VALUES ($1, $2, $3)`,
                [userId, newUser.emailConfirmation.codeForActivated, newUser.emailConfirmation.activatedStatus],
            );
            // Шаг 4: Вставка данных в таблицу recovery_password_info
            await queryRunner.query(
                `INSERT INTO recovery_password_info (user_id, code_for_recovery, created_date_recovery_code)
         VALUES ($1, $2, $3)`,
                [
                    userId,
                    newUser.recoveryPasswordInformation?.codeForRecovery || null,
                    newUser.recoveryPasswordInformation?.createdDateRecoveryCode || null,
                ],
            );
            // Шаг 5: Вставка данных в таблицу ban_info
            await queryRunner.query(
                `INSERT INTO ban_info (user_id, is_banned, ban_date, ban_reason)
         VALUES ($1, $2, $3, $4)`,
                [
                    userId,
                    newUser.banInfo?.isBanned || false,
                    newUser.banInfo?.banDate || null,
                    newUser.banInfo?.banReason || null,
                ],
            );
            // Возвращение созданного пользователя
            const createdUser = await queryRunner.query(
                `SELECT id, login, email, created_at as "createdAt" FROM users WHERE id = $1`, [userId]
            );

            // Завершение транзакции
            await queryRunner.commitTransaction();

            return createdUser[0]; // Возвращаем первого пользователя из результата (по идее, он один)
        } catch (err) {
            // В случае ошибки откатить все изменения
            await queryRunner.rollbackTransaction();
            return null
        } finally {
            // Завершение работы с QueryRunner
            await queryRunner.release();
        }
    }
async createNewPassword(passwordHash: string, passwordSalt: string, recoveryCode: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
        const result = await queryRunner.query(
            `UPDATE users u
             SET password_hash = $1, password_salt = $2
             FROM recovery_password_info rpi
             WHERE rpi.user_id = u.id AND rpi.code_for_recovery = $3`,
            [passwordHash, passwordSalt, recoveryCode]
        );
        return result[1] > 0; // Returns true if at least one row is modified
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await queryRunner.release();
    }
}
async deleteUser(id: string): Promise<boolean> {

    try {
        const query = `DELETE FROM users WHERE id = $1;`;
        const result = await this.dataSource.query(query, [id]);
        // Проверяем, был ли удален один пользователь
        //console.log("Сюда попал", result); // Посмотри, что содержит result
        return result[1] === 1; // Возвращает true, если удалена одна строка
    } catch (error) {
        console.log(error.message)
        return false
    }
    

}

// Основная часть закончена, вспомогательные эндпоинты
async confirmationEmail(userId: string, code: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
        await queryRunner.startTransaction();
        await queryRunner.query(
            `UPDATE email_confirmation
             SET activated_status = true
             WHERE user_id = $1`,
            [userId]
        );
        await queryRunner.query(
            `UPDATE email_confirmation
             SET code_for_activated = NULL
             WHERE user_id = $1`,
            [userId]
        );
        await queryRunner.commitTransaction();
        return true;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error(error);
        return false;
    } finally {
        await queryRunner.release();
    }
}

async ipAddressIsScam(ip: string, login?: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    try {
        // Устанавливаем пороговую дату, отнимая 10 секунд от текущего времени
        const dateThreshold = sub(new Date(), { seconds: 10 });

        // Выполняем SQL-запрос для подсчета регистраций с одинаковым IP за последние 10 секунд
        const checkResultByIp = await queryRunner.query(
            `SELECT COUNT(*) FROM registration_data 
         WHERE ip = $1 AND date_registration > $2`,
            [ip, dateThreshold]
        );

        const registrationCount = parseInt(checkResultByIp[0].count, 10);

        // Проверяем, превышает ли количество регистраций порог (5)
        if (registrationCount > 5) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error('Error checking IP registration rate:', error);
        return false;
    } finally {
        await queryRunner.release();
    }
}

// Считаем количество авторизаций с учетом IP и Login за последние 10 секунд
async counterAttemptAuth(ip: string, login?: string): Promise<boolean> {
    const dateThreshold = sub(new Date(), { seconds: 10 });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
        const [ipCount, loginCount] = await Promise.all([
            queryRunner.query(
                `SELECT COUNT(*) as count
                 FROM auth_data
                 WHERE ip = $1 AND try_auth_date > $2`,
                [ip, dateThreshold]
            ),
            queryRunner.query(
                `SELECT COUNT(*) as count
                 FROM auth_data
                 WHERE login = $1 AND try_auth_date > $2`,
                [login, dateThreshold]
            )
        ]);
        return parseInt(ipCount[0].count, 10) <= 5 && parseInt(loginCount[0].count, 10) <= 5;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await queryRunner.release();
    }
}
async counterAttemptConfirm(ip: string, code: string): Promise<boolean> {
    const dateThreshold = sub(new Date(), { seconds: 10 });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
        const result = await queryRunner.query(
            `SELECT COUNT(*) as count
             FROM confirm_attempt_data
             WHERE ip = $1 AND try_confirm_date > $2`,
            [ip, dateThreshold]
        );
        return parseInt(result[0].count, 10) <= 5;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await queryRunner.release();
    }
}
async counterAttemptEmail(ip: string, email?: string): Promise<boolean> {
    const dateThreshold = sub(new Date(), { seconds: 10 });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
        const result = await queryRunner.query(
            `SELECT COUNT(*) as count
             FROM email_send_data
             WHERE ip = $1 AND email_send_date > $2`,
            [ip, dateThreshold]
        );
        return parseInt(result[0].count, 10) <= 5;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await queryRunner.release();
    }
}
async counterAttemptRecoveryPassword(ip: string, email?: string): Promise<boolean> {
    const dateThreshold = sub(new Date(), { seconds: 10 });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
        const result = await queryRunner.query(
            `SELECT COUNT(*) as count
             FROM recovery_password
             WHERE ip = $1 AND email_send_date > $2`,
            [ip, dateThreshold]
        );
        return parseInt(result[0].count, 10) <= 5;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await queryRunner.release();
    }
}
async counterAttemptNewPassword(ip: string, code?: string): Promise<boolean> {
    const dateThreshold = sub(new Date(), { seconds: 10 });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
        const result = await queryRunner.query(
            `SELECT COUNT(*) as count
             FROM new_password
             WHERE ip = $1 AND timestamp_new_password > $2`,
            [ip, dateThreshold]
        );
        return parseInt(result[0].count, 10) <= 5;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await queryRunner.release();
    }
}

async passwordRecovery(userId: string, code: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
        const result = await queryRunner.query(
            `UPDATE recovery_password_info
             SET code_for_recovery = $1
             WHERE user_id = $2`,
            [code, userId]
        );
        return result[1] > 0;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await queryRunner.release();
    }
}

// Эндпоинты для поиска по определенным условиям
async findUserByEmail(email: string): Promise<UsersType | null> {
    try {
        const foundUser: UsersType = await this.dataSource.query(`
SELECT *
FROM users
WHERE email = $1
`, [email]);
        return foundUser[0]
    } catch (error) {
        return null
    }
}
async findUserById(userId: string): Promise<UsersType | null> {
    try {
        const foundUser: UsersType = await this.dataSource.query(`
SELECT *
FROM users
WHERE id = $1
`, [userId]);
        return foundUser[0]
    } catch (error) {
        return null
    }
}
async findUserByLogin(login: string): Promise<UsersType | null> {
    try {
        const foundUser: UsersType = await this.dataSource.query(`
SELECT *
FROM users
WHERE login = $1
`, [login]);
        return foundUser[0]
    } catch (error) {
        return null
    }

}
async findUserHash(login: string): Promise<UsersType | null> {
        try {
            const foundUser: UsersType = await this.dataSource.query(`
        SELECT *
        FROM account_user_data
        LEFT JOIN users ON users.id = account_user_data.user_id
        WHERE users.login = $1
    `, [login]);
            return foundUser[0]
        } catch (error) {
            return null
        }
}


async findUserByLoginForMe(login: string): Promise<UsersType | null> {
    try {
        const result = await this.dataSource.query(
            `SELECT * FROM users WHERE login = $1`,
            [login]
        );
        return result[0] || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}
    
async findUserByConfirmationCode(code: string): Promise<UsersType | null> {
    try {
        const result = await this.dataSource.query(
            `SELECT u.* 
             FROM users u
             JOIN email_confirmation ec ON u.id = ec.user_id
             WHERE ec.code_for_activated = $1`,
            [code]
        );
        return result[0] || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async findCode(code: string): Promise<string | null> {
    try {
        const result = await this.dataSource.query(
            `SELECT code_for_activated 
             FROM email_confirmation
             WHERE code_for_activated = $1`,
            [code]
        );

        // Проверяем, есть ли результаты и возвращаем строку, если она существует
        return result.length > 0 ? result[0].code_for_activated : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}


async refreshActivationCode(userId: string, newCode: string): Promise<UsersType | null> {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
        await queryRunner.query(
            `UPDATE email_confirmation
             SET code_for_activated = $1
             WHERE user_id = $2`,
            [newCode, userId]
        );
        const result: UsersType = await queryRunner.query(`
         SELECT *
         FROM users
         WHERE id = $1
        `, [userId])
        return result[0]
    } catch (error) {
        console.error(error);
        return null;
    } finally {
        await queryRunner.release();
    }
}


// Эндпоинты для выгрузки информации из вспомогательных лог-баз
async getRegistrationDate(): Promise<RegistrationDataType[]> {
    
    try {
        const result = await this.dataSource.query(
            `SELECT * FROM registration_data`
        );
        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async getAuthDate(): Promise<AuthDataType[]> {
    try {
        const result = await this.dataSource.query(
            `SELECT * FROM auth_data`
        );
        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async getEmailSendDate(): Promise<EmailSendDataType[]> {
    try {
        const result = await this.dataSource.query(
            `SELECT * FROM email_send_data`
        );
        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async getConfirmAttemptDate(): Promise<ConfirmedAttemptDataType[]> {
    try {
        const result = await this.dataSource.query(
            `SELECT * FROM confirm_attempt_data`
        );
        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async getTokenDate(): Promise<RefreshTokenStorageType[]> {
    try {
        const result = await this.dataSource.query(
            `SELECT * FROM refresh_token_storage`
        );
        return result;
    } catch (error) {
        console.error(error);
        return [];
    } 
}

// Эндпоинты для наполнения информацией вспомогательных лог-баз
async informationAboutRegistration(registrationData: RegistrationDataType): Promise<boolean> {
    await this.dataSource.query(
        `INSERT INTO registration_data (ip, date_registration, email)
         VALUES ($1, $2, $3)`,
        [
            registrationData.ip,
            registrationData.dateRegistation,
            registrationData.email,
        ],
    );
    return true
}
    
async informationAboutAuth(authData: AuthDataType): Promise<boolean> {
    await this.dataSource.query(
        `INSERT INTO auth_data (ip, try_auth_date, login)
 VALUES ($1, $2, $3)`,
        [
            authData.ip,
            authData.tryAuthDate,
            authData.login,
        ],) 
    return true
}
async informationAboutEmailSend(emailSendData: EmailSendDataType): Promise<boolean> {
    await this.dataSource.query(
        `INSERT INTO email_send_data (ip, email_send_date, email)
 VALUES ($1, $2, $3)`,
        [
            emailSendData.ip,
            emailSendData.emailSendDate,
            emailSendData.email,
        ],)
    return true
}
async informationAboutConfirmed(confirmedData: ConfirmedAttemptDataType): Promise<boolean> {
    await this.dataSource.query(
        `INSERT INTO confirmed_attempt_data (ip, try_confirm_date, code)
 VALUES ($1, $2, $3)`,
        [
            confirmedData.ip,
            confirmedData.tryConfirmDate,
            confirmedData.code,
        ],)
    return true
}
async informationAboutPasswordRecovery(recoveryPasswordData: RecoveryPasswordType): Promise<boolean> {
    await this.dataSource.query(
        `INSERT INTO recovery_password (ip, email_send_date, email)
 VALUES ($1, $2, $3)`,
        [
            recoveryPasswordData.ip,
            recoveryPasswordData.emailSendDate,
            recoveryPasswordData.email,
        ],)
    return true
}
async informationAboutNewPassword(recoveryNewPasswordData: NewPasswordType): Promise<boolean> {
    await this.dataSource.query(
        `INSERT INTO new_password (ip, recovery_code, timestamp_new_password)
 VALUES ($1, $2, $3)`,
        [
            recoveryNewPasswordData.ip,
            recoveryNewPasswordData.recoveryCode,
            recoveryNewPasswordData.timestampNewPassword,
        ],)
    return true
}
}