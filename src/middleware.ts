export { default } from "next-auth/middleware";

export const config = { matcher: [
    "/get-panel/:path*",
] };