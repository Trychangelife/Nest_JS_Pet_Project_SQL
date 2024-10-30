// auth.e2e-spec.ts
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { response } from 'express';
import cookieParser from 'cookie-parser'

describe('Auth flow (e2e)', () => {
    let app: INestApplication;
    let accessToken: string = ''
    let refreshToken: string = ''
    let oldRefreshToken: string = ''

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.use(cookieParser());
        await app.init();
        
    });

    afterAll(async () => {
        await app.close();
    });

    it('Очищаем базу данных для тестов', async () => {
        const response = await request(app.getHttpServer()).delete(
            '/testing/all-data',
        );
        expect(response.status).toBe(204);
    });

    it('Осуществляем регистрацию юзера', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/registration')
            .send({
                login: 'admin',
                password: 'qwerty',
                email: 'test@bk.ru'
            })
            .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64')) // Basic auth
            .expect(204);
    });

    it('Запрос в базу данных, проверяем что ранее созданный юзер соответствует ожиданиям', async () => {
        const response = await request(app.getHttpServer())
            .get('/users')
            .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64')) // Basic auth
            .expect(200)


        expect(response.body.items[0]).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                login: 'admin',
                email: 'test@bk.ru',
                createdAt: expect.any(String)
            }))
    })

    it('Login - получаем Access и Refresh токены', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                loginOrEmail: 'admin',
                password: 'qwerty',
            })
            .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64')) // Basic auth
            .expect(200);

    // Получаем значение заголовка Set-Cookie и преобразуем его в массив
    const cookies = response.headers['set-cookie'];
    const cookiesArray = Array.isArray(cookies) ? cookies : [cookies];

    // Находим cookie с refreshToken и извлекаем только значение токена
    const refreshTokenCookie = cookiesArray.find((cookie: string) =>
        cookie.startsWith('refreshToken='),
    );
    expect(refreshTokenCookie).toBeDefined();
    expect(response.body.accessToken).toEqual(expect.any(String))

    refreshToken = refreshTokenCookie
    oldRefreshToken = refreshTokenCookie

    expect(refreshToken).toBeDefined(); // Проверяем, что токен успешно извлечен
    accessToken = response.body.accessToken;

    });

    it('Производим Logout, отзываем токен', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/logout')
                .set('Cookie', refreshToken)
                .send();

            expect(response.status).toBe(204);

    });

    it('Пробуем залогиниться под отозванным токеном и ожидаем 401', async () => {

            const response = await request(app.getHttpServer())
                .post('/auth/refresh-token')
                .set('Cookie', refreshToken)
                .send();

            expect(response.status).toBe(401);

    });
    
});
