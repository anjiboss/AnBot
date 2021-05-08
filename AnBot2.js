require("dotenv").config();
//Server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

//Discord
const Discord = require("discord.js");
const client = new Discord.Client();
new Discord.MessageAttachment();
const ytDownload = require("ytdl-core");
const youtubeSearch = require("youtube-search-api");
// import { command } from "./content";
const content = require("./content");

// Search Youtube for ID
const getYoutubeInfo = async (keyword) => {
  console.log(keyword);
  const res = await youtubeSearch.GetListByKeyword(keyword, false);
  // console.log(res.items[0]);
  return res.items[0];
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}!`);
});
client.on("userUpdate", (e) => {
  console.log(e);
});

client.on("message", async (msg) => {
  if (msg.content === "ping") {
    msg.channel.send("!hello");
    msg.channel.send("!inspire");
  }
  if (msg.content == "!help") {
    msg.channel.send(content.command());
  }
  if (msg.content.split(" ")[0] === "!music") {
    if (msg.member.voice.channel) {
      let curVol = 0.5;
      const connection = await msg.member.voice.channel.join();
      //Get the inputed Video name:
      let keyword = msg.content.split(msg.content.split(" ")[0])[1];
      let videoInfo = await getYoutubeInfo(keyword);
      const dispatcher = connection.play(
        ytDownload(`https://www.youtube.com/watch?v=${videoInfo.id}`, {
          filter: "audioonly",
        }),
        { volume: curVol }
      );

      msg.channel.send(
        `Playing\n https://www.youtube.com/watch?v=${videoInfo.id}`
      );

      dispatcher.on("finish", () => {
        console.log("finished");
      });

      client.on("message", (msg) => {
        // STOP THE MUSIC
        if (msg.content === "!stop") {
          dispatcher.destroy();
        }

        // if (msg.content === "!resume") {
        //   dispatcher.resume();
        //   console.log(dispatcher.paused);
        // }

        //MUSIC STATUS FOR TESTING
        if (msg.content === "!status") {
          console.log(dispatcher.paused);
          msg.channel.send(`Current Volume: ${curVol}`);
        }
        //VOLUME UP
        if (msg.content === "!volup") {
          if (curVol < 1) {
            curVol = Math.trunc(curVol + 0.2);
            dispatcher.setVolume(curVol);
            msg.channel.send(
              `Turned Volume Up. Current Volume : ${curVol * 100}`
            );
          } else {
            msg.channel.send("The Volume is maximum");
          }
        }
        //VOLUME DOWN
        if (msg.content === "!voldown") {
          if (curVol > 0) {
            curVol = curVol - 0.2;
            dispatcher.setVolume(curVol);
            msg.channel.send(
              `Turned Volume down. Current Volume : ${curVol * 100}`
            );
          } else {
            msg.channel.send("The Volume is minimun");
          }
        }
      });
    } else {
      msg.channel.send("You Need To Join A Server First :wink:");
    }
  }
});

client.login(process.env.TOKEN);

app.get("/", (req, res) => res.send(`You are home now`));

app.listen(PORT, () => console.log(`Runing on ${PORT}`));
