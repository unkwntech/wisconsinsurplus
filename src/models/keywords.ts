import Factory from "./factory";
import { Identifiable } from "./identifiable";

export default class keywords implements Identifiable {
    public _id: string = "keywords";
    public keywords: string[];

    public constructor(json: any) {
        this.keywords = json.keywords;
    }

    static getFactory(): Factory<keywords> {
        return new (class implements Factory<keywords> {
            make(json: any): keywords {
                return new keywords(json);
            }
            getCollectionName(): string {
                return "config";
            }
        })();
    }
}
