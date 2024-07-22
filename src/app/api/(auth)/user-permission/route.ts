import { query } from "@/lib/Database/databaseConnect";
import { JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

type Permission = {
    permission_id: Number,
    permission_name: string,
    description: string
}

export async function GET(request: NextRequest){
    const decodedTokenHeader = request.headers.get('x-decoded-token');
    if (!decodedTokenHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let decodedToken : JWTPayload;
    try {
        decodedToken = JSON.parse(decodedTokenHeader);
        if(!decodedToken.employee_id) throw new Error('Employee_id not in decoded token')
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }
    
    try{
        const employee_id = Number(decodedToken.employee_id);
        const fetchUserGroupFromDB = await query('SELECT user_group_memberships.group_id, user_groups.group_name, user_groups.description FROM user_group_memberships JOIN user_groups ON user_group_memberships.group_id = user_groups.group_id WHERE employee_id = $1', [employee_id]);
        let group_id:Number;
        let group_name: string;
        let group_description: string;
        if(fetchUserGroupFromDB.rowCount === 0){
            group_name = "Default";
            const fetchDefaultGroupIDFromDB = await query("SELECT group_id, description FROM user_groups WHERE group_name = $1", [group_name]);
            if(fetchDefaultGroupIDFromDB.rowCount === 0) throw new Error("User Group 'Default' does not exist");
            group_id = fetchDefaultGroupIDFromDB.rows[0].group_id;
            group_description = fetchDefaultGroupIDFromDB.rows[0].description;
        }
        else{
            group_name = fetchUserGroupFromDB.rows[0].group_name;
            group_id = fetchUserGroupFromDB.rows[0].group_id;
            group_description = fetchUserGroupFromDB.rows[0].description;
        }
        const fetchPermissionsFromDB = await query("SELECT user_group_permissions.permission_id, permissions.permission_name, permissions.description FROM user_group_permissions LEFT JOIN permissions ON user_group_permissions.permission_id = permissions.permission_id WHERE group_id = $1", [group_id]);

        let permissions: Array<Permission> = [];
        if(fetchPermissionsFromDB.rowCount === 0){
            const fetchDefaultPermissionFromDB = await query("SELECT * FROM permissions WHERE permission_name = $1", ["Default"]);
            if(fetchDefaultPermissionFromDB.rowCount === 0) throw new Error("No 'default' permission in permissions");
            permissions.push(fetchDefaultPermissionFromDB.rows[0]);
        }
        else{
            const permissionList = fetchPermissionsFromDB.rows;
            permissionList.forEach(permission => permissions.push(permission));
        }
        
        return NextResponse.json({
            "user_group": {
                "group_id": group_id,
                "group_name": group_name,
                "group_description": group_description,
                "permissions" : permissions
            }
        })

    }
    catch(error){
        console.error(`ERROR: couldn't complete the permission fetching process. \n ${error}`);
        return NextResponse.json({error: "Couldn't fetch permissions"});
    }

}