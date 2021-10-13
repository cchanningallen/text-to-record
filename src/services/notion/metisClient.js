const { Client } = require('@notionhq/client');
import { roles } from '../../constants';

class NotionMetisClient {
    constructor({ authToken }) {
        this._notion = new Client({ auth: authToken });
    }

    async addLogTodo(parsedSMS, sender) {
        const text = parsedSMS.join('\n');

        if (sender.role != roles.admin) {
            console.error(
                '[NotionMetisClient] Non-admin attempted to add metis note'
            );
            return text;
        }

        await this._createLogTodo(text, sender);

        return text;
    }

    async _createLogTodo(text, sender) {
        const content = `${sender.name[0]}: ${text}`;

        try {
            const response = await this._notion.blocks.children.append({
                block_id: process.env.NOTION_METIS_LOG_PAGE_ID,
                children: [
                    {
                        object: 'block',
                        type: 'to_do',
                        to_do: {
                            text: [
                                {
                                    type: 'text',
                                    text: {
                                        content,
                                    },
                                },
                            ],
                        },
                    },
                ],
            });
        } catch (error) {
            console.error(error.body);
        }
    }
}

const authToken = process.env.NOTION_METIS_TOKEN;
export default new NotionMetisClient({ authToken });
