import moment from 'moment';
import { hasuraRequest, buildQueryInputs } from './hasura';
import { DBError } from './errors';

const GQL_USER_RESPONSE = `
    id
    name
    image
    email
    emailVerified: email_verified
    phone
`;

const GQL_DEFINITIONS = {
    name: 'String',
    image: 'String',
    email: 'String',
    phone: 'String',
    email_verified: 'timestamptz',
    updated_at: 'timestamptz!',
};

const GQL_FRAGMENTS = {
    create: () => `
        mutation CreateUser($name: String, $image: String, $email: String, $email_verified: timestamptz) {
            user: insert_users_one(object: {name: $name, email: $email, image: $image, email_verified: $email_verified}) {
                ${GQL_USER_RESPONSE}
            }
        }
    `,
    getByID: () => `
        query GetUserByID($id: Int!) {
            user: users_by_pk(id: $id) {
                ${GQL_USER_RESPONSE}
            }
        }
    `,
    getByEmail: () => `
        query GetUserByEmail($email: String!) {
            users(limit: 1, where: {email: {_eq: $email}}) {
                ${GQL_USER_RESPONSE}
            }
        }
    `,
    getByPhone: () => `
        query GetUserByPhone($phone: String!) {
            users(limit: 1, where: {phone: {_eq: $phone}}) {
                ${GQL_USER_RESPONSE}
            }
        }
    `,
    getByProviderAccount: () => `
        query GetUserByEmail($providerID: String = "", $providerAccountID: String = "") {
            accounts(limit: 1, where: {provider_id: {_eq: $providerID}, provider_account_id: {_eq: $providerAccountID}}) {
                user {
                    ${GQL_USER_RESPONSE}
                }
            }
        }
    `,
    update: ({ typeDef, inputDef }) => `
        mutation UpdateUser($id: Int!, ${typeDef}) {
            user: update_users_by_pk(pk_columns: {id: $id}, _set: {${inputDef}}) {
                ${GQL_USER_RESPONSE}
            }
        }
    `,
    delete: () => `
        mutation DeleteUser($id: Int!) {
            user: delete_users_by_pk(id: $id) {
                id
            }
        }
    `,
};

class Users {
    async create({ name, email, image, emailVerified }) {
        const variables = {
            name,
            image,
            email,
            email_verified: emailVerified,
        };
        const query = GQL_FRAGMENTS.create();

        const { data, errors } = await hasuraRequest({ query, variables });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.user;
    }

    async getByID(id) {
        const variables = { id };
        const query = GQL_FRAGMENTS.getByID();

        const { data, errors } = await hasuraRequest({ query, variables });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.user;
    }

    async getByEmail(email) {
        const variables = { email };
        const query = GQL_FRAGMENTS.getByEmail();

        const { data, errors } = await hasuraRequest({ query, variables });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.users[0];
    }
    async getByPhone(phone) {
        const variables = { phone };
        const query = GQL_FRAGMENTS.getByPhone();
        console.log('getByPhone(phone)');
        console.log({ variables, query });

        const { data, errors } = await hasuraRequest({ query, variables });
        // TODO: Improve error-handling story.
        console.log({ data, errors });
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.users[0];
    }

    async getByProviderAccount(providerID, providerAccountID) {
        const variables = { providerID, providerAccountID };
        const query = GQL_FRAGMENTS.getByProviderAccount();

        const { data, errors } = await hasuraRequest({ query, variables });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.accounts[0] && data.accounts[0].user;
    }

    async update({ id, name, email, image, emailVerified, phone }) {
        const variables = { id, updated_at: moment().format() };
        if (name) {
            variables.name = name;
        }
        if (image) {
            variables.image = image;
        }
        if (email) {
            variables.email = email;
        }
        if (phone) {
            variables.phone = phone;
        }
        // TODO: Uncomment if/when we allow this to be updated outside the
        // Hasura GUI. Will likely depend on db-level permissions, either fully
        // through hasura or by introducting something like a db context.
        //
        // if (emailVerified) {
        //     // Coerce to Postgres-required ISO timestamp
        //     variables.email_verified = moment(emailVerified).format();
        // }
        const queryInputs = buildQueryInputs(variables, GQL_DEFINITIONS);
        const query = GQL_FRAGMENTS.update(queryInputs);

        const { data, errors } = await hasuraRequest({ query, variables });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.user;
    }

    async delete(id) {
        const variables = { id };
        const query = GQL_FRAGMENTS.delete();

        const { data, errors } = hasuraRequest({ query, variables });
        // TODO: Improve error-handling story.
        if (errors) throw new DBError(JSON.stringify({ errors }));

        return data.user;
    }
}

export default new Users();
