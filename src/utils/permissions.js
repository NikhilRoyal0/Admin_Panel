
export function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export function getModulePermissions(moduleName) {
    const token = sessionStorage.getItem('authToken');

    if (token) {
        const decodedToken = parseJwt(token);

        const permissions = JSON.parse(decodedToken.userData.roleAttribute[0].permissions);

        for (let module of permissions) {
            if (module.module == moduleName) {
                return module.permissionsList;
            }
        }
        return null;
    } else {
        return null;
    }
}
