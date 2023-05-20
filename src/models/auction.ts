import Factory from "./factory";
import { Identifiable } from "./identifiable";
export default class auction implements Identifiable {
    public _id: number;
    public title: string;
    public url: string;

    public constructor(json: any) {
        this._id = json._id ?? parseInt(json.id);
        this.title = json.title;
        this.url = json.url;
    }

    static getFactory(): Factory<auction> {
        return new (class implements Factory<auction> {
            make(json: any): auction {
                return new auction(json);
            }
            getCollectionName(): string {
                return "auctions";
            }
        })();
    }

    public toEmbed(): object[] {
        return [
            {
                color: 7419530,
                title: "New Auction",
                description: this.title,
                url: this.url,
                fields: [],
            },
        ];
    }
}
