import fastify from 'fastify';
const server = fastify({ logger: true });
server.get('/', async (request, reply) => {
    return { hello: 'world' };
});
server.get('/health', async (request, reply) => {
    return { status: 'ok' };
});
const start = async () => {
    const port = 3000;
    try {
        await server.listen({ port });
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
    server.log.info(`Server listening on http://localhost:${port}`);
};
start();
//# sourceMappingURL=index.js.map