import { state } from "../core/state.js";

type Result =
    | { ok: true; id: number }
    | { ok: false; error: string }

// GET /me request using the token found in memory, and updates the local infos for user
// -> Returns ok: true | false, and if ok, user: { username: string; slug: string }
export async function startLocalGame(): Promise<Result> {
    const token = localStorage.getItem("token");
    if (!token)
        return { ok: false, error: "No token"};

    const res = await fetch('/api/game', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    const data = await res.json(); // Possibility to update state with data

    if (res.ok) {
        const data = await res.json();
        state.play(data.id); // Restore user in local state
        return { ok: true, id: data.id };
    } else {
        // Invalid or expired token = Disconnect
        alert("Error starting game : " + data?.error || "Game start impossible");
        return { ok: false, error: data?.error || "Game start impossible" };
    }
}