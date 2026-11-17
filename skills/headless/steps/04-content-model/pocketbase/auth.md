# Login

Email and password only. The built-in `users` auth collection has `email`, `password`, `name` and `avatar`; it needs no setup. Set its rules in `schema.json` (the example keeps each user's record private to that user, and `patterns.md` adds an admin flag).

## One form: sign in or create the account

```ts
import { ClientResponseError } from "pocketbase"

export async function signInOrUp(email: string, password: string) {
  if (password.length < 8) throw new Error("Use at least 8 characters.")
  try {
    return await pb.collection("users").authWithPassword(email, password)
  } catch (signInError) {
    if (!(signInError instanceof ClientResponseError) || signInError.status !== 400) throw signInError
  }
  try {
    await pb.collection("users").create({ email, password, passwordConfirm: password })
  } catch (createError) {
    const emailTaken = createError instanceof ClientResponseError && createError.response?.data?.email?.code === "validation_not_unique"
    if (emailTaken) throw new Error("That email already has an account with a different password.")
    throw createError
  }
  return pb.collection("users").authWithPassword(email, password)
}
```

With the plain HTML SDK, use `PocketBase.ClientResponseError`.

- A wrong password and an unknown email both return 400 "Failed to authenticate."; the create step tells them apart.
- The platform limits sign-in attempts to 20 per 5 minutes per IP for signed-out visitors (`*:auth`), which slows password guessing. A 429 means wait.
- Show the error message next to the form; keep the typed email.

## Session

```ts
pb.authStore.isValid
pb.authStore.record
pb.authStore.onChange((token, record) => setUser(record), true)
pb.authStore.clear()
```

The SDK keeps the session in `localStorage` (`pocketbase_auth`). Call `pb.collection("users").authRefresh()` on app start when `isValid` is true, to pick up changes made in the dashboard (such as an admin flag), and clear the store if it fails.

## Mail-dependent features

Email verification, password reset and email change send mail, and outgoing mail is off on a new backend. Until the owner sets an SMTP server in the dashboard (Settings > Mail settings):

- Do not require `verified = true` in rules.
- Do not show a "Forgot password?" link. The owner can set a new password for a user in the dashboard.

Once mail works: `pb.collection("users").requestPasswordReset(email)` sends the reset link, and `requestVerification(email)` sends a verification link. The links open PocketBase's own confirmation pages under `https://<domain>/_/`, so the app needs no page of its own for them.
