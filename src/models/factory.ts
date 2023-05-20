export default interface Factory<T> {
    make(json: any): T;
    getCollectionName(): string;
}
