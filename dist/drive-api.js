"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Return offset modifier aswell
// Consider returning an array - in case we want to construct multiple actions
// Consider making a 'builder' that can chain these operations
function updateParagraphStyle(init) {
    return {
        updateParagraphStyle: {
            paragraphStyle: {
                namedStyleType: init.namedStyleType || 'NORMAL_TEXT'
            },
            fields: '*',
            range: {
                startIndex: init.start,
                endIndex: init['end'] || init.start + init['length']
            }
        }
    };
}
exports.updateParagraphStyle = updateParagraphStyle;
function createNamedRange(init) {
    return {
        createNamedRange: {
            name: init.name,
            range: {
                startIndex: init.start,
                endIndex: init['end'] || init.start + init['length']
            }
        }
    };
}
exports.createNamedRange = createNamedRange;
// Only applying text will insert at the end of the document
function insertText(init) {
    return {
        insertText: Object.assign({ text: init.text }, (init.index && { location: { index: init.index } }), (!init.index && { endOfSegmentLocation: { segmentId: init.segmentId } }))
    };
}
exports.insertText = insertText;
function updateTextStyleLink(init) {
    return {
        updateTextStyle: {
            textStyle: {
                link: {
                    url: init.url
                }
            },
            fields: "link",
            range: {
                startIndex: init.start,
                endIndex: init['end'] || init.start + init['length']
            }
        }
    };
}
exports.updateTextStyleLink = updateTextStyleLink;
function createParagraphBullets(init) {
    return {
        createParagraphBullets: {
            bulletPreset: init.bulletPreset,
            range: {
                startIndex: init.start,
                endIndex: init['end'] || init.start + init['length']
            }
        }
    };
}
exports.createParagraphBullets = createParagraphBullets;
function deleteContentRange(init) {
    return {
        deleteContentRange: {
            range: {
                startIndex: init.start,
                endIndex: init['end'] || init.start + init['length']
            }
        }
    };
}
exports.deleteContentRange = deleteContentRange;
function deleteNamedRange(init) {
    return {
        deleteNamedRange: Object.assign({}, (init.name && { name: init.name }), (init.nameRangeId && { nameRangeId: init.nameRangeId }))
    };
}
exports.deleteNamedRange = deleteNamedRange;
function deletePositionedObject(init) {
    return {
        deletePositionedObject: {
            objectId: init.objectId
        }
    };
}
exports.deletePositionedObject = deletePositionedObject;
function insertTable(init) {
    return {
        insertTable: Object.assign({ rows: init.rows, columns: init.columns }, (init.index && { location: { index: init.index } }), (!init.index && { endOfSegmentLocation: { segmentId: init.segmentId } }))
    };
}
exports.insertTable = insertTable;
//# sourceMappingURL=drive-api.js.map