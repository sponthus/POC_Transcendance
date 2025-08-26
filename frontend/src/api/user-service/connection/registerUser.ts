import { State } from "../../../core/state.js";

type UserBasic = {
    username: string;
    slug: string;
};

type AuthSuccess = { ok: true; token: string; user: UserBasic };
type Failure = { ok: false; error: string };

export type RegisterResult = AuthSuccess | Failure;

export async function   registerUser(username: string, password: string): Promise<RegisterResult> 
{
    const res = await fetch('/api/user/register', 
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();    
    if (res.ok) 
    {
        console.log('token is ' + data.token);
        localStorage.setItem("token", data.token);
       // state.login(data.username, data.slug); //Problem
        return { ok: true, token: data.token, user: { username: data.username, slug: data.slug } };
    }
    //alert("Error : " + error?.error || "Account creation impossible"); //enlever alert ?
    return { ok: false, error: data.error};
}