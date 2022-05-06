const {Schema, model} = require("mongoose")

const commentSchema = new Schema(
    {
        text: String,
        fromWho: {
            type: Schema.Types.ObjectId, 
            ref: 'User'            
        },
        route: {
            type: Schema.Types.ObjectId, 
            ref: 'RunningRoute',  
        }
    },
    {
        timestamps: true
    }
)

const Comment = model("Comment", commentSchema)


module.exports = Comment

