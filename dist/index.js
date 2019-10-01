"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drive_service_1 = require("./drive-service");
const util = require("util");
const drive_api_1 = require("./drive-api");
const fs = require('fs').promises;
const DOC_ID = '1BsTzTwLqQCJ31wsS1QU6ENmsepmdzmtBIY9k428B2QI';
const drive = new drive_service_1.DRIVE(DOC_ID);
(async () => {
    await printAndSaveDocumentLayout('1-initial');
    // No lists in the document;
    await addContentContainingList();
    await printAndSaveDocumentLayout('2-addedContent');
    // Content containing list in the doc
    await removeContentContainingList();
    await printAndSaveDocumentLayout('3-removedContent');
    // Lists remain in the doc
    console.log('Lists remaining after content deletion:');
    log((await drive.getDoc()).lists, 2);
})();
async function printAndSaveDocumentLayout(fileName) {
    const doc = await drive.getDoc();
    log(doc, 2);
    fs.writeFile(`${fileName}.json`, JSON.stringify(doc, null, 2));
}
async function addContentContainingList() {
    const normalContent = 'Some normal text\n';
    const listContent = 'Some\nlist\ncontent\nhere\n';
    const endOfDocumentIndex = await drive.endOfDocument() - 1;
    await drive.applyUpdates([
        drive_api_1.insertText({ text: normalContent, index: endOfDocumentIndex }),
        drive_api_1.insertText({ text: listContent, index: endOfDocumentIndex + normalContent.length }),
        drive_api_1.createParagraphBullets({
            bulletPreset: 'BULLET_DIAMOND_CIRCLE_SQUARE',
            start: endOfDocumentIndex + normalContent.length,
            length: listContent.length
        }),
        drive_api_1.createNamedRange({
            name: 'ContentContainingList',
            start: endOfDocumentIndex,
            length: normalContent.length + listContent.length
        })
    ]);
}
async function removeContentContainingList() {
    const namedRanges = (await drive.getDoc()).namedRanges;
    let updates = [];
    namedRanges['ContentContainingList'].namedRanges.forEach((nr) => {
        nr.ranges.forEach((range) => {
            updates.push(drive_api_1.deleteContentRange({ start: range.startIndex, end: range.endIndex }));
        });
    });
    await drive.applyUpdates(updates);
}
function log(data, depth) { console.log(util.inspect(data, false, depth || 10, true)); }
//# sourceMappingURL=index.js.map