
it.skip("should test something", ( ) => {
    expect(true).toBe(true);
})

it.skip("should test objects and array equality", () => {
    expect({foo:'foo'}).toEqual({ foo: 'foo'})
    expect({foo:'foo'}).not.toEqual({ foo: 'bar'})
    
    expect({foo: 'foo'}).toEqual({ "foo": "foo"})
    expect({foo: ['foo']}).toEqual({ "foo": ["foo"]})

    expect({foo: ['foo', 'bar']}).toEqual({ "foo": ["foo", "bar"]})

    // shite. the order of something in an array is also important.
    // you cannot do this:
    // expect({foo: ['bar', 'foo']}).toEqual({ "foo": ["foo", "bar"]})
    // expect({foo: [{bar: 'bar'}, {foo:'foo'}]}).toEqual({ "foo": [{foo: "foo"}, {bar:"bar"}]})

    // but the random order in an object works fine.
    // like these:
    expect({bar:'bar', foo: 'foo'}).toEqual({ foo: 'foo', bar: 'bar'});
    expect({bar:'bar', foo: 'foo', baz: ['baz', 'inga']}).toEqual({ foo: 'foo', baz: ['baz', 'inga'], bar: 'bar'});

})

// this thing is called regardless whether each test succeed or failed
afterEach( () => {
    // console.log('ran an `it()` test');
    // cleanup()
})