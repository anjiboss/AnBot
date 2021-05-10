require("dotenv").config();
//Server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

//Discord
const Discord = require("discord.js");
const client = new Discord.Client();

const content = require("./content");
const playYt = require("./utils/playYt");

// GLOBAL VARIABLE
let queue = [];
let curPlay = 0;
let isPlaying = false;
//

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}!`);
});
client.on("userUpdate", (e) => {
  console.log(e);
});

client.on("message", async (msg) => {
  if (msg.content === "ping") {
    msg.channel.send("pong ");
    msg.channel.send(":wink:");
  }
  if (msg.content == "!help") {
    msg.channel.send(content.command());
  }

  // TESTING MESSAGE EMBED
  if (msg.content === "!test") {
    const embed = new Discord.MessageEmbed()
      // Set the title of the field
      .setTitle("Anji's Facebook")
      // Set the color of the embed
      .setColor(0xff0000)
      .setURL("https://www.facebook.com/anjitakashi");
    // Set the main content of the embed
    msg.channel.send(embed);
  }

  // PLAY MUSIC
  if (msg.content.split(" ")[0] === "!music") {
    if (msg.member.voice.channel) {
      let keyword = msg.content.split(msg.content.split(" ")[0])[1];
      queue.push(keyword);

      if (isPlaying) {
        msg.channel.send(`queued next song ${keyword}`);
      } else {
        isPlaying = true;
        let curVol = 0.5;
        const connection = await msg.member.voice.channel.join();
        //Get the inputed Video name:
        const dispatcher = await playYt(
          connection,
          msg,
          queue[curPlay],
          curVol
        );
        curPlay++;
        dispatcher.on("finish", async () => {
          if (queue.length === curPlay) {
            isPlaying = false;
            msg.channel.send("finish");
          } else {
            const dispatcher = await playYt(
              connection,
              msg,
              queue[curPlay],
              curVol
            );
          }
        });

        client.on("message", (msg) => {
          // STOP THE MUSIC
          if (msg.content === "!stop") {
            isPlaying = false;
            queue = [];
            dispatcher.destroy();
          }

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
      }
    } else {
      msg.channel.send("You Need To Join A Channel First :wink:");
    }
  }
});

client.login(process.env.TOKEN);

app.get("/", (req, res) => res.send(`You are home now`));

app.listen(PORT, () => console.log(`Runing on ${PORT}`));
