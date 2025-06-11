import { state } from "../ui/state.js";

type Result =
    | { ok: true; user: { username: string; slug: string } }
    | { ok: false };

// GET /me request using the token found in memory, and updates the local infos for user
// -> Returns ok: true | false, and if ok, user: { username: string; slug: string }
export async function checkLog(): Promise<Result> {
    console.log("Checking log...");
    const token = localStorage.getItem("token");
    if (!token)
    {
        console.log("No token - disconnected");
        localStorage.removeItem("user-info");
        return { ok: false};
    }

    const res = await fetch('/api/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (res.ok) {
        const data = await res.json();
        state.login(data.username, data.slug); // Restore user in local state
        console.log("Log check successful"); // Debug
        return { ok: true, user: { username: data.username, slug: data.slug } };
    } else {
        // Invalid or expired token = Disconnect
        localStorage.removeItem("token");
        localStorage.removeItem("user-info");
        console.log("Log check failure");
    }
    return { ok: false };
}

/* Example of use :

    const res = await checkLog();
    if (res.ok)
    {
        const slug = res.user.slug;
        const token = localStorage.getItem("token"); <- To use it later, not included in answer
    }
    else ...

// Possibility if needed in result : | { ok: false; error: string }
// We call it discriminating method

 */