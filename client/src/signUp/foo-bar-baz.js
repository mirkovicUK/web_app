const foo = 'foo';
const bar = () => 'bar';
const defaultExport = () => {};
function mockedBaz (){
    return bar() + 'mocked baz'
}
export {foo, bar, defaultExport, mockedBaz}