// import * as myExtension from '../../extension';
const rts = (toConvert: string | RegExp) =>
  toConvert instanceof RegExp ? toConvert.source : toConvert;
export const pathOsAgnostic = (pathStr: string | RegExp) =>
  new RegExp(rts(pathStr).replace(/\//g, '[/\\\\]'));
export const endWith = (toConvert: string | RegExp) => new RegExp(`${rts(toConvert)}$`);
