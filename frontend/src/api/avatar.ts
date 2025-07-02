// POST /api/user/:slug to upload a new avatar file to the system
export async function uploadAvatar(slug: string, formData: FormData): Promise<AvatarUploadResult> {
    const token = localStorage.getItem("token");
    if (!token) {
        return { ok: false, error: "No token found" };
    }

    const res = await fetch(`/api/avatars/${slug}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    });

    if (res.ok) {
        console.log("Request for user info accepted");
        const data = await res.json();
        return { ok: true, avatar: data.avatar }
    }
    else {
        const error = await res.json();
        return { ok: false,
            error: error?.error || "Upload problem" }
    }
}