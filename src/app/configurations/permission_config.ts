export type PermissionRoute = {
    permission_name: string,
    url: Array<string>|null,
    api: Array<string>|null
}

export const PermissionRoutes: Array<PermissionRoute> = [
    {
        permission_name: "default",
        url: null,
        api: null
    },
    {
        permission_name: "create_user",
        url: ["/action/create-user"],
        api: ["/api/permissions/signup"]
    }

]