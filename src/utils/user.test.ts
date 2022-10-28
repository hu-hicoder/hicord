import { describe, expect, test } from 'vitest'
import { isUserName } from './user'

describe('user type guard', () => {
  test('isUserName', () => {
    expect(isUserName({ userName: 'name' })).true
    expect(isUserName({ userName: '' })).true
    expect(isUserName({ userName: 1 })).false
    expect(isUserName({ userNam: 'name' })).false
    expect(isUserName({ userName: 'name', a: '' })).false
    expect(isUserName({})).false
    expect(isUserName(1)).false
    expect(isUserName([{ userName: 'name' }])).false
  })
})
