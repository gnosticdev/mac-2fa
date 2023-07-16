# Mac 2fa Text Message Copier

_Apple users just got even lazier_

## Copy 2fa codes from Messages app into your clipboard

I know it sounds petty, but I really don't like having to click into my 2fa notification, open the Messages app, then manually copy and paste my code into my browser. After some research, I found out that Mac stores a copy of all iMessages and SMS messages in a database (assuming you have the option enabled on your machine.)

### I like bun, and I cannot lie

-   Uses [`Bun`](https://bun.sh) instead of Node bc no one should use node if they dont have to.
-   Uses [drizzle-orm](https://orm.drizzle.team/) as a type-safe query builder, and bc I like to over engineer simple things.
-   Makes internet browsing much less secure, the way it was intended.
-   No build step, run the .ts file with bun directly

_Note_ You can also extract the raw sql by using the `toSQL()` method in drizzle

### First things first

0. install bun (if you dont have it already)

```sh
curl -fsSL https://bun.sh/install | bash
```

### The easy part

1. clone the repo

```sh
git clone https://github.com/ninxadev/mac-messages.git
```

2. run the script in your terminal or in your editor.

```sh
bun run src/index.ts | pbcopy
```

3. the most recent 2fa code is copied to your clipboard via pbcopy
4. use this command inside of Automator or Shortcuts or Keyboard Maestro to quickly and easily get those pesky 2fa codes from your mac into your clipboard.
