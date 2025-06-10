import env from "./env.js";

export default {
    level: env.logLevel,
    formatters: {
        bindings: (bindings) => ({
            pid: bindings.pid,
            host: bindings.hostname
        }),
        level: (label) => ({
            level: label
        }),
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
};