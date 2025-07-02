import path from "path";
import fs from "fs";
import {__dirname} from "./index.js";

// TODO = Fix me please I do not work
export async function uploadAvatar(request, reply) {
    const slug = request.user.slug;
    const user = request.user; // JWT token

    console.log("Uploading avatar for user = " + slug);

    if (user.slug !== slug)
        return reply.code(403).send({ error: "Not authorized to change this avatar" });

    // Path of actual dir
    console.log("dirname = " + __dirname);
    // Path on server
    const avatarDir = path.join(__dirname, '..', 'uploads');
    console.log("final dirname = " + avatarDir);
    // If it doesn't exist creates it
    if (!fs.existsSync(avatarDir)) {
        console.log("Creating avatarDir " + avatarDir);
        fs.mkdirSync(avatarDir, { recursive: true });
    }

    // TODO = Control file type
    const parts = await request.parts(); // fastify-multipart
    console.log("Parts are = ", parts);

    for await (const part of parts) {
        console.log(`me here`);
        // Check it's a file and it's an avatar
        if (part.type === 'file') {
            // File name = slug.jpg
            const fileName = `${slug}.jpg`;
            // File path = /uploads/filename
            const filePath = path.join(avatarDir, fileName);
            console.log("file path resulting = " + filePath);

            try {
                await pump(part.file, fs.createWriteStream(filePath));
                console.log(`Avatar uploaded for user: ${username}`);

                // Update field in database
                db.prepare('UPDATE users SET avatar = ? WHERE username = ?').run(fileName, username);
                console.log('Avatar path updated in DB is :' + fileName);

                // Reply = It worked
                return reply.send({ avatar: fileName });
            }
            catch (err) {
                console.log(err);
                return reply.code(500).send({error: 'Failed upload :' + err.message});
            }

            // No avatar in request
        }
    }
    return reply.code(400).send({ error: "No avatar file uploaded" });
}