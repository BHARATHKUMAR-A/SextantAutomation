import * as XLSX from 'xlsx';

export function getFirstCellValueByHeader(filePath: string, sheetName: string, headerName: string): string {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
        throw new Error(`Expected worksheet ${sheetName} in ${filePath}`);
    }

    const rows = XLSX.utils.sheet_to_json<Record<string, string | number | undefined>>(worksheet, { defval: '' });

    if (!rows.length) {
        throw new Error(`Expected at least one data row in worksheet ${sheetName} from ${filePath}`);
    }

    const rawValue = rows[0][headerName];

    if (rawValue === undefined || rawValue === null || `${rawValue}`.trim() === '') {
        throw new Error(`Expected header ${headerName} with a non-empty value in worksheet ${sheetName} from ${filePath}`);
    }

    return `${rawValue}`.trim();
}