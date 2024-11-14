export interface IUser extends Document {
    _id: string;
    username:string
    password:string
    organization:string
    area:string
    wepone:[IWepone]|null
    actions:[IAction]|null
}
export interface IWepone {
    wepone:string
    amount:number
}

export interface IAction extends Document {
    userID:string
    action:string
    status:string
    area:string
}