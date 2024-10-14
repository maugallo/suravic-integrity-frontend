export interface UserRole {
    title: string,
    value: string
}

export const USER_ROLES: UserRole[] = [
    { title: 'Dueño', value: 'DUENO' },
    { title: 'Encargado', value: 'ENCARGADO' },
]