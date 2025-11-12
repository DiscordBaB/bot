class DBABDurationInputError extends Error {
    constructor(message) {
        super(message);
        this.name = "DBABDurationInputError";
        // You can add other custom properties here if needed
        this.statusCode = '-1'
    }
}