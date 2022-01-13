### _Text-to-Record: The low-friction way to record your day_

---

👋 Hi there! I'm [Channing](https://www.linkedin.com/in/cchanningallen/).

> **You can't improve what you don't measure**

^that quote has proven particularly impactful in my professional life. This hobby project is my attempt to bring that wisdom into my personal life - by making it as frictionless as possible to record moments I want to measure, using one of the most accessible functions available: SMS.

Text-to-Record (T2R) lets you text a dedicated phone number with a message and, based on how it's formatted, store that message as a categorized record. The records appear in a simple timeline UI on the web, but you can do whatever you want with them - the data is stored in your own [Hasura](https://hasura.io/)-wrapped Postgres database, for GraphQL-based or direct consumption via any other service you point at / link to.

The parsing logic is pretty basic (and specific to me), but feel free to fork this codebase and customize it as you'd like. Prereqs and setup instructions for self-hosting are detailed below.

🙋‍♂️ **Feedback is welcome and appreciated!** Please don't hesitate to open an issue or email me directly via [my github handle] at gmail. Contributions are also welcome - if you're interested, email me and I'll add more detail to the [Contributing section](#contributing).

# Setup

This section explains (1) what's required to host a T2R instance yourself, and (2) how to set things up to make it all work - and extend it!

## Prerequisites

The following services must be set up for T2R to function.

### Fork this repo

Should be straightforward 🙂

### NextJS Hosting

You'll need a place to host your instance; I use [Vercel](https://vercel.com/). Once you've forked this repository, adding free Vercel hosting is as simple as:

1. [Add a new project](https://vercel.com/new) from your Vercel dashboard
1. Import the forked repository
1. Copy the URL provided by Vercel - we'll use this later. It should look something like `the-name-i-chose.vercel.app`

### Twilio

You'll need a Twilio account to use the core SMS functionality.

1. [Set up a Twilio account](https://www.twilio.com/try-twilio) (or sign in, if you already have one)
1. Set up a twilio phone number with "Messaging" configured - [this guide](https://www.twilio.com/blog/register-phone-number-send-sms-twilio-cli) was helpful for me
1. Add a webhook for your hosted url at `/api/twilio-sms` (eg `the-name-i-chose.vercel.app/api/twilio-sms`) via "Phone Numbers" > "Active numbers" > "Messaging" section > "A MESSAGE COMES IN" webhook using POST.

### Hasura

T2R uses [Hasura](https://hasura.io/) for persistence. You'll need to:

1. Set up your own [Hasura Cloud project](https://cloud.hasura.io/projects)
1. Connect a Postgres database following their instructions (I used their one-click-Heroku option)
1. Update your schema to mirror [this one](https://github.com/cchanningallen/text-to-record/blob/main/docs/hasura-schema.md)
1. Copy your Hasura (1) graphql URL & (2) secret

### Auth

T2R uses [NextAuth](https://next-auth.js.org/) for authentication. For it to work, you'll need to:

1. Add providers.
    1. Currently, `.env` and `[...nextauth].js` support Google ([instructions to add](https://next-auth.js.org/providers/google)) and Github ([instructions to add](https://next-auth.js.org/providers/github)), but you can add any provider you want by updating those two files and [adding from the supported list](https://next-auth.js.org/providers/overview)
1. Create a nextauth secret via eg `$ openssl rand -base64 32`

## Development

Prerequisites complete? We're ready to go! 🚀

### Update `.env`

First things first: copy the `.env.sample` file to just `.env` and update it with values from the [Prerequisites](#prerequisites) section

### Install dependencies

Next, install dependencies via `yarn install`

### Running locally

All set! Run the app locally via `yarn dev`

## Deployment

Assuming you've connected your forked repo to Vercel, deployment is as simple as

1. Ensure your env variables are set in Vercel
2. Merge to your `main` branch, and Vercel should handle the rest!

# Backlog

Features to be added:

    - [ ] Add README section for write-to-Notion functionality
    - [ ] Add edit/delete functionality via the UI
    - [ ] Extend parser to import & use a "rules config" for parsing logic
        - [ ] Update parser to consume config
        - [ ] Add config editor to UI
    - [ ] Migrate to TypeScript
    - [ ] Add user-configurable record types
    - [ ] Add user-configurable record theming for record types
    - [ ] Add filter on record list
    - [ ] Add condensed timeline view to quickly, visually comprehend habits over time

# Contributing

If you're interested in contributing, I'd love your help! Just send a message to [my github handle] at gmail and I'll set up a contribution process.
