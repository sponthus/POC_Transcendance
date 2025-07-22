import { State } from "../core/state.js";

type Result =
    | { ok: true }
    | { ok: true; user: { username: string; slug: string; id: number } }
    | { ok: false };

// GET /me request using the token found in memory, and updates the local infos for user
// -> Returns ok: true | false, and if ok, user: { username: string; slug: string }
export async function checkLog(): Promise<Result> {
    console.log("Checking log...");
    const userInfo = localStorage.getItem("user-info");
    if (!userInfo)
    {
        console.log("No user info - disconnected");
        return { ok: false};
    }
    return { ok: true }; //, user: { username: state.user.username, slug: state.user.slug, id: state.user.id } }

    // const res = await fetch('/api/user/me', {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     },
    //     cache: 'no-store'
    // });
    //
    // if (res.ok) {
    //     const data = await res.json();
    //     state.login(data.username, data.slug, data.id); // Restore user in local state
    //     console.log("Log check successful"); // Debug
    //     return { ok: true, user: { username: data.username, slug: data.slug, id: data.id } };
    // } else {
    //     // Invalid or expired token = Disconnect
    //     localStorage.removeItem("token");
    //     localStorage.removeItem("user-info");
    //     console.log("Log check failure");
    // }
    // return { ok: false };
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