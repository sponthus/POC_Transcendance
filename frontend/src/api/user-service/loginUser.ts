import { state } from "../../ui/state.js";

type UserBasic = {
    username: string;
    slug: string;
};

type AuthSuccess = { ok: true; token: string; user: UserBasic };
type Failure = { ok: false; error: string };

export type LoginResult = AuthSuccess | Failure;

export async function loginUser(username: string, password: string): Promise<LoginResult> {
    const res = await fetch('/api/user/login', {
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