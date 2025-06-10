import { state } from '../ui/state.js';
import { navigate } from '../router.js';
import { renderBanner } from './menu.js';
import {checkLog} from "../api/check-log.js";

function showUserPage(app: HTMLElement, userData: any) {
    app.innerHTML = `
            <h1>${userData.username} profile - not me</h1>
            <p>User slug : <strong>${userData.slug}</strong></p>
            <p>User number ${userData.id} on PONG, from ${userData.created_at}</p>
        `;
}

// TODO = Factorize plz
function uploadAvatar(app: HTMLElement, userData: any) {

}

function showUserOwnPage(app: HTMLElement, userData: any) {
    const avatarSrc = `/avatars/${userData.avatar}`;
    app.innerHTML = `
            <h1>${userData.username} profile - me</h1>
            <img src="${avatarSrc}" alt="Avatar" width="300" />
            <div> ------ </div>
            <div id="avatar-action"><button id="edit-avatar-btn">Change avatar</button></div>
            <p>User slug : <strong>${userData.slug}</strong></p>
            <p>User number ${userData.id} on PONG, from ${userData.created_at}</p>
        `;

    document.getElementById('back-home')?.addEventListener('click', () => {
        navigate('/');
    });

    const avatarActionDiv = document.getElementById('avatar-action');
    if (!avatarActionDiv)
        return;

    // Shows upload form
    const openUploadForm = (avatarActionDiv: HTMLElement) => {
        avatarActionDiv.innerHTML = `
            <form id="avatar-upload-form" enctype="multipart/form-data">
                <input type="file" name="avatar" accept="image/*" required />
                <button type="submit">Upload</button>
                <button type="button" id="cancel-upload-btn">Cancel</button>
            </form>
        `;

        // Put listener back and old render when cancel
        document.getElementById('cancel-upload-btn')?.addEventListener('click', () => {
            avatarActionDiv.innerHTML = `<button id="edit-avatar-btn">Change avatar</button>`;
            document.getElementById('edit-avatar-btn')?.addEventListener('click', () => openUploadForm(avatarActionDiv));
        });

        // Get form from HTTP
        const form = document.getElementById('avatar-upload-form') as HTMLFormElement;
        form?.addEventListener('submit', async (event) => {
            event.preventDefault();
            const input = form.querySelector('input[type="file"]') as HTMLInputElement;
            if (!input.files || input.files.length === 0) {
                alert("Please, select a file");
                return;
            }
            const file = input.files[0];

            const formData = new FormData();
            formData.append('avatar', file);

            // PUT api request to upload
            const token = localStorage.getItem("token");
            if (!token)
                return;

            // TODO try me and connect me
            try {
                const response = await fetch(`/api/avatar`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const error = await response.json();
                    alert("Upload failed: " + (error.message || error.error || "Unknown error"));
                    return;
                }

                const result = await response.json();

                // Update image in render with new avatar
                const avatarImg = document.getElementById('avatar-img') as HTMLImageElement;
                if (avatarImg && result.avatar) {
                    // Add timestamp to force image reload (cache busting)
                    avatarImg.src = `${result.avatar}?t=${Date.now()}`;
                }
                alert("Avatar updated successfully!");
            } catch (err) {
                alert("Error uploading avatar");
                console.error(err);
            }
        });
    }

    // Puts button back instead of form + listener back
    avatarActionDiv.innerHTML = `<button id="edit-avatar-btn">Change avatar</button>`;
    document.getElementById('edit-avatar-btn')?.addEventListener('click', () => openUploadForm(avatarActionDiv));
}

export async function getUserPage(usernameInUrl: string) {
    console.log('getUserPage', usernameInUrl);
    renderBanner();
    const app = document.getElementById('app');
    if (!app)
        return;

    app.innerHTML = `<h1>Loading user page...</h1>`;
    console.log("Loading user page with username = " + usernameInUrl);

    const res = await checkLog();
    if (!res.ok)
    {
        app.innerHTML = `
                <h1></h1>
                <h1>Not logged in, no access allowed</h1>
            `;
        return ;
    }

    const slug = res.user.slug;
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`/api/user/${usernameInUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!res.ok) {
            if (res.status === 403) {
                navigate('/login');
                return;
            }
            throw new Error(`Error : ${res.status}`);
        }

        const userData = await res.json();

        const isOwnProfile = slug === usernameInUrl;
        if (isOwnProfile) {
            showUserOwnPage(app, userData);
        }
        else {
            showUserPage(app, userData);
        }

    } catch (err) {
        console.error(err);
        app.innerHTML = `
            <h1>Erreur while loading profile</h1>
            <button id="retry">Try again</button>
        `;
        document.getElementById('retry')?.addEventListener('click', () => {
            getUserPage(usernameInUrl);
        });
    }
}