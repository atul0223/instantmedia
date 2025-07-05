import mongoose,{Schema} from 'mongoose'
import bcrypt from 'bcrypt'
const userSchema= new Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    password:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true

    },
    profilePic:{
        type:String,
        default:""
    },
    isVerified: { type: Boolean, default: false }
    ,fullName:{
        type:string,
        required:true,
        trim:true
    }
})
userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        return next()
    }
    this.password =await bcrypt.hash(this.password,11)
    return next()
});
userSchema.methods.validatePassword =async function(){
    return await bcrypt.compare(password,this.password)
}
const User =mongoose.model("User",userSchema)
export default User