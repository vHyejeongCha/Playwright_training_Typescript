import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

export function readCsvData(csvPath: string): Array<Record<string, string>> {
    const content = fs.readFileSync(csvPath, 'utf-8');
    return parse(content, { columns: true, skip_empty_lines: true });
}