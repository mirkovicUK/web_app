const proba = require('../cognito.js');

describe('proba', () => {
  it('tests are linked', () => {
    expect(proba()).toBe(true)
  })
})

describe('proba1', () => {  
    it('this is second it', ()=>{
      expect(true).toBe(true)
    })
  })