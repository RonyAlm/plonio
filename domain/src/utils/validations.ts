export function isValidEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function isValidPassword(password: string): boolean {
    return password.length >= 8;
}

export function isValidName(name: string): boolean {
    return name.trim().length >= 2;
}

export function isValidRole(role: string): boolean {
    return role === "USER" || role === "ADMIN";
}

export function isValidMemberRole(role: string): boolean {
    return role === "USER" || role === "ADMIN" || role === "MANAGER";
}

export function isValidProjectRole(role: string): boolean {
    return role === "USER" || role === "ADMIN" || role === "MANAGER" || role === "EDITOR";
}