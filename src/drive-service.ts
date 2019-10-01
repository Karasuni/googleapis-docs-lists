import { docs_v1, google } from 'googleapis';
import { GetTokenResponse, OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
const fs = require('fs').promises;
const readline = require('readline');

export class DRIVE {

    private SCOPES = ['https://www.googleapis.com/auth/documents'];

    private CREDENTIALS;
    private TOKEN: Credentials;
    private AUTH: OAuth2Client;
    private DOCS: docs_v1.Docs;

    constructor(
        protected DOC_ID: string
    ) {
    }

    private async getCredentials() {
        if (!this.CREDENTIALS) this.CREDENTIALS = JSON.parse(await fs.readFile('credentials.json'));
        return this.CREDENTIALS;
    }

    private async getToken() {
        // Get token from memory, from file or generate
        if (!this.TOKEN) this.TOKEN = await (fs.readFile('token.json')
            .then(token => JSON.parse(token))
            .catch((err) => this.getNewToken(this.AUTH)));
        return this.TOKEN;
    }

    private async getNewToken(oAuth2Client): Promise<GetTokenResponse> {
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
                    if (err) return console.error('Error retrieving access token', err);
                    // Store the token to disk for later program executions
                    fs.writeFile('token.json', JSON.stringify(token));
                    resolve(token);
                });
            });
        });
    }

    private async getAuth() {
        if (!this.AUTH) {
            const credentials = await this.getCredentials();
            const {client_secret, client_id, redirect_uris} = credentials.installed;
            this.AUTH = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            this.AUTH.setCredentials(await this.getToken());
        }
        return this.AUTH;
    }

    private async getDocs() {
        if (!this.DOCS) this.DOCS = google.docs({version: 'v1', auth: await this.getAuth()});
        return this.DOCS;
    }

    async getDoc(): Promise<docs_v1.Schema$Document> {
        return (await (await this.getDocs()).documents.get({documentId: this.DOC_ID})).data;
    }

    async applyUpdates(requests: docs_v1.Schema$Request[]) {
        return await (await this.DOCS).documents.batchUpdate({ documentId: this.DOC_ID, requestBody: { requests }});
    }

    async endOfDocument(): Promise<number> {
        const content = (await this.getDoc()).body.content;
        return content[content.length-1].endIndex;
    }
}
