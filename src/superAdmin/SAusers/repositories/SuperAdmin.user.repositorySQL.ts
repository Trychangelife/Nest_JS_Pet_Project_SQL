
import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { sub } from "date-fns"
import { NewPasswordType, RecoveryPasswordType } from "src/auth/dto/RecoveryPasswordType"
import { AccountUserDataEntity } from "src/entities/auth/account_user_data.entity"
import { NewPasswordEntity } from "src/entities/auth/new_password.entity"
import { EmailConfirmationEntity } from "src/entities/email/email_confirmation.entity"
import { BanInfoEntity } from "src/entities/users/ban_info.entity"
import { RecoveryPasswordEntity } from "src/entities/users/recovery_password.entity"
import { RecoveryPasswordInfoEntity } from "src/entities/users/recovery_password_info.entity"
import { UserEntity } from "src/entities/users/user.entity"
import { BanStatus } from "src/superAdmin/SAblog/dto/banStatus"
import { UsersType, userViewModel } from "src/users/dto/UsersType"
import { ConfirmedAttemptDataType, EmailSendDataType, RefreshTokenStorageType } from "src/utils/types"
import { DataSource, InsertResult } from "typeorm"


@Injectable()
export class SuperAdminUsersRepositorySql {

    constructor(
        @InjectDataSource() protected dataSource: DataSource
    ) {

    }

    async allUsers(
        skip: number,
        limit: number,
        sortDirection: string,
        sortingParam: string,
        page: number,
        searchLoginTerm: string,
        searchEmailTerm: string,
        banStatus: BanStatus
    ): Promise<object> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
    
            // Маппинг значений sortingParam на реальные названия колонок в базе данных
            const sortingColumnsMap: Record<string, string> = {
                createdAt: 'created_at',
                login: 'login',
                email: 'email'
                // Добавьте другие поля, если нужно
            };
    
            // Приведение sortingParam к корректному значению
            const dbSortingColumn = sortingColumnsMap[sortingParam] || 'created_at';
    
            // Условие фильтрации по логину и email
            let filterConditions = `WHERE 1=1`;
            const queryParams = [];
    
            if (searchLoginTerm) {
                filterConditions += ` AND u.login ILIKE '%' || $${queryParams.length + 1} || '%'`;
                queryParams.push(searchLoginTerm);
            }
            if (searchEmailTerm) {
                filterConditions += ` OR u.email ILIKE '%' || $${queryParams.length + 1} || '%'`;
                queryParams.push(searchEmailTerm);
            }
            // Условие по бан-статусу
            if (banStatus === BanStatus.banned) {
                filterConditions += ` AND bi.is_banned = true`;
            } else if (banStatus === BanStatus.notBanned) {
                filterConditions += ` AND bi.is_banned = false`;
            }
    
            // Преобразование параметров limit и skip в числовой тип
            const numericLimit = Number(limit);
            const numericSkip = Number(skip);
    
            // Основной запрос для выборки пользователей с необходимыми JOIN'ами
            const usersQuery = `
                SELECT u.id, u.login, u.email, u.created_at AS createdAt
                FROM users u
                ${filterConditions}
                ORDER BY u.${dbSortingColumn} ${sortDirection}
                LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};
            `;
            
            // Добавляем числовые limit и skip в параметры
            queryParams.push(numericLimit, numericSkip);
    
            // Выполнение запроса на пользователей с пагинацией
            const users = await queryRunner.query(usersQuery, queryParams);
            // Запрос для подсчёта общего количества пользователей (без лимитов)
            const totalCountQuery = `
                SELECT COUNT(*)
                FROM users u
                LEFT JOIN ban_info bi ON u.id = bi.user_id
                ${filterConditions};
            `;
    
            // Параметры фильтрации для общего запроса
            const totalCountResult = await queryRunner.query(totalCountQuery, queryParams.slice(0, -2));
            const totalCount = parseInt(totalCountResult[0].count, 10);
    
            // Вычисление количества страниц
            const pagesCount = Math.ceil(totalCount / numericLimit);

            // Формирование результата в виде ViewModel
            const result = {
                pagesCount: pagesCount,
                page: page,
                pageSize: numericLimit,
                totalCount: totalCount,
                items: users.map(user => ({
                    id: user.id.toString(),
                    email: user.email,
                    login: user.login,
                    createdAt: user.createdat
                }))
            };

            return result;
    
        } catch (err) {
            throw new Error(`Ошибка при получении списка пользователей: ${err.message}`);
        } finally {
            await queryRunner.release();
        }
    }
    
    

    async createUser(newUser: UsersType): Promise<userViewModel| null> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Шаг 1: Вставка данных в таблицу users
            const usersInsertResult: InsertResult = await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(UserEntity)
            .values({
                login: newUser.login,
                email: newUser.email,
                created_at: newUser.createdAt
            })
            .execute()
            const userId = usersInsertResult.generatedMaps[0].id
         // Шаг 2: Вставка данных в таблицу account_user_data
        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(AccountUserDataEntity)
            .values({
                user_id: userId,
                password_hash: newUser.password_hash,
                password_salt: newUser.password_salt,
            })
            .execute();

        // Шаг 3: Вставка данных в таблицу email_confirmation
        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(EmailConfirmationEntity)
            .values({
                user_id: userId,
                code_for_activated: newUser.emailConfirmation.codeForActivated,
                activated_status: newUser.emailConfirmation.activatedStatus,
            })
            .execute();

        // Шаг 4: Вставка данных в таблицу recovery_password_info
        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(RecoveryPasswordInfoEntity)
            .values({
                user_id: userId,
                code_for_recovery: newUser.recoveryPasswordInformation?.codeForRecovery || null,
                created_date_recovery_code: newUser.recoveryPasswordInformation?.createdDateRecoveryCode || null,
            })
            .execute();

        // Шаг 5: Вставка данных в таблицу ban_info
        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(BanInfoEntity)
            .values({
                user_id: userId,
                is_banned: newUser.banInfo?.isBanned || false,
                ban_date: newUser.banInfo?.banDate || null,
                ban_reason: newUser.banInfo?.banReason || null,
            })
            .execute();

        // Возвращение созданного пользователя
        const createdUser = await queryRunner.manager
            .createQueryBuilder(UserEntity, 'user')
            .select(['user.id', 'user.login', 'user.email', 'user.created_at'])
            .where('user.id = :id', { id: userId })
            .getRawOne()
            // Завершение транзакции
            await queryRunner.commitTransaction();

            //View модель только для тестов, потому что в БД лежит Integer, а тесты требуют строку.
            const viewModel: userViewModel = {
            id: createdUser.user_id.toString(),
            email: createdUser.user_email,
            login: createdUser.user_login,
            createdAt: createdUser.user_created_at
          }
            return viewModel; // Возвращаем первого пользователя из результата (по идее, он один)

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
        await queryRunner.startTransaction();
    
        try {
            // Шаг 1: Найти user_id с указанным recoveryCode
            const recoveryInfo = await queryRunner.manager
                .createQueryBuilder(RecoveryPasswordInfoEntity, "rpi")
                .select("rpi.user_id")
                .where("rpi.code_for_recovery = :recoveryCode", { recoveryCode })
                .getOne();
    
            if (!recoveryInfo) {
                await queryRunner.rollbackTransaction();
                return false; // Код восстановления не найден
            }
    
            // Шаг 2: Обновить пароль пользователя с найденным user_id
            const result = await queryRunner.manager
                .createQueryBuilder()
                .update(AccountUserDataEntity)
                .set({
                    password_hash: passwordHash,
                    password_salt: passwordSalt,
                })
                .where("id = :userId", { userId: recoveryInfo.user_id })
                .execute();
    
            await queryRunner.commitTransaction();
            return result.affected > 0; // Возвращает true, если хотя бы одна строка обновлена
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(error);
            return false;
        } finally {
            await queryRunner.release();
        }
    }
    
    
    async deleteUser(id: string): Promise<boolean> {
        try {
            const result = await this.dataSource
                .createQueryBuilder()
                .delete()
                .from(UserEntity)
                .where("id = :id", { id })
                .execute();
    
            // Проверяем, был ли удален один пользователь
            return result.affected === 1; // Возвращает true, если удалена одна строка
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }
    
    async banUser(id: string, reason: string, isBanned: boolean): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const result = await queryRunner.query(
                `UPDATE ban_info
                 SET is_banned = $1, ban_date = $2, ban_reason = $3
                 WHERE user_id = $4`,
                [isBanned, isBanned ? new Date().toISOString() : null, isBanned ? reason : null, id]
            );
            return result[1] > 0;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            await queryRunner.release();
        }
    }
    
    async checkBanStatus(userId: string | null, blogId: string | null): Promise<boolean | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            if (userId) {
                const result = await queryRunner.query(
                    `SELECT is_banned FROM ban_info WHERE user_id = $1`, [userId]
                );
                return result[0]?.is_banned ?? null;
            } else if (blogId) {
                const result = await queryRunner.query(
                    `SELECT bi.is_banned
                     FROM ban_info bi
                     JOIN blogs b ON bi.user_id = b.user_id
                     WHERE b.id = $1`,
                    [blogId]
                );
                return result[0]?.is_banned ?? null;
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        } finally {
            await queryRunner.release();
        }
    }
    

    // Основная часть закончена, вспомогательные эндпоинты
    async confirmationEmail(userId: string, code: string): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            // Обновляем сразу два поля в одной транзакции
            await queryRunner.manager
                .createQueryBuilder()
                .update(EmailConfirmationEntity)
                .set({ 
                    activated_status: true,
                    code_for_activated: null // Ставим null т.к активация произошла и далее будем отдавать 400 
                })
                .where("user_id = :userId", { userId })
                .execute();
    
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
    
    async counterAttemptConfirm(ip: string): Promise<boolean> {
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
    
    async counterAttemptEmail(ip: string): Promise<boolean> {
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
    
    async counterAttemptRecoveryPassword(ip: string): Promise<boolean> {
        const dateThreshold = sub(new Date(), { seconds: 10 });
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
    
        try {
            const count = await queryRunner.manager
                .createQueryBuilder(RecoveryPasswordEntity, 'recovery_password')
                .where('recovery_password.ip = :ip', { ip })
                .andWhere('recovery_password.email_send_date > :dateThreshold', { dateThreshold })
                .getCount();
    
            return count <= 5;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            await queryRunner.release();
        }
    }
    
    async counterAttemptNewPassword(ip: string): Promise<boolean> {
        const dateThreshold = sub(new Date(), { seconds: 10 });
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
    
        try {
            const result = await queryRunner.manager
                .createQueryBuilder(NewPasswordEntity, 'new_password') // предполагаемое название сущности
                .where('new_password.ip = :ip', { ip })
                .andWhere('new_password.timestamp_new_password > :dateThreshold', { dateThreshold })
                .getCount();
    
            return result <= 5;
        } catch (error) {
            return false;
        } finally {
            await queryRunner.release();
        }
    }
    
async passwordRecovery(userId: string, code: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const result = await queryRunner.manager
            .createQueryBuilder()
            .update(RecoveryPasswordInfoEntity)
            .set({ code_for_recovery: code })
            .where("user_id = :userId", { userId })
            .execute();
        await queryRunner.commitTransaction();
        return result.affected > 0; // Проверка, были ли затронуты строки
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error(error);
        return false;
    } finally {
        await queryRunner.release();
    }
}

    

    // Эндпоинты для поиска по определенным условиям
    async findUserByEmail(email: string): Promise<UserEntity | null> {
        try {
            const foundUser: UserEntity = await this.dataSource
            .getRepository(UserEntity)
            .createQueryBuilder('user')
            .where('user.email = :email', {email})
            .getOne()

            return foundUser
        } catch (error) {
            return null
        }
    }
    async findUserById(userId: string): Promise<UserEntity | null> {
        try {
            const foundUser: UserEntity = await this.dataSource
            .getRepository(UserEntity)
            .createQueryBuilder('user')
            .where('user.id = :id', {userId})
            .getOne()

            return foundUser
        } catch (error) {
            return null
        }
    }
    async findUserByLogin(login: string): Promise<UserEntity | null> {
        try {
            const foundUser: UserEntity = await this.dataSource
            .getRepository(UserEntity)
            .createQueryBuilder('user')
            .where('user.login = :login', {login})
            .getOne()

            return foundUser
        } catch (error) {
            return null
        }

    }


    async findUserByLoginForMe(login: string): Promise<UserEntity | null> {
        try {
            const result = await this.dataSource
                .getRepository(UserEntity)
                .createQueryBuilder('user')
                .where('user.login = :login', { login })
                .getOne();
    
            return result || null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    
    async findUserByConfirmationCode(code: string): Promise<UserEntity | null> {
        try {
            const result = await this.dataSource
                .getRepository(UserEntity)
                .createQueryBuilder('u')
                .innerJoinAndSelect('u.email_confirmation', 'ec')
                .where('ec.code_for_activated = :code', { code })
                .getOne();
    
            return result || null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    
    async refreshActivationCode(userId: string, newCode: string): Promise<boolean> {
        try {
            const result = await this.dataSource
                .getRepository(EmailConfirmationEntity)
                .createQueryBuilder()
                .update(EmailConfirmationEntity)
                .set({ code_for_activated: newCode })
                .where("user_id = :userId", { userId })
                .execute();
    
            return result.affected > 0;
        } catch (error) {
            console.error(error);
            return false;
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
}