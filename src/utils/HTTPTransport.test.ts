/* eslint-disable no-unused-expressions */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import { spy, stub } from 'sinon'
import { HTTPTransport } from './HTTPTransport'

function getMockXMLHttpRequest({
  response,
  status,
  statusText,
  headers,
}: {
  response: string
  status: number
  statusText: string
  headers: string
}) {
  const events: {
    [index: string]: () => void
    abort: () => void
    error: () => void
    timeout: () => void
    load: () => void
  } = {
    abort: () => {
      throw new Error('Событие abort не прослушивается')
    },
    error: () => {
      throw new Error('Событие error не прослушивается')
    },
    timeout: () => {
      throw new Error('Событие timeout не прослушивается')
    },
    load: () => {
      throw new Error('Событие load не прослушивается')
    },
  }
  const instanceXhr = {
    response,
    status,
    statusText,
    withCredentials: false,
    open: stub(),
    setRequestHeader: stub(),
    getAllResponseHeaders: () => headers,
    addEventListener: spy((eventName: string, callback: () => void) => {
      events[eventName] = callback
    }),
    send: stub(),
  }
  const mockXMLHttpRequest = stub().returns(instanceXhr)
  global.XMLHttpRequest = mockXMLHttpRequest as any
  return { instanceXhr, mockXMLHttpRequest, events }
}

describe('HTTPTransport', () => {
  const OkResponse = {
    response: JSON.stringify({ test: 'data' }),
    status: 200,
    statusText: 'Ok',
    headers: 'content-type: application/json',
  }

  describe('.get()', () => {
    it('должен отправлять GET запрос на url http://localhost:123/test', (done) => {
      const transport = new HTTPTransport('http://localhost:123')
      const mock = getMockXMLHttpRequest(OkResponse)

      transport
        .get('/test')
        .then(() => done())
        .catch(done)
      mock.events.load()

      expect(
        mock.instanceXhr.open.calledWith('GET', 'http://localhost:123/test')
      ).to.be.true
    })

    it('должен отправлять GET запрос на url http://localhost:123/test?request=data', (done) => {
      const transport = new HTTPTransport('http://localhost:123')
      const mock = getMockXMLHttpRequest(OkResponse)

      transport
        .get('/test', { param: { request: 'data' } })
        .then(() => done())
        .catch(done)
      mock.events.load()

      expect(
        mock.instanceXhr.open.calledWith(
          'GET',
          'http://localhost:123/test?request=data'
        )
      ).to.be.true
    })

    it('должен возвращать ответ сервера в виде объекта есть есть заголовок application/json', (done) => {
      const transport = new HTTPTransport('http://localhost:123')
      const mock = getMockXMLHttpRequest(OkResponse)

      transport
        .get('/test', { param: { request: 'data' } })
        .then((result) => {
          expect(result.data).to.deep.equal({ test: 'data' })
          done()
        })
        .catch(done)
      mock.events.load()
    })

    it('должен возвращать заголовки ответа', (done) => {
      const transport = new HTTPTransport('http://localhost:123')
      const mock = getMockXMLHttpRequest(OkResponse)

      transport
        .get('/test', { param: { request: 'data' } })
        .then((result) => {
          expect(result.headers).to.deep.equal({
            'content-type': 'application/json',
          })
          done()
        })
        .catch(done)
      mock.events.load()
    })

    it('должен возвращать статус код ответа', (done) => {
      const transport = new HTTPTransport('http://localhost:123')
      const mock = getMockXMLHttpRequest(OkResponse)

      transport
        .get('/test', { param: { request: 'data' } })
        .then((result) => {
          expect(result.status).to.be.equal(200)
          done()
        })
        .catch(done)
      mock.events.load()
    })

    it('должен возвращать текст кода статуса ответа', (done) => {
      const transport = new HTTPTransport('http://localhost:123')
      const mock = getMockXMLHttpRequest(OkResponse)

      transport
        .get('/test', { param: { request: 'data' } })
        .then((result) => {
          expect(result.statusText).to.be.equal('Ok')
          done()
        })
        .catch(done)
      mock.events.load()
    })
  })

  describe('.post()', () => {
    it('должен отправлять POST запрос на url http://localhost:123/test', (done) => {
      const transport = new HTTPTransport('http://localhost:123')
      const mock = getMockXMLHttpRequest(OkResponse)

      transport
        .post('/test')
        .then(() => done())
        .catch(done)
      mock.events.load()

      expect(
        mock.instanceXhr.open.calledWith('POST', 'http://localhost:123/test')
      ).to.be.true
    })

    it('должен использовать Cookies', (done) => {
      const transport = new HTTPTransport('http://localhost:123')
      const mock = getMockXMLHttpRequest(OkResponse)

      transport
        .post('/test')
        .then(() => done())
        .catch(done)
      mock.events.load()

      expect(mock.instanceXhr.withCredentials).to.be.true
    })

    it('должен устанавливать заголовок content-type: application/json если отправляются данные', (done) => {
      const transport = new HTTPTransport('http://localhost:123')
      const mock = getMockXMLHttpRequest(OkResponse)

      transport
        .post('/test', { param: { data: 'send' } })
        .then(() => done())
        .catch(done)
      mock.events.load()

      expect(
        mock.instanceXhr.setRequestHeader.calledWith(
          'Content-Type',
          'application/json'
        )
      ).to.be.true
    })

    it('не должен устанавливать заголовки если отправляется FormData', (done) => {
      const transport = new HTTPTransport('http://localhost:123')
      const mock = getMockXMLHttpRequest(OkResponse)

      const param = new new JSDOM().window.FormData()

      transport
        .put('/test', { param })
        .then(() => done())
        .catch(done)
      mock.events.load()

      expect(mock.instanceXhr.setRequestHeader.notCalled).to.be.true
    })
  })

  describe('.put()', () => {
    it('должен отправлять PUT запрос на url http://localhost:123/test', (done) => {
      const transport = new HTTPTransport('http://localhost:123')
      const mock = getMockXMLHttpRequest(OkResponse)

      transport
        .put('/test')
        .then(() => done())
        .catch(done)
      mock.events.load()

      expect(
        mock.instanceXhr.open.calledWith('PUT', 'http://localhost:123/test')
      ).to.be.true
    })
  })

  describe('.path()', () => {
    it('должен отправлять PATCH запрос на url http://localhost:123/test', (done) => {
      const transport = new HTTPTransport('http://localhost:123')
      const mock = getMockXMLHttpRequest(OkResponse)

      transport
        .patch('/test')
        .then(() => done())
        .catch(done)
      mock.events.load()

      expect(
        mock.instanceXhr.open.calledWith('PATCH', 'http://localhost:123/test')
      ).to.be.true
    })
  })

  describe('.delete()', () => {
    it('должен отправлять DELETE запрос на url http://localhost:123/test', (done) => {
      const transport = new HTTPTransport('http://localhost:123')
      const mock = getMockXMLHttpRequest(OkResponse)

      transport
        .delete('/test')
        .then(() => done())
        .catch(done)
      mock.events.load()

      expect(
        mock.instanceXhr.open.calledWith('DELETE', 'http://localhost:123/test')
      ).to.be.true
    })
  })
})
