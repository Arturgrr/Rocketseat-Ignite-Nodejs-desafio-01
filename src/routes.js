import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

// const db = new Database();

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            let teste = {
                "oi": "oi"
            }
            return res.end(JSON.stringify(teste))
        }
    },
]