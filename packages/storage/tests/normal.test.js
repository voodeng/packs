import storage from '../main.js'

function sum(a, b) {
  return a + b
}

const APromise = func => {
  return new Promise(resolve => {
    resolve(func)
  })
}

const now = new Date().getTime()

const mockData = {
  time: now,
  string: 'mock string',
  object: { one: 'asx', two: { key: 'value' } },
  array: ['a', 'b', 1, '0'],
  list: [{ name: 'one' }, { name: 'two' }]
}

beforeEach(() => {
  localStorage.setItem('mock', JSON.stringify(mockData))
})

describe('localStorage Mock', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
  })

  it('mock promise get', () => {
    return APromise(localStorage.getItem('mock')).then(rs => {
      expect(rs).toBe(JSON.stringify(mockData))
      // expect(JSON.parse(rs).time).toEqual(mockData.time)
    })
  })
})

describe('storage promise config', () => {
  const s1 = storage

  it('storage function not null', () => {
    expect(s1.f).not.toBeNull()
  })

  it('get is function', () => {
    expect(s1.get).toBeInstanceOf(Function)
  })

  it('promise get', () => {
    expect(s1.get('mock')).resolves.not.toBeNull()
    // expect(s1.get('mock')).resolves.toBe(Object)
    s1.get('mock').then(rs => {
      expect(rs).toEqual(mockData)
    })
  })

  it('set string', () => {
    let init = 'is a string'
    s1.set('st', init)
    expect.assertions(1)
    return expect(s1.get('st')).resolves.toBe(init)
  })

  it('set object', () => {
    let init = { a: 'is a object' }
    s1.set('st', init)
    expect.assertions(1)
    return expect(s1.get('st')).resolves.toEqual(init)
  })

  it('clear and get call undefined', () => {
    s1.clear()
    expect.assertions(1)
    return expect(s1.get('st')).resolves.toBeUndefined()
  })
})
