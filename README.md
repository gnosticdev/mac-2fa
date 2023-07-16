# Mac 2fa Text Message Receiver

Mac users know the absolute dread of actually having to click on a 2fa text notification, open the Messages app, then manually copy and paste my code into my browser.

Luckily, MacOS stores a copy of all iMessages and SMS messages from icloud (if enabled) in an sqlite database on disk, so we can make a script to get those 2fa messages without needing to access the Messages app.

## I like bun, and I cannot lie

-   Uses [`Bun`](https://bun.sh) instead of Node bc no one should use node if they dont have to.
-   Uses [`drizzle-orm`](https://orm.drizzle.team/) as a type-safe query builder, and bc I like to over engineer simple things.
-   Can run as a binary file, so you can use it in any workflow app you want.
-   Uses mac's native sqlite3 library

## Requirements

-   [`bun`](https://bun.sh/docs/installation)
-   MacOS 10.15+ with Messages app

### Install Bun

```sh
curl -fsSL https://bun.sh/install | bash
```

### The easy part

1. clone the repo and cd into it

```sh
git clone https://github.com/ninxadev/mac-2fa.git && cd /path/to/mac-2fa
```

2.  build the executable binary file

```sh
bun run build-binary
```

3.  use the newly created binary file inside a workflow app of your choosing - such as Automator, Shortcuts, Keyboard Maestro, etc.

**\*IMPORTANT:** Whatever app you use will need Full Disk Access enabled - keep this in mind if you download Shortcuts from the internet...

**Optional**

add a `ignore.json` file to the root, and a `ignoredNumbers` property with an array of phone numbers you want to ignore.
**Note:** the phone numbers must be 5-6 digits with no spaces, no dashes, no parentheses.

```json
{
    "ignoredNumbers": ["555666"]
}
```

## Usage: Automator Example

-   Create an Automator Quick Action, then add:

    -   `Run Shell Script` - Enter the path to the copy2fa binary file (`/path/to/copy2fa`)
    -   `Set Value of Variable` - Set the variable to a name of your choosing (I used `2fa`)
    -   `Copy to Clipboard` - This will copy the output of the shell script to your clipboard
    -   `Display Notification` - Optional, but I like to know when it's done.

-   Set a keyboard shortcut in System Preferences > Keyboard > Shortcuts > Services

## Other repos that are better than this one

-   [imessage exporter](https://github.com/ReagentX/imessage-exporter) - the magnum opus.
-   [imessage reader](https://github.com/niftycode/imessage_reader) - also very cool.
