# [DO NOT DELETE] Repo used as example for an issue.

# sendgrid-memory-issue-677

replica of node server having issues for https://github.com/sendgrid/sendgrid-nodejs/issues/677

# Comments about the Repo

I replaced/remove anything that was private and some minor security features because I don't want those to be public, but if you find anything and you say "hey! this looks like it should not be public.." please let me know and I'll remove it and force push to remove it from the history asap.

This is a replica without the accounts, so here is what I would do to run it:

1. run `npm install`
2. you will need to use something like `Postman` to call the server (this is because our UI lives in S3)
3. disable or create a google recaptcha account
4. update/add SENDGRID_API_KEY, FORWARDING_EMAIL, G_RECAPTCHA_SECRET_KEY constants in env.config.js
5. we have a `deploy.sh` script that might be useful to see how we push it to heroku, but you would have to create the heroku apps and add the remotes manually, e.g. `heroku git:remote --app your-heroku-app-name -r production` then `./deploy.sh production <branch>`.
