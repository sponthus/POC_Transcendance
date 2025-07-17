import { state } from "../ui/state.js";

// User infos possible to give back
type UserBasic = {
    username: string;
    slug: string;
    id: number;
};
type UserFull = UserBasic & {
    id: number;
    avatar: string;
    created_at: string;
};

// Possible results for request
type AuthSuccess = { ok: true; token: string; user: UserBasic };
type AuthFullSuccess = { ok: true; token: string; user: UserFull };
type AvatarUploadSuccess = { ok: true; avatar: string };
type UserModificationSuccess = { ok: true; user: UserBasic}
type Failure = { ok: false; error: string };

// Union of possibilities for the type of answer
export type LoginResult = AuthSuccess | Failure;
export type RegisterResult = AuthSuccess | Failure;
export type GetUserResult = AuthFullSuccess | Failure;
export type AvatarUploadResult = AvatarUploadSuccess | Failure;
export type UserModificationResult = UserModificationSuccess | Failure;

// POST /api/login request to log in with username + login, updates local infos about user
export async function loginUser(username: string, password: string): Promise<LoginResult> {
    const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token); // Store token
        state.login(data.username, data.slug, data.id); // Login in local state
        console.log('token is ' + data.token); // debug
        console.log('slug is ' + data.slug); // debug
        return { ok: true, token: data.token, user: { username: data.username, slug: data.slug, id: data.id } };
    } else {
        const error = await res.json();
        console.error(error?.error || "Account creation impossible");
        return { ok: false, error: error?.error || "Account creation impossible" };
    }
}

// POST /api/user request to register a new user with username + login, updates local infos about user
export async function registerUser(username: string, password: string): Promise<RegisterResult> {
    const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
        const data = await res.json();
        console.log('token is ' + data.token); // Debug
        localStorage.setItem("token", data.token); // Store token in local storage
        state.login(data.username, data.slug, data.id); // Login in local state
        return { ok: true, token: data.token, user: { username: data.username, slug: data.slug, id: data.id } };
    } else {
        const error = await res.json();
        alert("Error : " + error?.error || "Account creation impossible");
        return { ok: false, error: error?.error || "Account creation impossible" };
    }
}

// GET /api/user/:slug request to get user infos
export async function getUserInfo(slug: string): Promise<GetUserResult> {
    const token = localStorage.getItem("token");
    if (!token) {
        return { ok: false, error: "No token found" };
    }

    const res = await fetch(`/api/user/${slug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (res.ok) {
        console.log("Request for user info accepted");
        const data = await res.json();
        return { ok: true, token: data.token, user: {
            username: data.username,
            slug: data.slug,
            id: data.id,
            avatar: data.avatar,
            created_at: data.created_at } };
    }
    else {
        const error = await res.json();
        return { ok: false,
            error: error?.error || "Info not received from back" };
    }
}

// NOT TESTED
// PUT /api/user/:slug request to change username
export async function modifyUserInfo(slug: string, username: string): Promise<UserModificationResult> {
    const token = localStorage.getItem("token");
    if (!token) {
        return { ok: false, error: "No token found" };
    }

    const res = await fetch(`/api/user/${slug}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username }),
    });

    if (res.ok) {
        console.log("Request for avatar path change accepted");
        const data = await res.json();
        return {
            ok: true, user: data.user
        };
    }
    else {
        const error = await res.json();
        return { ok: false,
            error: error?.error || "Info not received from back" };
    }
}

// PUT /api/user/:slug/avatar request to change avatar path
export async function modifyUserAvatar(slug: string, avatar: string): Promise<AvatarUploadResult> {
    const token = localStorage.getItem("token");
    if (!token) {
        return { ok: false, error: "No token found" };
    }

    const res = await fetch(`/api/user/${slug}/avatar`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar }),
    });
    if (res.ok) {
        console.log("Request for avatar path change accepted");
        const data = await res.json();
        return {
            ok: true, avatar: data.avatar
        };
    }
    else {
        const error = await res.json();
        return { ok: false,
            error: error?.error || "Info not received from back" };
    }
}

