export type Route = {
    url: string,
    name: string
}

export type PermissionRoute = {
    permission_name: string,
    url: Route|null,
    api: Route|null
}


export type Permission = {
    permission_id: number,
    permission_name: string,
    description: string,
    url_name: string,
    url_address: string,
    api:string
}

export const PermissionRoutes: Array<PermissionRoute> = [
    {
        permission_name: "default",
        url: null,
        api: null
    },
    {
        permission_name: "create_user",
        url:{
                name: "Create User",
                url:"/action/create-user"
            }
        ,
        api: {
                name: "api_signup",
                url:"/api/permissions/signup"
            }
        
    },
    {
        permission_name: "create_user_group",
        url: {
            name: "Create User Group",
            url: "/action/create-user-group"
        },
        api: {
            name: "api_create_user_group",
            url:"/api/permissions/create-user-group"
        }
    }

]