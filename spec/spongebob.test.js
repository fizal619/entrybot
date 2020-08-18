const spongebob = require('../routes/spongebob');

test('expect a imgflip link to be returned', () => {
  expect.assertions(1);
  return spongebob(['','','This is a test']).then(result => {
    expect(/(i.imgflip.com).+(\.jpg)/.test(result)).toBe(true);
  });
});

test('text supplied should return no link if >25 chars', () => {
  expect.assertions(1);
  return spongebob(['','','This is a test it hink this is longer than 25']).then(result => {
    expect(result).toEqual('Sorry, that\'s to long for me to read 😂');
  });
});