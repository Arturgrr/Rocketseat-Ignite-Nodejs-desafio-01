import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const db = new Database();

export const routes = [
	{
		method: "POST",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			if (req.body == null || !req.body.title || !req.body.description) {
				res.writeHead(400);
				return res.end();
			}

			const task = {
				title: req.body.title,
				description: req.body.description,
			};

			db.addTask(task);

			res.writeHead(200);
			return res.end();
		},
	},
	{
		method: "GET",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			const taksList = db.getALLtasks();

			res.writeHead(200);
			res.write(taksList);
			return res.end();
		},
	},
	{
		method: "PUT",
		path: buildRoutePath("/tasks/:id"),
		handler: (req, res) => {
			const task = db.findTaskById(req.params.id);
			if (!task) {
				res.writeHead(400);
				res.write("Task not found");
				return res.end();
			}

			if (req.body == null || (!req.body.title && !req.body.description)) {
				res.writeHead(400);
				return res.end();
			}

			if (req.body.title) {
				task.title = req.body.title;
			}

			if (req.body.description) {
				task.description = req.body.description;
			}

			db.updateTask(req.params.id, task);

			res.writeHead(200);
			return res.end();
		},
	},
];
