import path from "path";
import envSchema from "env-schema"; // Allows change and validation of variables by confronting them to a JSON scheme

// Definition of JSON scheme, everything expected in .env
// required = mandatory variables
// properties defines expected types and default values if absent
const schema = {
    type: "object",
    required: ["PORT", "LOG_LEVEL", "NODE_ENV", "USERS_DB_FILE", "GAMES_DB_FILE", "HASH_KEY"],
    properties: {
        PORT: {
            type: "number",
            default: 3000,
        },
        LOG_LEVEL: {
            type: "string",
            default: "info",
        }, // Level des logs affiches : en general info, mais on peut n'afficher que les erreurs
        NODE_ENV: {
            type: "string",
            default: "development",
            enum: ["development", "testing", "production"],
        },
        USERS_DB_FILE: {
            type: "string",
            default: "./users.db",
        },
        GAMES_DB_FILE: {
            type: "string",
            default: "./games.db",
        },
        HASH_KEY: {
            type: "string",
        }
    },
};

// envSchema reads .env at the specified path
// path.join builds the path to .env from actual dir and applying ../../
// Then it applies default variables and checks them, otherwise an error is thrown
// Returns config object with typed validated values
const config = envSchema({
    schema: schema,
    dotenv: {
        path: path.join(import.meta.dirname, "../../.env"),
    },
});

// Transforms config object to give variable names more coherent to camelCase JS convention
const envConfig = {
    port: config.PORT,
    logLevel: config.LOG_LEVEL,
    nodeEnv: config.NODE_ENV,
    usersDbFile: config.USERS_DB_FILE,
    gamesDbFile: config.GAMES_DB_FILE,
    hashKey: config.HASH_KEY,
};

// envConfig becomes default export from env.js file
export default envConfig;
