import Box from "./box";
import { auth, signIn, signOut } from "../../auth";

export default async function LoginPage() {
  const session = await auth();
  return (
    <section className="flex min-h-[calc(100dvh-4rem)] w-full items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900/40 p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold text-zinc-100 text-center">
          {session ? "Account" : "Login"}
        </h1>

        {session ? (
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Box
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3H10c-1.1 0-2 .9-2 2v4h2V5h10v14H10v-4H8v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                </svg>
              }
              text="Sign out"
            />
          </form>
        ) : (
          <>
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
            >
              <Box
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="h-4 w-4"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611 20.083H42V20H24v8h11.303C33.602 31.91 29.197 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.676 5.053 29.594 3 24 3 12.955 3 4 11.955 4 23s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306 14.691l6.571 4.819C14.407 16.108 18.839 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.676 5.053 29.594 3 24 3 16.318 3 9.656 7.337 6.306 14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 43c5.137 0 9.757-1.969 13.285-5.18l-6.135-5.182C29.059 34.091 26.661 35 24 35c-5.176 0-9.572-3.071-11.289-7.437l-6.57 5.058C9.46 39.556 16.227 43 24 43z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611 20.083H42V20H24v8h11.303c-1.086 3.011-3.225 5.447-5.738 7.001l.001-.001 6.135 5.182C37.291 41.2 44 36 44 23c0-1.341-.138-2.651-.389-3.917z"
                    />
                  </svg>
                }
                text="Continue with Google"
              />
            </form>

            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/" });
              }}
            >
              <Box
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.123-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.51 11.51 0 0 1 3.003-.404c1.018.005 2.042.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23.655 1.653.242 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.625-5.48 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z" />
                  </svg>
                }
                text="Continue with GitHub"
              />
            </form>

            <form
              action={async () => {
                "use server";
                await signIn("facebook", { redirectTo: "/" });
              }}
            >
              <Box
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="#1877F2"
                    aria-hidden
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.49 0-1.953.926-1.953 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.063 24 12.073z" />
                  </svg>
                }
                text="Continue with Facebook"
              />
            </form>
          </>
        )}

        <p className="mt-3 text-center text-xs text-zinc-500">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </section>
  );
}
