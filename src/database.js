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

			parse(fileData, { columns: true, cast: true }, (err, records) => {
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
			id: Number(this.data.length + 1),
			title: newTask.title,
			description: newTask.description,
			completed_at: null,
			created_at: timestamp,
			updated_at: timestamp,
		});

		this.updateFile();

		return true;
	}

	updateFile() {
		const fileData = this.data.map((task) => Object.values(task).join(",")).join("\n");

		fs.writeFileSync(this.filePath, this.header.join(",") + "\n" + fileData);

		return true;
	}

	getALLtasks() {
		return JSON.stringify(this.data, null, 2);
	}

	findTaskById(id) {
		const task = this.data.find((t) => t.id === id);
		return task || null;
	}

	updateTask(id, newTask) {
		const task = this.findTaskById(id);
		if (!task) {
			return false;
		}

		const timestamp = new Date().toISOString();

		const updatedTask = {
			...task,
			...newTask,
			updated_at: timestamp,
		};

		this.data = this.data.map((t) => {
			if (t.id === id) {
				return updatedTask;
			}

			return t;
		});

		this.updateFile();

		return true;
	}

	deleteTask(id) {
		const task = this.findTaskById(id);
		if (!task) {
			return false;
		}

		this.data = this.data.filter((t) => t.id !== id);

		this.updateFile();

		return true;
	}

	completed_at(id) {
		const task = this.findTaskById(id);
		if (!task) {
			return false;
		}

		const timestamp = new Date().toISOString();

		const updatedTask = {
			...task,
			completed_at: timestamp,
		};

		this.data = this.data.map((t) => {
			if (t.id === id) {
				return updatedTask;
			}

			return t;
		});

		this.updateFile();

		return true;
	}
}
