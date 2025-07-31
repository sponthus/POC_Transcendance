import State from './state.js';

export async function createGame(request, reply) {
    const { userId, player_a, player_b } = request.body;
    const { db } = request.server;

    console.log('User accessed POST /game');
    console.log('userId = ' + userId + ' playA ' + player_a + ' playB ' + player_b);
    if (!userId || !player_a || !player_b || player_a == player_b) {
        console.log("Lack of given data");
        return reply.status(400).send({error: 'Invalid input, expected : userId, player_a != player_b'});
    }
    if (!db) {
        return reply.status(400).send({error: 'No database connection found.'});
    }

    try {
        const result = await db.createGame(userId, player_a, player_b);
        return reply.status(201).send(result);
    }
    catch (error) {
        return reply.status(400).send({ error: "Game creation failed " + error.message });
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
        const games = await db.getGamesForUserId(userId);
        if (!games || games.length === 0) {
            return reply.status(200).send([]);
        }
        console.log(`Found ${games.length} games for user ${userId}`);
        return reply.status(200).send(games);
    }
    catch (error) {
        console.error('Error fetching games:', error);
        return reply.status(500).send({error: 'Internal server error while fetching games'});
    }
}

// Test ok normal case
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
        // console.log("Trying to find games with gameId " + gameId);
        const games = await db.getGame(gameId);
        if (!games || games.length !== 1 || games[0].status !== 'pending') {
            return reply.status(404).send({ error : 'No available game found' });
        }
        // TODO = Add authentication / userId
        userId = games[0].id_user;
        player_a = games[0].player_a;
        player_b = games[0].player_b;
        status = games[0].status;
    }
    catch (error) {
        console.error('Error fetching games:', error);
        return ;
    }

    try {
        // console.log("Trying to create game server with gameId " + gameId + " and userId " + userId);
        State.getInstance().getGameMaster().createServer(gameId, userId);
        // console.log("sending data : " + gameId + status + player_a + player_b);
        return reply.status(200).send({ 
            gameId: gameId, 
            status: status, 
            player_a: player_a, 
            player_b: player_b 
        });
    }
    catch (error) {
        console.error('Error creating game server:', error);
    }
}

// Tests ok normal case
export async function deleteGame(request, reply) {
    const { gameId } = request.params;
    const { db } = request.server;

    // TODO : Check user in log info
    console.log('User accessed DELETE /:gameId = ' + gameId);
    if (!gameId) {
        return reply.status(400).send({error: 'No gameId found in request.'});
    }
    if (!db) {
        return reply.status(400).send({error: 'No database connection found.'});
    }

    try {
        const gamesToDelete = await db.getGame(gameId);
        if (!gamesToDelete 
            || gamesToDelete[0].status !== 'pending') {
            return reply.status(404).send({ error : 'No available game found' });
        }
        if (gamesToDelete.length !== 1)
            return reply.status(404).send({ error : 'Several available games found (critic: impossible)' });
        if (gamesToDelete.tournament_id)
            return reply.status(404).send({ error: 'Game is linked to a tournament' });
        // TODO = Add authentication / userId

        const del = await db.deleteGame(gameId);
    } catch (error) {
        console.error('Error deleting game: ' + error);
    }
}
