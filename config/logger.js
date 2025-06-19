import env from "./env.js";

export default {
    level: env.logLevel,
    formatters: {
        // Deletes useless infos
        bindings: () => ({}),
        // bindings: (bindings) => ({
        //     pid: bindings.pid,
        //     host: bindings.hostname
        // }),
        // Level of error
        level: (label) => ({ level: label }),
    },
    // Custom timestamp: HH:MM:SS
    timestamp: () => {
        const now = new Date();
        const time = now.toTimeString().split(' ')[0];
        return `,"time":"${time}"`;
    },
    serializers: {
        req(request) {
            return {
                method: request.method,
                url: request.url,
                host: request.headers.host,
                // No remoteAddress / remotePort
            };
        },
        res(reply) {
            return {
                statusCode: reply.statusCode,
                // No responseTime
            };
        }
    }
};