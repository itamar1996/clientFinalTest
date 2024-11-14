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

export interface IAction {
    _id:string
    userID:string
    action:string
    status:string
    area:string
    isIntersptedable:boolean
    weponeIdForInterpeted?:string

}