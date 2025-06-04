import Ajv from "ajv"; // json data validation, fastify built-in support
import slugify from "slugify";
import bcrypt from "bcrypt";

const ajv = new Ajv;

// Define the schema for post data
const postSchema = {
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 3,
            maxLength: 15,
            pattern: "^(?=.*[a-zA-Z]).+$",
        },
        password: {
            type: "string",
            minLength: 6,
            maxLength: 15,
            pattern: "^(?=.*[a-zA-Z0-9]).+$",
        },
    },
    required: ["username", "password"],
    additionalProperties: false,
};

// Compiles validation scheme into a validation function
const validatePost = ajv.compile(postSchema);

// For password hash
const saltRounds = 10;

function generateUniqueSlug(baseSlug, db) {
    let slug = baseSlug;
    let counter = 1;

    const dbFindings = db.prepare("SELECT COUNT(*) AS count FROM users WHERE slug = ?");

    while (dbFindings.get(slug).count > 0) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}

export async function createUser(request, reply) {
    const { username, password } = request.body;
    console.log("Creating user " + username + ' ' + password);

    const valid = validatePost({ username, password });
    if (!valid) {
        return reply.status(400).send({
            error: "Invalid input format",
            details: validatePost.errors,
        });
    }

    const { db } = request.server;

    // Creates a slug possible to pass as a URL for API, ex : Jean Claude -> jean-claude
    const baseSlug = slugify(username, { lower: true, strict: true });
    const slug = generateUniqueSlug(baseSlug, db);

    const pw_hash = bcrypt.hashSync(password, saltRounds);

    const checkUser = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
    if (checkUser) {
        return reply.status(409).send({
            error: "Username already exists",
        });
    }
    else
    {
        const avatar = 'default-avatar.jpg';
        const insertStatement = db.prepare(
            "INSERT INTO users (username, slug, avatar, pw_hash) VALUES (?, ?, ?, ?)"
        );
        insertStatement.run(username, slug, avatar, pw_hash);
    }
    const token = await reply.jwtSign({ username: username });
    return reply.status(200).send({ token, username: username });
}

export async function loginUser(request, reply) {
    console.log('loginUser controller called');

    const { username, password } = request.body;

    if (!username || !password) {
        return reply.status(400).send({ error: "Missing username or password" });
    }

    const { db } = request.server;

    const statement = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = statement.get(username);

    if (!user) {
        return reply.status(401).send({ error: "User not found" });
    }

    const passwordMatches = bcrypt.compareSync(password, user.pw_hash);
    if (!passwordMatches) {
        return reply.status(401).send({ error: "Invalid password" });
    }


    const token = await reply.jwtSign({ username: user.username });
    return reply.status(200).send({ token, username: user.username });
}

export async function getUser(request, reply) {
    const { username } = request.params;
    const { db } = request.server;

    console.log("Trying to find user " + username);
    const user = db.prepare('SELECT username, slug, avatar, id, created_at FROM users WHERE username = ?').get(username);

    if (!user) {
        return reply.status(404).send({ error: 'User not found' });
    }

    return reply.send(user);
}

export async function modifyUser(request, reply) {
    const username = request.user.username;
    const { db } = request.server;

    console.log("Trying to find user " + username);
    const user = db.prepare('SELECT username, slug, avatar, id, created_at FROM users WHERE username = ?').get(username);

    if (!user) {
        return reply.status(404).send({ error: 'User not found' });
    }

    const parts = request.parts();
    let avatarPath = null;
    let nickname = null;
    for await (const part of parts) {
        if (part.file) {
            // Looking for 'avatar' field
            if (part.fieldname === 'avatar') {
                const filename = `avatar-${Date.now()}-${part.filename}`;
                const filepath = path.join(__dirname, 'public', filename);
                await part.toFile(filepath);
                avatarPath = `/public/${filename}`;
            }
        }
    }

    if (avatarPath) {
        db.prepare('UPDATE users SET avatar = ? WHERE username = ?').run(avatarPath, username);
        return reply.send({ success: true, avatar: avatarPath });
    } // TODO delete old avatar
}

// export function authenticateUser(username, password) {
//     const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
//     const user = stmt.get(username);
//     if (!user) return null;
//
//     const match = bcrypt.compareSync(password, user.password_hash);
//     return match ? user : null;
// }