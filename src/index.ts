import fastify from 'fastify'
import fastifyView from '@fastify/view'
import { Edge } from 'edge.js'
import { edgeMarkdown } from 'edge-markdown'
import { readdir, readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { fastifyFormbody } from '@fastify/formbody'

const port = Number(process.env.PORT);
const hostname = String(process.env.HOST);

// fastify configuration 
const server = fastify(
	{ logger: true }
)

//set up our form parsing
server.register(fastifyFormbody)

// set up parent of the `src` directory for us to use in different imports
const parentOfSrcDirectory = resolve(import.meta.dirname, '..')

// instantiate edge and configure our views directory
const edge = new Edge()
edge.mount(join(parentOfSrcDirectory, 'edge', 'templates'))
edge.use(edgeMarkdown, {})

// define content directory
const contentDirectory = resolve(parentOfSrcDirectory, 'content')

// read our venues file and make it available globally in our edge templates
const venuesFile = await readFile(resolve(contentDirectory, 'venues.json'), 'utf-8')
const venues = JSON.parse(venuesFile)
edge.global('venues', venues)

// provide date utilities so we don't have to do insane new Date logic in our templates
import { dateCompare } from './helpers/dateCompare.ts'
edge.global('dateCompare', dateCompare)

server.register(fastifyView, {
	engine: {
		// @ts-expect-error
		edge: edge
	}
})

async function getAbsolutePathsOfMarkdown (directory: string, options: { reverse?: boolean } = {}): Promise<Array<string>> {
	const absolutePaths: Array<string> = []
	const paths = await readdir(resolve(contentDirectory, directory))
	for (const path of paths) {
		if (path.endsWith('.md')) {
			const resultingFile = resolve(contentDirectory, directory, path)
			absolutePaths.push(resultingFile)
		}
	}

	if (options.reverse) {
		absolutePaths.reverse()
	}

	return absolutePaths
}

// server routes
server.get('/', async (request: any, reply: any) => {
	const data = {
		metadata: {
			title: 'backspin.nyc',
			description: 'backspin is a non-exhaustive newsletter about nightlife and electronic dance music in New York City, authored by Heathcliff'
		},
		editions: await getAbsolutePathsOfMarkdown('editions')
	}

	reply.view('index.edge', data)
	return reply
})

server.get('/edition/:slug', async (request: any, reply: any) => {
	const { slug } = request.params
	const editionPath = resolve(contentDirectory, 'editions', `${slug}.md`)

	const data = {
		metadata: {
			title: 'backspin.nyc',
			description: 'backspin is a non-exhaustive newsletter about nightlife and electronic dance music in New York City, authored by Heathcliff'
		},
		edition: editionPath
	}

	reply.view('edition.edge', data)
	return reply
});

server.get('/events/', async (request: any, reply: any) => {
	const data = {
		metadata: {
			title: 'backspin.nyc',
			description: 'backspin is a non-exhaustive newsletter about nightlife and electronic dance music in New York City, authored by Heathcliff'
		},
		events: await getAbsolutePathsOfMarkdown('events')
	}

	reply.view('events.edge', data)
	return reply
});

server.get('/health', async (request, reply) => {
	return { status: 'ok' }
})

server.post('/signup', async (request: any, reply: any) => {
	const { email } = request.body;
	reply.send({ email });
})

// run the server
const start = async () => {
	try {
		await server.listen({ port, host: hostname });
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}

start();
