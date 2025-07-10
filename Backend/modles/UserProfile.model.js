import mongoose from 'mongoose';
const userProfileSchema = new mongoose.Schema({
    follower:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        unique:true
    },
     profile:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        unique:true
    }
},{
    timestamps:true
}
  
);
const UserProfile = mongoose.model('UserProfile', userProfileSchema);
export default UserProfile