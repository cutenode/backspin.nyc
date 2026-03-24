import fastify from 'fastify';
import fastifyView from '@fastify/view';
import { Edge } from 'edge.js';
import { edgeMarkdown } from 'edge-markdown';
import { readdir, readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
// fastify configuration 
const server = fastify({ logger: true });
// instantiate edge and configure our views directory
const edge = new Edge();
edge.mount(join(import.meta.dirname, 'templates'));
edge.use(edgeMarkdown, {});
// read our venues file and make it available globally in our edge templates
const venuesFile = await readFile(resolve(import.meta.dirname, 'venues.json'), 'utf-8');
const venues = JSON.parse(venuesFile);
edge.global('venues', venues);
// provide date utilities so we don't have to do insane new Date logic in our templates
import { dateCompare } from './helpers/dateCompare.js';
edge.global('dateCompare', dateCompare);
server.register(fastifyView, {
    engine: {
        // @ts-expect-error
        edge: edge
    }
});
async function getAbsolutePathsOfMarkdown(directory, options = {}) {
    const absolutePaths = [];
    const paths = await readdir(resolve(import.meta.dirname, directory));
    for (const path of paths) {
        if (path.endsWith('.md')) {
            const resultingFile = resolve(import.meta.dirname, directory, path);
            absolutePaths.push(resultingFile);
        }
    }
    if (options.reverse) {
        absolutePaths.reverse();
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
        editions: await getAbsolutePathsOfMarkdown('editions')
    };
    reply.view('index.edge', data);
    return reply;
});
server.get('/edition/:slug', async (request, reply) => {
    const { slug } = request.params;
    const editionPath = resolve(import.meta.dirname, 'editions', `${slug}.md`);
    const data = {
        metadata: {
            title: 'backspin.nyc',
            description: 'backspin is a non-exhaustive newsletter about nightlife and electronic dance music in New York City, authored by Heathcliff'
        },
        edition: editionPath
    };
    reply.view('edition.edge', data);
    return reply;
});
server.get('/stops/', async (request, reply) => {
    const data = {
        metadata: {
            title: 'backspin.nyc',
            description: 'backspin is a non-exhaustive newsletter about nightlife and electronic dance music in New York City, authored by Heathcliff'
        },
        stops: await getAbsolutePathsOfMarkdown('stops')
    };
    reply.view('stops.edge', data);
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