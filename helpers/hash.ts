import * as argon2 from "argon2";

async function hash(password: string) {
    let answer;
    answer = await argon2.hash(password)
}
async function verify(hash: string, password: string) {
    let match;
    match = await argon2.verify(hash, password)
}

module.exports = {
    hashPassword: hash,
    verifyPassword: verify
}