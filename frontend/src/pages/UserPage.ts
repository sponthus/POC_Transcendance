import { navigate } from '../router.js';
import { checkLog } from "../api/check-log.js";
import { getUserInfo, modifyUserAvatar , modifyUserInfo } from "../api/user.js";
import { uploadAvatar } from "../api/avatar.js";
import { BasePage } from "./BasePage.js";
import { state } from '../ui/state.js';

export class UserPage extends BasePage {
    protected slug?: string;

	private _Background?: HTMLElement;
	private _ProfileBanner?: HTMLElement;
	private _UserInfo?: HTMLElement;

	private _UserData?: any;


    constructor(slug: string) {
        super();
        console.log('Constructor');
        this.slug = state!.user?.slug;
    }

    async render(): Promise<void> {
        await this.renderBanner();
        console.log('getUserPage', this.slug);

        // this.app.innerHTML = `<h1>Loading user page...</h1>`;
        // console.log("Loading user page with username = " + this.slug);

        const res = await checkLog();
        if (!res.ok) {
            this.app.innerHTML = `
                <h1></h1>
                <h1>Not logged in, no access allowed</h1>
            `;
            return;
        }
        const connectedUser = res.user.slug;

        const req = await getUserInfo(this.slug!);
        if (req.ok) {
            this._UserData = req.user;
            console.log(`user data = ` + JSON.stringify(this._UserData));
            const isOwnProfile = this.slug === connectedUser;
            if (isOwnProfile) {
                await this.showUserOwnPage();
            } else {
                await this.showUserPage(this._UserData);
            }
        }
        else {
			this.app.innerHTML = `
			<h1>Error while loading profile</h1>
			<button id="retry">Try again</button>
            `;
            console.error("error is" , req.error);
			console.log("yo the slug is ", state!.user?.slug);
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

    async showUserOwnPage() {

				/*********init Divs**************/
		this._Background = this.initBackground();
		this._Background.className = "flex flex-col items-center justify-start min-h-screen ";

		this._ProfileBanner = document.createElement('div');
		this._ProfileBanner.className = "flex flex-col w-full";
		// this._ProfileBanner.style.backgroundImage = "url('/asset/environements/Sample.png')";
		// this._ProfileBanner.style.backgroundSize = "cover";
		// this._ProfileBanner.style.backgroundPosition = "center";

		this._UserInfo = document.createElement('div');
		this._UserInfo.className = 'flex items-end order-1 order-1 text-sm';

		/*****in profile banner add Username description profile pic ********/
		const HighBanner = document.createElement('div');
		HighBanner.className = "flex flex-col w-full justify-between p-4 bg-sky-400 bg-opacity-50 shadow-md h-64";
		/***********avatar************/
		const AvatarDiv = document.createElement('div');
		AvatarDiv.className = "w-[10%] max-w-[100%] relative translate-y-24 z-10";

		const AvatarCircle = document.createElement('div');
		AvatarCircle.className = "w-full aspect-square flex items-center justify-center bg-orange-300 rounded-full";

		console.log(`user data = ` + JSON.stringify(this._UserData));
		const avatar: string = this._UserData.avatar;
		console.log("avatar in profile = ", avatar);
		const srcImg: string = `https://localhost:4443/uploads/${avatar}`; // problem firefox https autosignate certificate 
		console.log("srcImg in profile = ", srcImg);

		const userImg = document.createElement('img');
		userImg.id = "user-img";
		userImg.className = "w-[95%] h-[95%] rounded-full object-cover object-center";
		userImg.src = srcImg;

		AvatarCircle.appendChild(userImg);
		AvatarDiv.appendChild(AvatarCircle);
		/***********end avatar************/
		/***********************user name + id*******************/
		const UserTextDiv = document.createElement('div');
		UserTextDiv.className = "flex flex-col justify-end w-[60%] text-left p-4 text-emerald-600 relative translate-y-16";

		const userName = document.createElement('h1');
		userName.id = "user-name";
		userName.className = "text-2xl font-bold text-emerald-700";
		userName.textContent =  this._UserData.username;

		const AvatarActionDiv: HTMLElement = document.createElement('div');
		AvatarActionDiv.id = "avatar-action";

		const EditAvatarButton: HTMLButtonElement = document.createElement('button');
		EditAvatarButton.id = "edit-avatar-btn";
		EditAvatarButton.className = "text-emerald-600 hover:font-bold border-2 border-sky-500 hover:border-sky-600 rounded-lg w-32";
		EditAvatarButton.textContent = "Change avatar";

		AvatarActionDiv.appendChild(EditAvatarButton);
		//     <div id="avatar-action"><button id="edit-avatar-btn">Change avatar</button></div>
		UserTextDiv.appendChild(userName);
		UserTextDiv.appendChild(AvatarActionDiv);
		// UserTextDiv.appendChild(UserIDDiv);
		this._UserInfo.appendChild(AvatarDiv);
		this._UserInfo.appendChild(UserTextDiv);

		HighBanner.appendChild(this._UserInfo);

		/***************************bot banner***********************/
		const BotBanner = document.createElement('div');
		BotBanner.className = "flex items-center justify-center bg-sky-500 bg-opacity-50 shadow-md w-full h-16 font-sans";

		const FriendListButton: HTMLAnchorElement = document.createElement('a');
		FriendListButton.className = "flex items-center justify-center h-full w-1/6 hover:text-emerald-700 hover:font-bold text-emerald-600 text-center text-2xl";
		FriendListButton.href = "#";
		FriendListButton.textContent = "Friends";

		const historyButton: HTMLAnchorElement = document.createElement('a');
		historyButton.className = "flex items-center justify-center h-full w-1/6 hover:text-emerald-700 hover:font-bold text-emerald-600 text-center text-2xl";
		historyButton.href = "#";
		historyButton.textContent = "history";


		const ProfileButton: HTMLAnchorElement = document.createElement('a');
		ProfileButton.className = "flex items-center justify-center h-full w-1/6 hover:text-emerald-700 hover:font-bold text-emerald-600 text-center text-2xl";
		ProfileButton.href = "#";
		ProfileButton.textContent = "Profile";

		BotBanner.appendChild(ProfileButton);
		BotBanner.appendChild(FriendListButton);
		BotBanner.appendChild(historyButton);
		// HighBanner.appendChild(BotBanner);
		/***********************end user name + id***************/
		if (this._ProfileBanner && this._UserInfo) {
			this._ProfileBanner.appendChild(HighBanner);
			this._ProfileBanner.appendChild(BotBanner);
			if (this._Background) {
				this._Background.appendChild(this._ProfileBanner);
				this.app.appendChild(this._Background)
			}
		}

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
            editAvatarBtn.addEventListener('click', async () => this.openUploadForm(avatarActionDiv, this._UserData));
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
