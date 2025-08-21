import { state } from "../../../ui/state.js";

type Result =
    | { ok: true; user: { username: string; slug: string } }
    | { ok: false; error?: string} //? --> pas forcement la variable

// GET /me request using the token found in memory, and updates the local infos for user
// -> Returns ok: true | false, and if ok, user: { username: string; slug: string }
export async function checkLog(): Promise<Result>
{
    console.log("Checking log...");
    const token = localStorage.getItem("token");
    if (!token)
    {
        console.log("No token - disconnected");
        localStorage.removeItem("user-info");
        return { ok: false};
    }
    const res = await fetch('/api/user/protected',
    {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });
    //la méthode .json() ne peut être appelée qu’une seule fois par réponse — 
    //la deuxième fois, ça plante, et donc tes données ne sont pas bien récupérées
    const data = await res.json();
    console.log('res dans checklog', res);
    if (res.ok)
    {
        state.login(data.username, data.slug); // Restore user in local state
        console.log("Log check successful"); // Debug
        return { ok: true, user: { username: data.username, slug: data.slug } };
    }
    // Invalid or expired token = Disconnect
    localStorage.removeItem("token");
    localStorage.removeItem("user-info");
    console.log("Log check failure");
     return { ok: false, error: data.error};
}