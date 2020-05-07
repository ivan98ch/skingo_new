export interface User {
    uid: string;
    email: string;
    name: string;
    firstSurname: string;
    secondSurname?: string;
    gender?: string;
    birthDate?: string;
}