import * as fs from "fs";

export const codeSectionSettings = {
  codeStart: "<codeSection-",
  codeEnd: "</codeSection-",
  commentStart: `\n/*\n`,
  commentEnd: `\n*/\n`,
  emptyLine: `\n`,
};

export const getCodeSections = (currentCode: string) => {
  const { codeStart, codeEnd } = codeSectionSettings;
  let idx = -1;
  let blockName = "";
  let codeSection = "";
  let codeSections: { [key: string]: string } = {};

  while (true) {
    idx = currentCode.indexOf(codeStart, idx + 1);
    if (idx === -1) {
      break;
    }
    let idx2 = currentCode.indexOf(">", idx);
    blockName = currentCode.substring(idx + codeStart.length, idx2);
    idx = idx2;
    idx2 = currentCode.indexOf(codeEnd, idx);
    codeSection = currentCode.substring(idx + 1, idx2 - 2);
    codeSections[blockName] = codeSection;
  }

  return codeSections;
};

export const putCodeSections = (
  codeSections: { [key: string]: string },
  code: string
) => {
  const { codeStart, codeEnd } = codeSectionSettings;
  let idx = 0;
  for (var key in codeSections) {
    let idx1 = code.indexOf(codeStart + key + ">", idx) + codeStart.length;
    idx1 = code.indexOf(">", idx1) + 1;
    let idx2 = code.indexOf(codeEnd + key + ">", idx1);
    idx = idx2;
    const headStr = code.substring(0, idx1);
    const tailStr = code.substring(idx2 - 2);
    code = headStr + codeSections[key] + tailStr;
  }
  return code;
};

export const commentOutCode = (
  codeSections: Record<string, string>,
  startName: string,
  endName: string
) => {
  const { commentStart, commentEnd } = codeSectionSettings;
  codeSections[startName] = commentStart;
  codeSections[endName] = commentEnd;
};

export const commentInCode = (
  codeSections: Record<string, string>,
  startName: string,
  endName: string
) => {
  const { emptyLine } = codeSectionSettings;
  codeSections[startName] = emptyLine;
  codeSections[endName] = emptyLine;
};

export const changeCodeSections = (
  outputFilePath: string,
  change: (codeSections: Record<string, string>) => void
) => {
  if (fs.existsSync(outputFilePath)) {
    let code = fs.readFileSync(outputFilePath).toString();
    const codeSections = getCodeSections(code);
    change(codeSections);
    code = putCodeSections(codeSections, code);
    fs.writeFileSync(outputFilePath, code);
  }
};
