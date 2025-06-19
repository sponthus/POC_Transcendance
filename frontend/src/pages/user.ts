import { state } from '../ui/state.js';
import { navigate } from '../router.js';
import { renderBanner } from './menu.js';
import {checkLog} from "../api/check-log.js";
import {getUserInfo, uploadAvatar} from "../api/user.js";

function showUserPage(app: HTMLElement, userData: any) {
    app.innerHTML = `
            <h1>${userData.username} profile - not me</h1>
            <p>User slug : <strong>${userData.slug}</strong></p>
            <p>User number ${userData.id} on PONG, from ${userData.created_at}</p>
        `;
}

function showUserOwnPage(app: HTMLElement, userData: any) {
    const avatarSrc = `/uploads/${userData.avatar}`;
    app.innerHTML = `
            <h1>${userData.username} profile - me</h1>
            <img src="${avatarSrc}" alt="Avatar" width="300" />
            <div> ------ </div>
            <div id="avatar-action"><button id="edit-avatar-btn">Change avatar</button></div>
            <p>User slug : <strong>${userData.slug}</strong></p>
            <p>User number ${userData.id} on PONG, from ${userData.created_at}</p>
        `;

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

            const req = await uploadAvatar(userData.slug, formData);
            if (req.ok) {
                alert("Avatar updated successfully!");
                navigate(`/user/${userData.slug}`);
                return ;
            }
            else {
                alert("Upload failed: " + (req.error || "Unknown error"));
            }
        });
    }

    // Puts button back instead of form + listener back
    avatarActionDiv.innerHTML = `<button id="edit-avatar-btn">Change avatar</button>`;
    document.getElementById('edit-avatar-btn')?.addEventListener('click', () => openUploadForm(avatarActionDiv));
}

export async function getUserPage(slug: string) {
    console.log('getUserPage', slug);
    renderBanner();
    const app = document.getElementById('app');
    if (!app)
        return;
    app.innerHTML = `<h1>Loading user page...</h1>`;
    console.log("Loading user page with username = " + slug);

    const res = await checkLog();
    if (!res.ok) {
        app.innerHTML = `
                <h1></h1>
                <h1>Not logged in, no access allowed</h1>
            `;
        return;
    }
    const connectedUser = res.user.slug;

    const req = await getUserInfo(slug);
    if (req.ok) {
        const userData = req.user;
        const isOwnProfile = slug === connectedUser;
        if (isOwnProfile) {
            showUserOwnPage(app, userData);
        } else {
            showUserPage(app, userData);
        }
    }
    else {
        // console.error(userData.error);
        app.innerHTML = `
            <h1>Erreur while loading profile</h1>
            <button id="retry">Try again</button>
        `;
        document.getElementById('retry')?.addEventListener('click', () => {
            getUserPage(slug);
        });
    }
}