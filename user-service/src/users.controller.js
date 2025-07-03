import Ajv from "ajv"; // json data validation, fastify built-in support
import slugify from "slugify";
import bcrypt from "bcrypt";

// For schema
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

async function generateToken(reply, username, slug) {
    return await reply.jwtSign({username, slug}) ;
}

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
    if (username == "default")
        return reply.status(400).send({
            error: "Username is not allowed to be \'Default\'",
        });

    const { db } = request.server;

    // Creates a slug possible to pass as a URL for API, ex : Jean Claude -> jean-claude
    const baseSlug = slugify(username, { lower: true, strict: true });
    const slug = generateUniqueSlug(baseSlug, db);
    const avatar = 'default.jpg';
    const pw_hash = bcrypt.hashSync(password, saltRounds);

    const checkUser = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
    if (checkUser) {
        return reply.status(409).send({
            error: "Username already exists",
        });
    }

    try {
        const insertStatement = db.prepare(
            "INSERT INTO users (username, slug, avatar, pw_hash) VALUES (?, ?, ?, ?)"
        );
        const result = insertStatement.run(username, slug, avatar, pw_hash);
        const id = result.lastInsertRowid;
        const token = await generateToken(reply, username, slug);
        return reply.status(200).send({ token, username: username, slug: slug });
    }
    catch (error) {
        db.prepare("DELETE FROM users WHERE id = ?").run(userId);
        return reply.status(500).send({ error: "User creation failed" });
    }
}

export async function loginUser(request, reply) {
    const { username, password } = request.body;
    if (!username || !password) {
        return reply.status(400).send({ error: "Missing username or password" });
    }

    console.log('loginUser controller called');
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

    const token = await generateToken(reply, user.username, user.slug);
    return reply.status(200).send({ token, username: user.username, slug: user.slug });
}

// TODO : Control what info is given or not
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

    let avatarPath = null;
    let nickname = null;

    if (request.body.avatar) {
        avatarPath = request.body.avatar;
    }
    if (avatarPath) {
        db.prepare('UPDATE users SET avatar = ? WHERE username = ?').run(avatarPath, username);
        console.log("path for avatar has been updated with " + avatarPath);
        return reply.send({ success: true, avatar: avatarPath });
    }
}

export async function modifyAvatar(request, reply) {
    const user = request.user; // JWT token data
    const { username, slug } = user;

    // TODO = Admin rights
    if (request.user.slug !== slug)
        return reply.code(403).send({error: 'Change forbidden'});

    console.log("Changing avatar for user = " + username);
    const avatarPath = `${slug}.jpg`;
    // TODO = Test file presence

    const { db } = request.server;

    try {
        // Update field in database
        db.prepare('UPDATE users SET avatar = ? WHERE slug = ?').run(avatarPath, slug);
        console.log(`Avatar path updated in DB for ${slug} is :` + avatarPath);

        return reply.send({ avatar: avatarPath });
    }
    catch (err) {
        console.log(err);
        return reply.code(500).send({error: 'Failed update : ' + err.message});
    }
}