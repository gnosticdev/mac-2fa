# Mac 2fa Text Message Receiver

Mac users know the absolute dread of actually having to click on a 2fa text notification, open the Messages app, then manually copy and paste my code into my browser.

Luckily, MacOS stores a copy of all iMessages and SMS messages from icloud (if enabled) in an sqlite database on disk, so we can make a script to get those 2fa messages without needing to access the Messages app.

## Features

-   Gets the most recent 2fa code from the Messages app (searches for 5-7 digit number from 5-6 digit phone numbers)
-   Ignores messages from phone numbers you specify
-   Can be used in any workflow app that can run a shell script

### I like bun, and I cannot lie

-   Uses [`Bun`](https://bun.sh) instead of Node bc no one should use node if they dont have to.
-   Uses [`drizzle-orm`](https://orm.drizzle.team/) as a type-safe query builder, and bc I like to over engineer simple things.

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

3.

4. Use Automator/Keyboard Maestro to run the script

    - See the [Usage: Automator Example](#usage-automator-example) section below for an example of how to use Automator to run the script.

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

1. create a macos app using the binary file.
   <small>\*Note: This is so the binary runs in the same applicaiton context each time. Therefore you only need to grant Full Disk Access to the new app we create and can run from anywhere.</small>

    - Open Script Editor and create a new Applescript (in ~/Applications/Utilities)
    - Paste the following code into the editor:

        ```applescript
        try
        set result to do shell script "~/Coding/utilities/text-messages/copy2fa"

            on error errMsg
            display dialog "Pesky Error: " & errMsg with title "Script Error"
            return
            end try

        set resultForNotification to result
        set the clipboard to result
        display notification resultForNotification & " copied!" with title "2FA"
        ```

    - Save the script: name it 2FA.app, and save as an Application (File > Save As > File Format: Application)
    - Create an Automator Quick Action, and add "Launce Application" as the only action, and choose 2FA as the app to launch.

-   Set a keyboard shortcut: Check the box in System Preferences > Keyboard > Shortcuts > Services > General > 2FA. Double click on the right side of the row and set a keyboard shortcut. I use Hyperkey + 2. ([can find here](https://hyperkey.app/))

## Other repos that are better than this one

-   [imessage exporter](https://github.com/ReagentX/imessage-exporter) - the magnum opus.
-   [imessage reader](https://github.com/niftycode/imessage_reader) - also very cool.
