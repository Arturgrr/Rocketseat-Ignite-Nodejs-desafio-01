import http from 'node:http';
import { routes } from './routes';

const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    await JSON(req, res);

    const route = routes.find(async route => {
        return route.method == method && route.path.test(url)
    })

    if (route) {
        const paramsRouter = route.url.match(route.path)
        
        const { query, ...params } = paramsRouter.groups;
        
        req.params = params;
        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' }).end(JSON.stringify({ message: 'Route not found' }));
    }
});

server.listen(3333);