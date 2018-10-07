const test = [];
for (let i = 0; i < 1000; i += 1) {
  test.push({
    id: i,
    title: `Albums Title ${i}`,
    artistId: i,
    publishYear: 2014,
    cover: 'https://p2.music.126.net/bQWhKSp88vIwo85OV1zpNA==/109951163466323994.jpg?param=140y140',
  });
}

export default {
  list: test,
};
