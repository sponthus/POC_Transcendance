import { navigate } from '../core/router.js';
import { checkLog } from "../api/check-log.js";
import { getUserInfo, modifyUserAvatar, modifyUserInfo } from "../api/user.js";
import { uploadAvatar } from "../api/avatar.js";
import { BasePage } from "./BasePage.js";

export class UserPage extends BasePage {
    protected slug: string;

    constructor(slug: string) {
        super();
        console.log('Constructor');
        this.slug = slug;
    }

    async render(): Promise<void> {
        await this.renderBanner();

        this.app.innerHTML = `<h1>Loading user page...</h1>`;
        console.log("Loading user page with username = " + this.slug);

        // TODO = Check log + get infos
        // const res = await checkLog();
        // if (!res.ok) {
        //     this.app.innerHTML = `
        //         <h1></h1>
        //         <h1>Not logged in, no access allowed</h1>
        //     `;
        //     return;
        // }
        // const connectedUser = res.user.slug;
        // TODO = Make me functional : connectedUser is logged in user, not just the provided URL
        const connectedUser = this.slug;
        const req = await getUserInfo(this.slug);
        if (req.ok) {
            const userData = req.user;
            console.log(`user data = ` + JSON.stringify(userData));
            const isOwnProfile = this.slug === connectedUser;
            if (isOwnProfile) {
                await this.showUserOwnPage(userData);
            } else {
                await this.showUserPage(userData);
            }
        }
        else {
            console.error(`error is` + req.error);
            this.app.innerHTML = `
                <h1>Error while loading profile</h1>
                <button id="retry">Try again</button>
            `;
            document.getElementById('retry')?.addEventListener('click', async () => {
                await navigate('/' + this.slug);
            });
        }
    }

    showUserPage(userData: any) {
        this.app.innerHTML = `
            <h1>${userData.username} profile - not me</h1>
            <p>User slug : <strong>${userData.slug}</strong></p>
            <p>User number ${userData.id} on PONG, from ${userData.created_at}</p>
        `;
    }

    async showUserOwnPage(userData: any) {
        console.log(`show user own page`);
        const avatarSrc = userData.avatar;
        console.log(`looking for avatar at ${avatarSrc}`);
        this.app.innerHTML = `
            <h1>${userData.username} profile - me</h1>
            <img src="https://localhost:4443/uploads/${avatarSrc}" alt="Avatar" width="300" />
            <div> ------ </div>
            <div id="avatar-action"><button id="edit-avatar-btn">Change avatar</button></div>
            <p>User slug : <strong>${userData.slug}</strong></p>
            <p>User number ${userData.id} on PONG, from ${userData.created_at}</p>
        `;

        const avatarActionDiv = document.getElementById('avatar-action');
        if (!avatarActionDiv) {
            console.log('avatar action debug');
            this.app.innerHTML = `Error`;
            return;
        }

        const editAvatarBtn = document.getElementById('edit-avatar-btn');
        if (!editAvatarBtn) {
            console.log('editAvatarBtn debug');
            this.app.innerHTML = `Error`;
            return;
        }
        else
            editAvatarBtn.addEventListener('click', async () => this.openUploadForm(avatarActionDiv, userData));
    }

    // Shows upload form
    async openUploadForm(avatarActionDiv: HTMLElement, userData: any) {
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
            document.getElementById('edit-avatar-btn')?.addEventListener('click', () => this.openUploadForm(avatarActionDiv, userData));
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
            console.log(`sending file: ${file}`);

            // Makes 2 requests : upload to upload service + change avatar in user db
            const req = await uploadAvatar(userData.slug, formData);
            if (req.ok) {
                alert("Avatar updated successfully!");
                const pathReq = await modifyUserAvatar(userData.slug, req.avatar);
                if (pathReq.ok) {
                    await navigate(`/user/${userData.slug}`);
                    return ;
                }
                else {
                    alert("Error while uploading avatar path in db" + (pathReq.error || "Unknown error"));
                }
            }
            else {
                alert("Upload failed: " + (req.error || "Unknown error"));
            }
        });
    }

}
