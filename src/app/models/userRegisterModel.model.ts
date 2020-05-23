export interface UserRegisterModel {
    name: string;
    firstSurname: string;
    secondSurname: string;
    gender: string;
    birthDate: string;
    email: string;
    password: string;
    repeatPassword: string;
    isPremium: number;
    isAdmin: number;
    totalPhotoMade: number;
    firstPhotoDate: string;
}