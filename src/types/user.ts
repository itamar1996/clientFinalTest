export interface IUser extends Document {
    _id: string;
    username:string
    password:string
    organization:string
    area:string
    wepone:[string]
    actions:[string]
}
