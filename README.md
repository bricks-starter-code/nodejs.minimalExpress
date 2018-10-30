# Boilerplate for NodeJS + Express

## index.js

The minimal example for express (based on an example from eth Express website).

## passport.js

An example of using passport + OAuth to restrict a nodejs+express app to a select group of users. To use:
- Add the client id and client secret after generating them (lines 16 and 17).
- Add the callback URL, "/auth/github/callback" if you do not change line 73. Set this on line 18.
- Add a session secret on line 19.
- Add the user names that should be granted access to the site to the array on line 90.

This code **has not** been reviewed by a security expert. Please do not use this (or any) code in a production environment without a proper security review.
