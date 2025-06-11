
export async function getGame(req, res) {
    req.log.info({userId: req.user.id}, 'User accessed /game');
    return {
        username: req.user.username,
    };
}
