const Discord = require("discord.js");
const config = require("./config.json");
const fetch = require("node-fetch");
const express = require("express");
const app = express();

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });

const SAM = "200823277797507073"
const CHANNEL = "959593784897835078";
const LERAN = "881665488789319762";
const port = process.env.PORT || 8080;

client.once("ready", async (evt) => {
    console.log("ready");
    let currentGPUs = 0;
    let currentRigs = 0;
    let prevGPUs = 0;
    let prevRigs = 0;

    setInterval(async() => {
        var url = "https://api2.hiveos.farm/api/v2/farms/1565141/stats";
        var auth = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkyLmhpdmVvcy5mYXJtIiwiaWF0IjoxNjQ4ODU0MDk4LCJleHAiOjE5NjU2ODI4OTgsIm5iZiI6MTY0ODg1NDA5OCwianRpIjo2MzA0NjE4Nywic3ViIjo2MzA0NjE4Nywicm1iIjp0cnVlfQ.5ntyiBDme5ma97aUXG4ctTH92-I_hI0otA6K6diNnA4";

        var options = {
            "headers": {
                "Authorization": auth
            }
        }

        try {
            var request = await fetch(url, options);
        
            var data = await request.json();

            let hiveInfo = data.stats;
            currentGPUs = hiveInfo.gpus_online;
            currentRigs = hiveInfo.rigs_online;
            console.log("current:", currentRigs, "prev:", prevRigs);
            console.log("current:", currentGPUs, "prev:", prevGPUs);
            if (currentGPUs < prevGPUs) {
                let sam = await client.users.fetch(SAM);
                sam.send("GPU went offline! " + String(currentGPUs) + " gpus online " + String(currentRigs) + " rigs online");

                let leran = await client.users.fetch(LERAN);
                leran.send("GPU went offline! " + String(currentGPUs) + " gpus online " + String(currentRigs) + " rigs online");
            }
            if (currentRigs < prevRigs) {
                let sam = await client.users.fetch(SAM);
                sam.send("Rig went offline! " + String(currentGPUs) + " gpus online " + String(currentRigs) + " rigs online");

                let leran = await client.users.fetch(LERAN);
                leran.send("Rig went offline! " + String(currentGPUs) + " gpus online " + String(currentRigs) + " rigs online");
            }
            prevGPUs = hiveInfo.gpus_online;
            prevRigs = hiveInfo.rigs_online;
        }
        catch (err) {
            console.error(error);
        }
        
    }, 1000 * 120)
    

})

client.login(config.BOT_TOKEN);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);