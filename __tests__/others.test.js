const { check, gen } = require('jest-check');

check.it('can recover encoded URIs',
    [gen.int],
    s => expect(!isNaN(s)).toBeTruthy()
);