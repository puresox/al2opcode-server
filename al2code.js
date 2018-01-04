let lineNum = '';

/**
 * 寄存器代号转二进制符号
 *
 * @param {string} register 寄存器代号
 * @returns
 */
function register2rsrd(register) {
  let r;
  switch (register.toLowerCase()) {
    case 'r0':
      r = '00';
      break;
    case 'r1':
      r = '01';
      break;
    case 'r2':
      r = '10';
      break;
    default:
      throw new Error(`第${lineNum}行 : 无法识别${register}`);
  }
  return r;
}

/**
 * 二进制转十六进制
 *
 * @param {string} binary 二进制字符串
 * @param {number} num 十六进制的位数
 * @returns
 */
function B2H(binary, num) {
  /** 解析二进制字符串 */
  const b = parseInt(binary, 2);
  /** 转为十六进制 */
  let h = b.toString(16);
  /** 不足补位 */
  const hArray = h.split('');
  if (hArray.length > num) {
    throw new Error(`第${lineNum}行 : 进制转换溢出。`);
  } else if (hArray.length < num) {
    let zeroString = '';
    for (let index = 0; index < num - hArray.length; index += 1) {
      zeroString += '0';
    }
    h = zeroString + h;
  }
  return h;
}

/**
 * 生成机器指令
 *
 * @param {any} line 一行的汇编符号
 * @returns
 */
function getLineString(line) {
  let lineString = '$P';
  /** 分割注释 */
  let [al] = line.split('//');
  al = al.trim();
  /** 分割汇编符号 */
  const alArray = al.split(' ');
  /** 获取16进制地址 */
  lineString += alArray[0];
  [lineNum] = alArray;
  /** 获取二进制指令格式 */
  let binary;
  switch (alArray[1].toLowerCase()) {
    case 'clr':
      binary = `011100${register2rsrd(alArray[2])}`;
      break;
    case 'mov':
      binary = `1000${register2rsrd(alArray[2])}${register2rsrd(alArray[3])}`;
      break;
    case 'adc':
      binary = `1001${register2rsrd(alArray[2])}${register2rsrd(alArray[3])}`;
      break;
    case 'sbc':
      binary = `1010${register2rsrd(alArray[2])}${register2rsrd(alArray[3])}`;
      break;
    case 'lda':
      binary = `000000${register2rsrd(alArray[2])}`;
      break;
    case 'sta':
      binary = `000001${register2rsrd(alArray[2])}`;
      break;
    case 'jmp':
      binary = '00001000';
      break;
    case 'bzc':
      binary = '00001100';
      break;
    case 'inc':
      binary = `1011${register2rsrd(alArray[2])}${register2rsrd(alArray[2])}`;
      break;
    case 'and':
      binary = `1100${register2rsrd(alArray[2])}${register2rsrd(alArray[3])}`;
      break;
    case 'com':
      binary = `1101${register2rsrd(alArray[2])}${register2rsrd(alArray[2])}`;
      break;
    case 'rrc':
      binary = `1110${register2rsrd(alArray[2])}${
        alArray.length > 3 ? register2rsrd(alArray[3]) : register2rsrd(alArray[2])
      }`;
      break;
    case 'rlc':
      binary = `1111${register2rsrd(alArray[2])}${
        alArray.length > 3 ? register2rsrd(alArray[3]) : register2rsrd(alArray[2])
      }`;
      break;
    case 'in':
      binary = `010001${register2rsrd(alArray[2])}`;
      break;
    case 'out':
      binary = `010110${register2rsrd(alArray[2])}`;
      break;
    case 'halt':
      binary = '01100000';
      break;
    default:
      binary = '';
      break;
  }
  /** 获取机器指令代码 */
  if (binary) {
    lineString += B2H(binary, 2);
  } else {
    const hArray = alArray[1].split('');
    if (hArray.length === 3 && hArray[2] === 'H') {
      lineString += alArray[1].substring(0, 2);
    } else {
      throw new Error(`第${lineNum}行 : 无法识别${alArray[1]}`);
    }
  }
  return lineString;
}

module.exports = function al2code(line) {
  const lineString = getLineString(line);
  return lineString.toUpperCase();
};
