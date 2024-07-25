// import {defaultExport, bar, foo} from '../src/signUp/foo-bar-baz';
import {expect, jest, test} from '@jest/globals';

export function mockedBaz (){
    return bar() + ' mocked baz'
}

jest.unstable_mockModule('../src/signUp/foo-bar-baz', () => ({
    defaultExport: jest.fn(()=>mockedBaz()),
    foo : 'mocked foo',
    bar : jest.fn(()=>'mocked')

}));
const {defaultExport, bar, foo} = await import('../src/signUp/foo-bar-baz');


test('should do a partial mock', () => {
    const defaultExportResult = defaultExport();
    expect(defaultExportResult).toBe('mocked mocked baz');
    expect(defaultExport).toHaveBeenCalled();
    expect(foo).toBe('mocked foo');
});



