export interface IUserSchema {
    email: string;
    firstname: string;
    lastname: string;
    username: string;
    profilePic: string;
    dob: string;
    gender: string;
    referral: string;
    banner: string;
    password: string;
    phoneNumber: string;
    dialCode: string;
    bio: string;
    socialLinks: {
        instagram: string;
        facebook: string;
        github: string;
    };
    address: {
        address: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        area: string;
        state: string;
        country: string;
        countryCode: string;
        postalCode: string;
    };
    status: number,
    createdAt: string | Date | number;
    updatedAt: string | Date | number;
}

export interface IQuerySchema {
    limit?: number,
    skip?: number,
    search?: string,
    id?: string
}