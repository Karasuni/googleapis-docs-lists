"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const fs = require('fs').promises;
const readline = require('readline');
class DRIVE {
    constructor(DOC_ID) {
        this.DOC_ID = DOC_ID;
        this.SCOPES = ['https://www.googleapis.com/auth/documents'];
    }
    async getCredentials() {
        if (!this.CREDENTIALS)
            this.CREDENTIALS = JSON.parse(await fs.readFile('credentials.json'));
        return this.CREDENTIALS;
    }
    async getToken() {
        // Get token from memory, from file or generate
        if (!this.TOKEN)
            this.TOKEN = await (fs.readFile('token.json')
                .then(token => JSON.parse(token))
                .catch((err) => this.getNewToken(this.AUTH)));
        return this.TOKEN;
    }
    async getNewToken(oAuth2Client) {
        return new Promise((resolve, reject) => {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: this.SCOPES,
            });
            console.log('Authorize this app by visiting this url:', authUrl);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                oAuth2Client.getToken(code, (err, token) => {
                    if (err)
                        return console.error('Error retrieving access token', err);
                    // Store the token to disk for later program executions
                    fs.writeFile('token.json', JSON.stringify(token));
                    resolve(token);
                });
            });
        });
    }
    async getAuth() {
        if (!this.AUTH) {
            const credentials = await this.getCredentials();
            const { client_secret, client_id, redirect_uris } = credentials.installed;
            this.AUTH = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            this.AUTH.setCredentials(await this.getToken());
        }
        return this.AUTH;
    }
    async getDocs() {
        if (!this.DOCS)
            this.DOCS = googleapis_1.google.docs({ version: 'v1', auth: await this.getAuth() });
        return this.DOCS;
    }
    async getDoc() {
        return (await (await this.getDocs()).documents.get({ documentId: this.DOC_ID })).data;
    }
    async applyUpdates(requests) {
        return await (await this.DOCS).documents.batchUpdate({ documentId: this.DOC_ID, requestBody: { requests } });
    }
    async endOfDocument() {
        const content = (await this.getDoc()).body.content;
        return content[content.length - 1].endIndex;
    }
}
exports.DRIVE = DRIVE;
//# sourceMappingURL=drive-service.js.map