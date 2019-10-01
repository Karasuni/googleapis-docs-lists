import { docs_v1 } from "googleapis/build/src/apis/docs/v1";

export type NamedStyleTypes = SegmentStyleTypes | 'TITLE' | 'SUBTITLE' | 'NORMAL_TEXT';
export type SegmentStyleTypes = 'HEADING_1' | 'HEADING_2' | 'HEADING_3' | 'HEADING_4' | 'HEADING_5';

// TODO: Return offset modifier aswell
// Consider returning an array - in case we want to construct multiple actions
// Consider making a 'builder' that can chain these operations

export function updateParagraphStyle(init: { namedStyleType: string, start: number, end: number } | { namedStyleType: string, start: number, length: number }): docs_v1.Schema$Request {
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

export function createNamedRange(init: { name: string, start: number, end: number } | { name: string, start: number, length: number }): docs_v1.Schema$Request {
  return {
    createNamedRange: {
      name: init.name,
      range: {
        startIndex: init.start,
        endIndex: init['end'] || init.start + init['length']
      }
    }
  }
}

// Only applying text will insert at the end of the document
export function insertText(init: { text: string, index: number } | { text: string, segmentId?: string }): docs_v1.Schema$Request {
  return {
    insertText: {
      text: init.text,
      ...(init.index && { location: { index: init.index } }),
      ...(!init.index && { endOfSegmentLocation: { segmentId: init.segmentId } }),
    }
  }
}

export function updateTextStyleLink(init: { url: string, start: number, end: number} | { url: string, start: number, length: number }): docs_v1.Schema$Request {
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
  }
}

export type BulletPresets = 'BULLET_GLYPH_PRESET_UNSPECIFIED' | 'BULLET_DISC_CIRCLE_SQUARE' |
  'BULLET_DIAMONDX_ARROW3D_SQUARE' | 'BULLET_CHECKBOX' | 'BULLET_ARROW_DIAMOND_DISC' | 'BULLET_STAR_CIRCLE_SQUARE' |
  'BULLET_ARROW3D_CIRCLE_SQUARE' | 'BULLET_LEFTTRIANGLE_DIAMOND_DISC' | 'BULLET_DIAMONDX_HOLLOWDIAMOND_SQUARE' |
  'BULLET_DIAMOND_CIRCLE_SQUARE' | 'NUMBERED_DECIMAL_ALPHA_ROMAN' | 'NUMBERED_DECIMAL_ALPHA_ROMAN_PARENS' |
  'NUMBERED_DECIMAL_NESTED' | 'NUMBERED_UPPERALPHA_ALPHA_ROMAN' | 'NUMBERED_UPPERROMAN_UPPERALPHA_DECIMAL' |
  'NUMBERED_ZERODECIMAL_ALPHA_ROMAN';
export function createParagraphBullets(init: { bulletPreset: BulletPresets, start: number, end: number} | { bulletPreset: BulletPresets, start: number, length: number }): docs_v1.Schema$Request {
  return {
    createParagraphBullets: {
      bulletPreset: init.bulletPreset,
      range: {
        startIndex: init.start,
        endIndex: init['end'] || init.start + init['length']
      }
    }
  }
}

export function deleteContentRange(init: { start: number, end: number } | { start: number, length: number }) {
  return {
    deleteContentRange: {
      range: {
        startIndex: init.start,
        endIndex: init['end'] || init.start + init['length']
      }
    }
  }
}

export function deleteNamedRange(init: { name: string } | { nameRangeId: string }): docs_v1.Schema$Request {
  return {
    deleteNamedRange: { // one or the other
      ...(init.name && { name: init.name }),
      ...(init.nameRangeId && { nameRangeId: init.nameRangeId }),
    }
  }
}

export function deletePositionedObject(init: { objectId: string }): docs_v1.Schema$Request {
  return {
    deletePositionedObject: {
      objectId: init.objectId
    }
  }
}

export function insertTable(init: { rows: number, columns: number, index: number } | { rows: number, columns: number, segmentId: string } ) {
  return {
    insertTable: {
      rows: init.rows,
      columns: init.columns,
      ...(init.index && { location: { index: init.index } }),
      ...(!init.index && { endOfSegmentLocation: { segmentId: init.segmentId } }),
    }
  }
}
