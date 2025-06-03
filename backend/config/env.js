import path from "node:path";
import envSchema from "env-schema"; // Allows change and validation of variables by confronting them to a JSON scheme

// Definition of JSON scheme, everything expected in .env
// required = mandatory variables
// properties defines expected types and default values if absent
const schema = {
    type: "object",
    required: ["PORT", "LOG_LEVEL", "NODE_ENV", "DB_FILE"],
    properties: {
        PORT: {
            type: "number",
            default: 3000,
        },
        LOG_LEVEL: {
            type: "string",
            default: "info",
        },
        NODE_ENV: {
            type: "string",
            default: "development",
            enum: ["development", "testing", "production", "staging"],
        },
        DB_FILE: {
            type: "string",
            default: "./users.db",
        },
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
    dbFile: config.DB_FILE,
};

// envConfig becomes default export from env.js file
export default envConfig;
