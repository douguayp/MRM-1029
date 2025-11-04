/**
 * CSV Database Parser
 * 
 * 功能：解析 only database.csv 文件
 * 用途：从 CSV 文件中检索化合物数据
 * 
 * 文件结构：
 * - Common Name (列4): 化合物通用名称
 * - Formal CAS # (列23): 标准CAS号（格式：5598-13-0）
 * - CAS # (without dashes) (列5): 无横杠CAS号（格式：5598130）
 * - Chinese Name (列40): 中文名称
 * - RI values: 保留指数（多个方法）
 */

import fs from 'fs';
import path from 'path';

/**
 * 化合物数据库记录接口
 */
export interface CompoundRecord {
  commonName: string;              // 通用名称
  formalCAS: string;               // 标准CAS号（带横杠）
  casNoDashes: string;             // 无横杠CAS号
  chineseName: string;             // 中文名称
  molecularFormula: string;        // 分子式
  molecularWeight: number;         // 分子量
  classification1: string;         // 分类1
  classification2: string;         // 分类2
  ri_CF40: number | null;          // RI (CF-40 方法)
  rt_CF40: number | null;          // RT (CF-40 方法)
  ri_CP40: number | null;          // RI (CP-40 方法)
  rt_CP40: number | null;          // RT (CP-40 方法)
  ri_CF20: number | null;          // RI (CF-20 方法)
  rt_CF20: number | null;          // RT (CF-20 方法)
  ri_CF5x15: number | null;        // RI (CF-5x15 方法)
  rt_CF5x15: number | null;        // RT (CF-5x15 方法)
  synonyms: string;                // 同义词
  japaneseName: string;            // 日文名称
}

/**
 * 解析 CSV 内容（支持跨行引号字段）
 * @param content CSV 文件完整内容
 * @returns 记录数组（每个记录是一个字段数组）
 */
function parseCSV(content: string): string[][] {
  const records: string[][] = [];
  let currentRecord: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    
    if (char === '"' && inQuotes && nextChar === '"') {
      // 转义的引号 "" → "
      currentField += '"';
      i++; // 跳过下一个引号
    } else if (char === '"') {
      // 开始或结束引号
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      // 字段分隔符
      currentRecord.push(currentField);
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // 行结束
      if (char === '\r' && nextChar === '\n') {
        i++; // 跳过 \r\n 中的 \n
      }
      currentRecord.push(currentField);
      currentField = '';
      
      // 保存当前记录（如果非空）
      if (currentRecord.length > 0 && currentRecord.some(f => f.trim())) {
        records.push(currentRecord);
      }
      currentRecord = [];
    } else {
      currentField += char;
    }
  }
  
  // 保存最后一个字段和记录
  if (currentField || currentRecord.length > 0) {
    currentRecord.push(currentField);
    if (currentRecord.some(f => f.trim())) {
      records.push(currentRecord);
    }
  }
  
  return records;
}

/**
 * 读取并解析 only database.csv
 * @returns 化合物记录数组（去重，每个化合物只保留一条记录）
 */
export function loadCompoundDatabase(): CompoundRecord[] {
  const csvPath = path.join(process.cwd(), 'data', 'database.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`Database file not found: ${csvPath}`);
    return [];
  }
  
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parseCSV(content);
  
  // 跳过第一条记录（表头）
  const dataRecords = records.slice(1);
  
  const compoundsMap = new Map<string, CompoundRecord>();
  
  for (const fields of dataRecords) {
    if (!fields || fields.length < 40) continue;
    
    // 提取关键字段
    const commonName = fields[3]?.trim() || '';    // Common Name (字段4, 索引3)
    const casNoDashes = fields[7]?.trim() || '';   // CAS without dashes (字段8, 索引7)
    const formalCAS = fields[18]?.trim() || '';    // Formal CAS # (字段19, 索引18)
    
    // 跳过空记录
    if (!commonName) continue;
    
    // 使用化合物名称作为唯一键（每个化合物只保留一条记录）
    if (!compoundsMap.has(commonName)) {
      const record: CompoundRecord = {
        commonName,
        formalCAS: formalCAS || `${casNoDashes.slice(0, 4)}-${casNoDashes.slice(4, 6)}-${casNoDashes.slice(6)}`,
        casNoDashes,
        chineseName: fields[35]?.trim() || '',        // Chinese Name (字段36, 索引35)
        molecularFormula: fields[4]?.trim() || '',    // Molecular Formula (字段5, 索引4)
        molecularWeight: parseFloat(fields[5]) || 0,  // Molecular Weight (字段6, 索引5)
        classification1: fields[8]?.trim() || '',     // Classification 1 (字段9, 索引8)
        classification2: fields[9]?.trim() || '',     // Classification 2 (字段10, 索引9)
        // RI 和 RT 数据
        ri_CF40: parseFloat(fields[11]) || null,      // RI CF 40-min (字段12, 索引11)
        rt_CF40: parseFloat(fields[10]) || null,      // RT CF 40-min (字段11, 索引10)
        ri_CP40: parseFloat(fields[13]) || null,      // RI CP 40-min (字段14, 索引13)
        rt_CP40: parseFloat(fields[12]) || null,      // RT CP 40-min (字段13, 索引12)
        ri_CF20: parseFloat(fields[15]) || null,      // RI CF 20-min (字段16, 索引15)
        rt_CF20: parseFloat(fields[14]) || null,      // RT CF 20-min (字段15, 索引14)
        ri_CF5x15: null,                              // RI CF 5x15 (暂无对应列)
        rt_CF5x15: parseFloat(fields[16]) || null,    // RT CF 5x15 (字段17, 索引16)
        synonyms: fields[42]?.trim() || '',           // Synonyms (字段43, 索引42)
        japaneseName: fields[37]?.trim() || '',       // Japanese Name (字段38, 索引37)
      };
      
      compoundsMap.set(commonName, record);
    }
  }
  
  return Array.from(compoundsMap.values());
}

/**
 * 按化合物名称搜索（支持部分匹配和中文名）
 * @param query 查询字符串
 * @param database 化合物数据库
 * @returns 匹配的化合物记录数组
 */
export function searchByName(query: string, database: CompoundRecord[]): CompoundRecord[] {
  const queryLower = query.toLowerCase().trim();
  
  return database.filter(record => {
    // 英文名称匹配
    if (record.commonName.toLowerCase().includes(queryLower)) {
      return true;
    }
    
    // 中文名称匹配
    if (record.chineseName && record.chineseName.includes(query)) {
      return true;
    }
    
    // 同义词匹配
    if (record.synonyms && record.synonyms.toLowerCase().includes(queryLower)) {
      return true;
    }
    
    return false;
  });
}

/**
 * 按 CAS 号搜索（支持带横杠和不带横杠的格式）
 * @param casQuery CAS 号（如 "5598-13-0" 或 "5598130"）
 * @param database 化合物数据库
 * @returns 匹配的化合物记录，未找到返回 null
 */
export function searchByCAS(casQuery: string, database: CompoundRecord[]): CompoundRecord | null {
  // 移除所有横杠和空格，统一为纯数字格式
  const casNormalized = casQuery.replace(/[-\s]/g, '').trim();
  
  return database.find(record => {
    // 比较无横杠格式
    if (record.casNoDashes === casNormalized) {
      return true;
    }
    
    // 比较标准格式（移除横杠后比较）
    if (record.formalCAS.replace(/[-\s]/g, '') === casNormalized) {
      return true;
    }
    
    return false;
  }) || null;
}

/**
 * 智能搜索：自动判断是名称还是 CAS 号
 * @param query 查询字符串
 * @param database 化合物数据库
 * @returns 匹配的化合物记录数组
 */
export function smartSearch(query: string, database: CompoundRecord[]): CompoundRecord[] {
  // 判断是否是 CAS 号（纯数字或包含横杠的数字格式）
  const isCAS = /^[\d-]+$/.test(query.trim());
  
  if (isCAS) {
    const result = searchByCAS(query, database);
    return result ? [result] : [];
  } else {
    return searchByName(query, database);
  }
}

/**
 * Transition 数据接口
 */
export interface TransitionRecord {
  commonName: string;
  casNoDashes: string;
  formalCAS: string;
  precursorIon: number;       // Q1
  productIon: number;         // Q3
  collisionEnergy: number;    // CE
  quantQual: string;          // Q0, Q1, Q2, Q3...
  relativeIntensity: string;  // 相对强度（如 "100%"）
}

/**
 * 从 only database.csv 加载 Transition 数据
 * @param casNumbers CAS 号数组（带横杠或不带横杠）
 * @returns Transition 记录数组
 */
export function loadTransitionsFromCSV(casNumbers: string[]): TransitionRecord[] {
  const csvPath = path.join(process.cwd(), 'data', 'database.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`Database file not found: ${csvPath}`);
    return [];
  }
  
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parseCSV(content);
  
  // 规范化 CAS 号（移除横杠）
  const normalizedCAS = casNumbers.map(cas => cas.replace(/[-\s]/g, ''));
  
  const transitions: TransitionRecord[] = [];
  
  for (const fields of records.slice(1)) { // 跳过表头
    if (!fields || fields.length < 35) continue;
    
    const casNoDashes = fields[7]?.trim();
    
    // 检查是否在查询列表中
    if (!normalizedCAS.includes(casNoDashes)) continue;
    
    const commonName = fields[3]?.trim() || '';           // Common Name (字段4, 索引3)
    const formalCAS = fields[18]?.trim() || '';           // Formal CAS # (字段19, 索引18)
    const precursorIon = parseFloat(fields[22]) || 0;     // Precursor Ion (字段23, 索引22)
    const productIon = parseFloat(fields[24]) || 0;       // Product Ion (字段25, 索引24)
    const collisionEnergy = parseFloat(fields[27]) || 0;  // CE (字段28, 索引27)
    const quantQual = fields[33]?.trim() || '';           // Quant/Qual (字段34, 索引33)
    const relativeIntensity = fields[32]?.trim() || '';   // Relative Intensity (字段33, 索引32)
    
    if (precursorIon > 0 && productIon > 0) {
      transitions.push({
        commonName,
        casNoDashes,
        formalCAS,
        precursorIon,
        productIon,
        collisionEnergy,
        quantQual,
        relativeIntensity
      });
    }
  }
  
  return transitions;
}

