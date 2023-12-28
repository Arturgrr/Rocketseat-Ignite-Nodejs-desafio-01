import fs from "node:fs";
import { parse } from "csv-parse";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = resolve(__dirname, "../db.csv");

export class Database {
	constructor() {
		this.filePath = dbPath;
		this.header = ["id", "title", "description", "completed_at", "created_at", "updated_at"];
		this.data = [];

		try {
			const fileData = fs.readFileSync(this.filePath, "utf8");

			parse(fileData, { columns: true }, (err, records) => {
				if (err) {
					console.error("Erro ao fazer o parse do arquivo CSV:", err);
					return;
				}

				this.data = records;
			});
		} catch (err) {
			const dirPath = dirname(this.filePath);
			if (!fs.existsSync(dirPath)) {
				fs.mkdirSync(dirPath, { recursive: true });
			}

			fs.writeFileSync(this.filePath, this.header.join(",") + "\n", { flag: "w" });
			this.data = [this.header.reduce((obj, key) => ({ ...obj, [key]: undefined }), {})];
		}
	}

	addTask(newTask) {
		const timestamp = new Date().toISOString();

		this.data.push({
			id: this.data.length + 1,
			title: newTask.title,
			description: newTask.description,
			completed_at: null,
			created_at: timestamp,
			updated_at: timestamp,
		});

		this.updateFile();
	}

	updateFile() {
		const fileData = this.data.map((task) => Object.values(task).join(",")).join("\n");

		fs.writeFileSync(this.filePath, this.header.join(",") + "\n" + fileData);
	}
}
