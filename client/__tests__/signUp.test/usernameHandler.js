import {usernameHandler} from '../../src/signUp/helper'
import {expect, jest} from '@jest/globals';

// import fetchMock from "jest-fetch-mock";
// fetchMock.enableMocks();

// manual mocking fetch
// global.fetch = jest.fn(() =>
//     Promise.resolve({
//       status: 200,
//       json: () => Promise.resolve({success: true, rates: { 'TEST': 'TEST' } }),
//     })
// );

// afterEach(() => {
//     fetch.mockClear();
//     fetch.mockImplementationOnce(() => 
//         Promise.resolve({
//           status: 400,
//           json: () => Promise.resolve({ success: false, error: 'Something bad happened' }),
//         })
//     )
// });

describe.skip('usernameHandler is calling fetch', ()=>{
    
    it('fatch is called', ()=>{
        usernameHandler('urosSSS')
        expect(fetch).toHaveBeenCalled()
    })

    it('fetch reject status 401 path', async()=>{
        await usernameHandler('uros')
        expect(fetch).toHaveBeenCalled()
    })
})

describe('live test to end point',()=>{
    it('THIS IS LIVE', async()=>{
        await usernameHandler('uros')
    })
})