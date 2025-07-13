import UserProfile from "../modles/UserProfile.model.js"

const isFollowed = async (targetUserId ,currentUserId) => {
        const isFollowing =await UserProfile.findOne({follower:currentUserId,profile:targetUserId})
        return isFollowing?true:false
}
export default isFollowed