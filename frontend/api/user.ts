import { state } from "../ui/state.js";
import {navigate} from "../router";

type Result =
    | { ok: true; token: string, user: { username: string; slug: string } }
    | { ok: false; error: string }

// POST /api/login request to log in with username + login, updates local infos about user
// -> Returns  ok: true | false, if ok, token: string, user: { username: string; slug: string } | if false, error: string
export async function loginUser(username: string, password: string): Promise<Result> {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token); // Store token
        state.login(data.username, data.slug); // Login in local state
        console.log('token is ' + data.token); // debug
        console.log('slug is ' + data.slug); // debug
        return { ok: true, token: data.token, user: { username: data.username, slug: data.slug } };
    } else {
        const error = await res.json();
        console.error(error?.error || "Account creation impossible");
        return { ok: false, error: error?.error || "Account creation impossible" };
    }
}

// POST /api/user request to register a new user with username + login, updates local infos about user
// -> Returns  ok: true | false, if ok, token: string, user: { username: string; slug: string } | if false, error: string
export async function registerUser(username: string, password: string): Promise<Result> {
    const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
        const data = await res.json();
        console.log('token is ' + data.token); // Debug
        localStorage.setItem("token", data.token); // Store token in local storage
        state.login(data.username, data.slug); // Login in local state
        return { ok: true, token: data.token, user: { username: data.username, slug: data.slug } };
    } else {
        const error = await res.json();
        alert("Error : " + error?.error || "Account creation impossible");
        return { ok: false, error: error?.error || "Account creation impossible" };
    }
}