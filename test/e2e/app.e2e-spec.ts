import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { INestApplication } from '@nestjs/common'

const provision = {
  text: '18b9f834-380e-49b5-ad26-217d76dcf5d0',
  image: '26a42e72-cc93-44b3-acae-01537a36322b',
  pdf: '7acff1c5-4c43-4923-a323-d22a12573041',
  link: '6969d6c7-40ea-4a3c-b635-d6546b971304',
  video: 'd060ab17-c961-4de7-929f-a0d52aa3ecf4',
}

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMThjMzdjZTItY2QzNC00MzA1LTljYTQtYzE1ZmM3MzZiZWFjIn0.pqWRiyQuvWRVQgIzKvQ85RrBwSF5KxeGZrkFvKt2CG8'

const gql = '/graphql'

describe('GraphQL AppResolver (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe(gql, () => {
    describe('provision', () => {
      describe('GET Provision', () => {
        it('should get a single provision type TEXT', () => {
          return request(app.getHttpServer())
            .post(gql)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
              query: `
              {
                provision(content_id: "${provision.text}") {
                  type
                  format
                }
              }`,
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.data.provision).toEqual({
                format: 'docx',
                type: 'text',
              })
            })
        })
        it('should get a single provision type IMAGE', () => {
          return request(app.getHttpServer())
            .post(gql)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
              query: `
              {
                provision(content_id: "${provision.image}") {
                  type
                  format
                }
              }`,
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.data.provision).toEqual({
                format: 'png',
                type: 'image',
              })
            })
        })
        it('should get a single provision type PDF', () => {
          return request(app.getHttpServer())
            .post(gql)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
              query: `
              {
                provision(content_id: "${provision.pdf}") {
                  type
                  format
                }
              }`,
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.data.provision).toEqual({
                format: 'pdf',
                type: 'pdf',
              })
            })
        })
        it('should get a single provision type LINK', () => {
          return request(app.getHttpServer())
            .post(gql)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
              query: `
              {
                provision(content_id: "${provision.link}") {
                  type
                  format
                }
              }`,
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.data.provision).toEqual({
                format: null,
                type: 'link',
              })
            })
        })
        it('should get a single provision type VIDEO', () => {
          return request(app.getHttpServer())
            .post(gql)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
              query: `
              {
                provision(content_id: "${provision.video}") {
                  type
                  format
                }
              }`,
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.data.provision).toEqual({
                format: 'mp4',
                type: 'video',
              })
            })
        })
      })
    })
  })
})
