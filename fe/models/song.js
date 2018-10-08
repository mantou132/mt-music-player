const test = [];
for (let i = 0; i < 1000; i += 1) {
  test.push({
    id: i,
    title: `Song Title ${i}`,
    duration: 180 + Math.floor(120 * Math.random()),
    albumId: i,
    artistId: i,
    publishYear: 2014,
    createTime: Date.now(),
    updateTime: Date.now(),
    src: 'https://axinga.xyz/take%20me%20hand.mp3',
  });
}

export default {
  list: test,
};
