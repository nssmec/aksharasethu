import "better-auth";

declare module "better-auth" {
    interface User {
        role: "GUEST" | "STUDENT" | "VOLUNTEER" | "ADMIN";
    }
}