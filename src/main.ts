import axios, { AxiosResponse } from "axios";
import { parse } from "node-html-parser";
import { DbUtilities } from "./db-utils";
import auction from "./models/auction";
import keywords from "./models/keywords";

//load variables from .env
require("dotenv").config();

//const keywords = ["dell", "hp", "lenovo", "firetruck", "server", "rack"];

setInterval(doSearch, parseInt(process.env.SEARCH_INTERVAL));

async function doSearch() {
    let newAuctions: auction[] = [];

    let searchterms: keywords = await DbUtilities.QueryOne(
        { _id: "keywords" },
        keywords.getFactory()
    );

    let knownAuctions: auction[] = await DbUtilities.ProjectedQuery(
        {},
        auction.getFactory().getCollectionName(),
        { id: 1 }
    );

    for (let keyword of searchterms.keywords) {
        let response = await axios.get(
            `https://bid.wisconsinsurplus.com/Public/GlobalSearch/GetGlobalSearchResults?pageNumber=1&pagesize=100&filter=Current&sortBy=enddate_asc&search=${keyword}&_=${new Date().getTime()}`
        );
        let items = parseItems(response);

        newAuctions = newAuctions.concat(
            items.filter((f) => !knownAuctions.find((k) => k._id == f._id))
        );
    }

    if (newAuctions.length > 0) sendNotification(newAuctions);
}

function parseItems(response: AxiosResponse<any, any>) {
    let items = [];
    const root = parse(response.data);
    for (let item of root.querySelectorAll(".Auction-item-list")) {
        let id = parseInt(
            item
                .querySelector(".Itemlist-Lottitle a")
                ?.innerText.split("-")[1]
                .trim() ?? ""
        );

        let title =
            item.querySelector(".auction-Itemlist-Title")?.innerText.trim() ??
            "";

        let url =
            "https://bid.wisconsinsurplus.com/" +
                item
                    .querySelector(".Itemlist-Lottitle a")
                    ?.attributes.href.trim() ?? "";

        items.push(new auction({ id, title, url }));
    }
    return items;
}

async function sendNotification(auctions: auction[]) {
    auctions.forEach((a, i) => {
        DbUtilities.Insert(a, auction.getFactory());
    });

    axios
        .post(
            "https://discord.com/api/webhooks/1076209765048393830/dEFpjRlCJ5xdHMD_hbuHIoEP4oc97K3vHSw358hzT9jmcyzmwD2ByLJ4VvP8-tpMeKX6",
            {
                embeds: auctions
                    .flatMap((auction) => auction.toEmbed())
                    .splice(0, parseInt(process.env.AUCTION_ALERT_LIMIT)),
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .catch(console.error);
}

function exitHandler(options: any, code: number) {}

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));

doSearch();
