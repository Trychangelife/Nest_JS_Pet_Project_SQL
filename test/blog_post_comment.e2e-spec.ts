import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser'

describe('blog_post_comment', () => {
    let app: INestApplication;
    let accessToken: string = ''
    let refreshToken: string = ''
    let oldRefreshToken: string = ''
    let blogId: string = ''
    let postId: string = ''
    let commentId: string = ''

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

    it ('Создаем блог', async () => {
        const response = await request(app.getHttpServer())
        .post('/sa/blogs')
        .send({
            name:"new blog",
            websiteUrl:"https://someurl.com",
            description:"description"
        })
        .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64')) // Basic auth
        expect(201)

        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
            }))
        
        blogId = response.body.id
    })

    it ('Создаем пост на базе ранее созданного блога', async () => {
        const response = await request(app.getHttpServer())
        .post('/posts')
        .send({
            content: "new post content",
            shortDescription: "description",
            title: "title",
            blogId: blogId.toString()
        })
        .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64')); // Basic auth
    
    expect(response.status).toBe(201);
    
    expect(response.body).toEqual(
        expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String), // значение, переданное в запросе
            shortDescription: expect.any(String), // значение, переданное в запросе
            content: expect.any(String), // значение, переданное в запросе
            blogId: blogId.toString(),
            blogName: expect.any(String),
            createdAt: expect.any(String),
            extendedLikesInfo: {
                likesCount: expect.any(Number),
                dislikesCount: expect.any(Number),
                myStatus: expect.any(String),
                newestLikes: expect.any(Array) // массив может быть пустым или с элементами
            }
        })
    );
    
    postId = response.body.id;
    
    })
    
    it ('Создаем коммент на базе ранее созданного поста', async () => {
        const response = await request(app.getHttpServer())
        .post(`/posts/${postId}/comments`)
        .send({
            content: "new comment content",
        })
        .set('Cookie', refreshToken)
        .set('Authorization', 'Bearer ' + accessToken); // Bearer Auth
    
    expect(response.status).toBe(201);
    
    expect(response.body).toEqual(
        expect.objectContaining({
            id: expect.any(String),
            content: expect.any(String), // значение, переданное в запросе
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: expect.any(String)
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: expect.any(Number),
                dislikesCount: expect.any(Number),
                myStatus: expect.any(String),
            }
        })
    );
    
    commentId = response.body.id;
    console.log(
        'Коммент ID', commentId,
        'Пост ID', postId,
        'Блог ID', blogId)
    
    })



});   