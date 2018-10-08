const test = [];
for (let i = 0; i < 1000; i += 1) {
  test.push({
    id: i,
    name: `Artist Name ${i}`,
    photo: 'https://p3.music.126.net/F9asgcj7C7qSl_je9XDvRw==/603631883675241.jpg?param=130y130',
  });
}

export default {
  list: test,
};
