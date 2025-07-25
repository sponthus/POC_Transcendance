import State from './state.js';

export async function createGame(request, reply) {
    const { userId, player_a, player_b } = request.body;
    const { db } = request.server;

    console.log('User accessed POST /game');
    console.log('userId = ' + userId + ' playA ' + player_a + ' playB ' + player_b);
    if (!userId || !player_a || !player_b) {
        console.log("Lack of given data");
        return reply.status(400).send({error: 'Invalid input, expected : userId, player_a, player_b'});
    }
    if (!db) {
        return reply.status(400).send({error: 'No database connection found.'});
    }

    const status = `pending`;
    try {
        const insertStatement = db.prepare(
          "INSERT INTO games (status, id_user, player_a, player_b) VALUES (?, ?, ?, ?)"
        );
        const result = insertStatement.run(status, userId, player_a, player_b);
        const id = result.id;
        return reply.status(200).send({game_id: id, status: status, player_a: player_a, player_b: player_b});
    }
    catch (error) {
        return reply.status(400).send({ error: "Game creation failed " + error });
    }
}

export async function getGamesForUserId(request, reply) {
    const { userId } = request.params;
    const { db } = request.server;

    console.log('User accessed GET /:userId/games');
    if (!userId) {
        return reply.status(400).send({error: 'No userId found in request.'});
    }
    if (!db) {
        return reply.status(400).send({error: 'No database connection found.'});
    }

    try {
        console.log("Trying to find games with userId " + userId);
        const statement = await db.prepare(
            `SELECT id, status, player_a, player_b, score_a, score_b, created_at
             FROM games
             WHERE id_user = ? AND status = 'pending'
             ORDER BY created_at DESC`
        );
        const games = statement.all(userId);
        if (!games || games.length === 0) {
            return reply.status(200).send([]);
        }
        console.log(`Found ${games.length} games for user ${userId}`);
        return reply.send(games);
    }
    catch (error) {
        console.error('Error fetching games:', error);
        return reply.status(500).send({error: 'Internal server error while fetching games'});
    }
}

// TODO = TEST ME PLEASE
export async function startGame(request, reply) {
    const { gameId } = request.params;
    const { db } = request.server;

    // TODO : Check user in log info
    console.log('User accessed POST /:gameId = ' + gameId);
    if (!gameId) {
        return reply.status(400).send({error: 'No gameId found in request.'});
    }
    if (!db) {
        return reply.status(400).send({error: 'No database connection found.'});
    }

    let userId = 0;
    let player_a = '';
    let player_b = '';
    let status = '';
    // Check if the game exists and is available to play
    try {
        console.log("Trying to find games with gameId " + gameId);
        const statement = await db.prepare(`
            SELECT id, status, id_user, player_a, player_b
            FROM games
            WHERE id = ?
        `);
        const games = statement.all(gameId);
        if (!games || games.length !== 1 || games[0].status !== 'pending') {
            return reply.status(404).send({ error : 'No available game found' });
        }
        userId = games[0].id;
        player_a = games[0].player_a;
        player_b = games[0].player_b;
        status = games[0].status;
    }
    catch (error) {
        console.error('Error fetching games:', error);
        return ;
    }

    try {
        console.log("Trying to create game server with gameId " + gameId);
        State.getInstance().getGameMaster().createServer(gameId, userId);
        console.log("sending data : " + gameId + status + player_a + player_b);
        return reply.status(200).send({ gameId: gameId, status: status, player_a: player_a, player_b: player_b });
    }
    catch (error) {
        console.error('Error creating game server:', error);
        // TODO = Cancel game status
    }
}