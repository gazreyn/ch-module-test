import { PropList, PropType } from '@casthub/types'
import css from '@/styles.scss';

export default class extends window.casthub.module {
    userID: number;

    constructor() {
        super();

        // Set the Module HTML using the Template file.
        this.$container.appendChild(this.template());

        // Set the CSS from the external file.
        this.css = css;

        // Module Properties
        this.username = 'kappa';
        this.userID = null;
    }

    public async prepareProps(): Promise<PropList> {
        return {
            username: {
                type: PropType.Text,
                required: true,
                default: 'Kappa',
                label: 'Username',
                help: 'Username of the user whose title you wish to copy',
            },
        };
    }

    public async onPropChange(key: string, value: any, initial: boolean): Promise<any> {
        if(key === 'username') {
            this.username = value;

            this.userID = await this.fetchUserByID(value);

            if(initial) return;

            this.refresh();
        }
        return;
    }

    public async mounted(): Promise<void> {
        await super.mounted();

        console.log()

        // Set the user ID of the module to the username entered in props
        this.userID = await this.fetchUserByID(this.username);

        if(!this.userID) return; // No user ID found, lets finish up here

        this.refresh();
        // setInterval(() => {
        //     this.refresh
        // }, 30000);

    }

    public async fetchUserByID(username: string): Promise<number> {

        const result = await window.casthub.fetch({
            integration: 'twitch',
            method: 'GET',
            url: `kraken/users?login=${username}`,
        });

        try {
            const { _id } = result.users[0];
            return _id;
        } catch (err) {
            console.log("User does not exist");
            return null;
        }

    }

    public async getUserTitle(username?: string): Promise<string> {
        let userID = null;

        if(!username) {
            userID = this.userID;
        } else {
            userID = await this.fetchUserByID(username);
        }        

        if(!userID) return null;

        const result = await window.casthub.fetch({
            integration: 'twitch',
            method: 'GET',
            url: `kraken/channels/${userID}`,
        });

        const { status } = result;
        
        return status;
    }

    async refresh() {
        const title = await this.getUserTitle();

        if(!title) {
            console.log("No title available to user - empty");
            return;
        }

        // Now lets set the title of the user

        console.log(title);
        
    }
}
