# TotpOnline

If you're writing software with 2-Factor Authentication (2FA/MFA) and you're rightfully avoiding using emails or SMS messages, then you're probably implementing one of two well-known algorithms where the user retrieves a code from an app of their phone. If the codes on the user's phone cycle on a regular interval then that's using an algorithm known as Time-based One-Time Password (TOTP).

[Totp-Online](https://totp-online.tobythe.dev) can be used to generate TOTP configurations of all shapes and sizes, as well as generate the codes to use in your software to log in. Use [Totp-Online](https://totp-online.tobythe.dev) to generate TOTP secrets and codes to use while making and testing software secured by TOTP.

Note that it's not cryptographically secure so you shouldn't be using it in production but it does store your configurations in local storage so they're there the next time you visit!

## Support

While most of the TOTP apps that your users will be using only support SHA-1 hashing, 30 seconds time intervals, and 6-digit codes, [Totp-Online](https://totp-online.tobythe.dev) allows you to configure all the possibilities that the [TOTP IETF standard](https://datatracker.ietf.org/doc/html/rfc6238) supports.

The supported hashing algorithms are:

 - SHA-1
 - SHA-224
 - SHA-256
 - SHA-384
 - SHA-512

The supported time intervals (periods) are:

 - 15 seconds
 - 30 seconds
 - 1 minute
 - 2 minutes
 - 5 minutes
 - 10 minutes

[Totp-Online](https://totp-online.tobythe.dev) also supports code lengths between 6 and 10.

## Ranges

When a user inputs their TOTP code into a website or app, they usually don't need to use the current active code specifically. Usually, software that implements TOTP authentication allows the user to input one of a range of codes to allow for clock-drift and the delay it takes for a user to use the code. This means if your code changes, it's still probably good for using for around a minute or so - depending on the software's implementation.

For those developing TOTP into their app, [Totp-Online](https://totp-online.tobythe.dev) allows you to see a whole range of codes for a given configuration. By clicking on the context menu of a config and selecting "View code range" you can see 5 codes into the past and 5 codes into the future. This allows you to test the ranges that your software supports and ensure that it's to your liking.

## To run the app

The app can be found at https://totp-online.tobythe.dev but if you want to run it yourself you can use:

```sh
npm install
npm run dev:ssr
```
