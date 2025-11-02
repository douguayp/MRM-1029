
import fs from 'fs';
import path from 'path';
import { Compound, Transition, RIData, MethodConfig, Family } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');

function parseCSV<T>(content: string, parser: (row: string[]) => T): T[] {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const results: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length === headers.length) {
      results.push(parser(values));
    }
  }

  return results;
}

export async function loadCompounds(family: Family): Promise<Compound[]> {
  const filePath = path.join(DATA_DIR, 'compounds.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  const all: Compound[] = JSON.parse(content);
  return all.filter(c => c.family === family);
}

export async function loadTransitions(params: { family: Family; ids: string[] }): Promise<Transition[]> {
  const filePath = path.join(DATA_DIR, 'transitions.csv');
  const content = fs.readFileSync(filePath, 'utf-8');

  const transitions = parseCSV<Transition>(content, (values) => ({
    family: values[0] as Family,
    compound_id: values[1],
    Q1: parseFloat(values[2]),
    Q3: parseFloat(values[3]),
    CE_nominal: parseFloat(values[4]),
    CE_low: values[5] ? parseFloat(values[5]) : undefined,
    CE_high: values[6] ? parseFloat(values[6]) : undefined,
    QuantQual: values[7] as 'Quantifier' | 'Qualifier',
    RelativeIntensity: parseFloat(values[8]),
    Target: values[9],
    Source: values[10]
  }));

  return transitions.filter(t =>
    t.family === params.family &&
    params.ids.includes(t.compound_id)
  );
}

export async function loadRI(params: { family: Family; ids: string[] }): Promise<RIData[]> {
  const filePath = path.join(DATA_DIR, 'ri.csv');
  const content = fs.readFileSync(filePath, 'utf-8');

  const riData = parseCSV<RIData>(content, (values) => ({
    family: values[0] as Family,
    compound_id: values[1],
    RI_ref: parseFloat(values[2]),
    RT_window: values[3] || undefined,
    source: values[4]
  }));

  return riData.filter(r =>
    r.family === params.family &&
    params.ids.includes(r.compound_id)
  );
}

export async function loadMethods(): Promise<Record<Family, Record<string, MethodConfig>>> {
  const filePath = path.join(DATA_DIR, 'methods.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}
