const ytDownload = require("ytdl-core");
const youtubeSearch = require("youtube-search-api");

// Search Youtube for ID
const getYoutubeInfo = async (keyword) => {
  console.log(keyword);
  const res = await youtubeSearch.GetListByKeyword(keyword, false);
  // console.log(res.items[0]);
  return res.items[0];
};

const playYt = async (connection, msg, keyword, curVol) => {
  let videoInfo = await getYoutubeInfo(keyword);

  const dispatcher = connection.play(
    ytDownload(`https://www.youtube.com/watch?v=${videoInfo.id}`, {
      filter: "audioonly",
    }),
    { volume: curVol }
  );

  msg.channel.send(`Playing\n https://www.youtube.com/watch?v=${videoInfo.id}`);
  return dispatcher;
};

module.exports = playYt;
