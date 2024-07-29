import {usernameHandler} from '../../src/signUp/helper'
import {expect, jest, test} from '@jest/globals';

import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

// manual mocking fetch
// global.fetch = jest.fn(() =>
//     Promise.resolve({
//       status: 200,
//       json: () => Promise.resolve({rates: { CAD: 'TEST' } }),
//     })
// );

beforeEach(() => {
    fetch.mockClear();
});

describe('usernameHandler is calling fetch', ()=>{
    
    it('fatch is called', ()=>{
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
              status: 400,
              json: () => Promise.resolve({ success: false, error: 'Something bad happened' }),
            }).mockImplementationT
        )
        usernameHandler('uros')
        expect(fetch).toHaveBeenCalled()
    })

    it.skip('fetch reject status 401 path', async()=>{
        usernameHandler('uros')
        expect(fetch).toHaveBeenCalled()
    })
})

describe.skip('live test to end point',()=>{
    it('THIS IS LIVE', async()=>{
        await usernameHandler('uros')
    })
})