
type UpdateNicknameSuccess = {ok: true; }
type Failure = { ok: false; error: string };

export type UpdateNicknameResult = UpdateNicknameSuccess | Failure 

export async function updateNickname (nickname: string): Promise<UpdateNicknameResult>
{
    const token = localStorage.getItem("token");
    if (!token)
        return { ok: false, error : "No token found" };
    const reponse = await fetch('api/user/nickname', 
    {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },    
        body: JSON.stringify({ nickname }),
    });
}