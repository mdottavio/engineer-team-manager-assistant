# Engineer manager assistant client

Simple app to interact with the manager-assistant.

### Environment Variables

```bash
OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=
REMOTELY_API_KEY=
NOTION_SECRET=
NOTION_ASYNC_CHECKINS_DATABASE_ID=
NOTION_SYNC_CHECKINS_DATABASE_ID=
NOTION_30_DAY_FEEDBACK_DATABASE_ID=
NOTION_60_DAY_FEEDBACK_DATABASE_ID=
NOTION_90_DAY_FEEDBACK_DATABASE_ID=
NOTION_180_DAY_FEEDBACK_DATABASE_ID=
NOTION_270_DAY_FEEDBACK_DATABASE_ID=
NOTION_CUSTOMER_NOTES_DATABASE_ID=
```

`OPENAI_API_KEY` can be found in the OpenAI dashboard.
`OPENAI_ASSISTANT_ID` it's the id of the assistant you want to use.
`REMOTELY_API_KEY` Notions' app secret, app should have access to the following databases
`NOTION_ASYNC_CHECKINS_DATABASE_ID` Async checkins database id
`NOTION_SYNC_CHECKINS_DATABASE_ID` Sync checkins database id
`NOTION_30_DAY_FEEDBACK_DATABASE_ID`, `NOTION_60_DAY_FEEDBACK_DATABASE_ID`, `NOTION_90_DAY_FEEDBACK_DATABASE_ID`, `NOTION_180_DAY_FEEDBACK_DATABASE_ID`, `NOTION_270_DAY_FEEDBACK_DATABASE_ID` Feedback databases ids

## Local Development

```sh
npm i
npm run dev
```

**Based on **
https://github.com/steven-tey/chathn/
