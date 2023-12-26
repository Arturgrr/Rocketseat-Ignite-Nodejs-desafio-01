import fs from 'node:fs';
import {parse} from 'csv-parse';

const dbPath = new URL('../db.csv', import.meta.url);

export class Database {
  constructor() {
    this.filePath = dbPath.pathname;
    this.header = ['id', 'title', 'description', 'completed_at', 'created_at', 'updated_at'];
    this.data = [];

    try {
      const fileData = fs.readFileSync(this.filePath, 'utf8');

      parse(fileData, { columns: true }, (err, records) => {
        if (err) {
          console.error('Erro ao fazer o parse do arquivo CSV:', err);
          return;
        }

        this.data = records;
      });
    } catch (err) {
      fs.writeFileSync(this.filePath, this.header.join(',') + '\n', { flag: 'w' });

      this.data = [this.header.reduce((obj, key) => ({ ...obj, [key]: undefined }), {})];
    }
  }
}