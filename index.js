import fastify from 'fastify';
import fastifyView from '@fastify/view';
import { Edge } from 'edge.js';
import { edgeMarkdown } from 'edge-markdown';
import { readdir, readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
// import postgres from '@fastify/postgres'
// import pg from 'pg'
// fastify configuration 
const server = fastify({ logger: true });
// instantiate edge and configure our views directory
const edge = new Edge();
edge.mount(join(import.meta.dirname, 'templates'));
edge.use(edgeMarkdown, {});
server.register(fastifyView, {
    engine: {
        // @ts-expect-error
        edge: edge
    }
});
async function getAbsolutePathsOfEditions() {
    const absolutePaths = [];
    const paths = await readdir(resolve(import.meta.dirname, 'editions'));
    for (const path of paths) {
        if (path.endsWith('.md')) {
            const resultingFile = resolve(import.meta.dirname, 'editions', path);
            absolutePaths.push(resultingFile);
        }
    }
    return absolutePaths;
}
// server routes
server.get('/', async (request, reply) => {
    const data = {
        metadata: {
            title: 'backspin.nyc',
            description: 'backspin is a non-exhaustive newsletter about nightlife and electronic dance music in New York City, authored by Heathcliff'
        },
        user: {
            name: 'test'
        },
        absolutePaths: await getAbsolutePathsOfEditions
    };
    reply.view('index.edge', data);
    return reply;
});
server.get('/edition/:slug', async (request, reply) => {
    const { slug } = request.params;
    const editionPath = resolve(import.meta.dirname, 'editions', `${slug}.md`);
    console.log(editionPath);
    const data = {
        metadata: {
            title: 'backspin.nyc',
            description: 'backspin is a non-exhaustive newsletter about nightlife and electronic dance music in New York City, authored by Heathcliff'
        },
        user: {
            name: 'test'
        },
        path: editionPath
    };
    reply.view('edition.edge', data);
    return reply;
});
server.get('/health', async (request, reply) => {
    return { status: 'ok' };
});
// run the server
const start = async () => {
    const port = Number(process.env.SERVER_PORT);
    const host = String(process.env.SERVER_HOSTNAME);
    try {
        await server.listen({ port, host });
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
    server.log.info(`Server listening on http://localhost:${port}`);
};
start();
//# sourceMappingURL=index.js.map