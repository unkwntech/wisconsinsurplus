/*
    This uses declaration merging to make the required properties avaialbe under
    process.env and ensure that they are typed correctly.
    
    https://www.typescriptlang.org/docs/handbook/declaration-merging.html
*/
namespace NodeJS {
    export interface ProcessEnv {
        SEARCH_INTERVAL: string;
        AUCTION_ALERT_LIMIT: string;
        DB_CONN_STRING: string;
        DB_NAME: string;
    }
}
