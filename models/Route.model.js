const {Schema, model} = require("mongoose")

const runningRouteSchema = new Schema(
    {
        name: String,
        startPoint: [String],
        endPoint: [String],
        distance: String,
        time: String,
        private: Boolean,
        image: String,
        creator: {
            type: Schema.Types.ObjectId, 
            ref: 'User',
            unique: false            
        },
        comments:[{
            type: Schema.Types.ObjectId, 
            ref: 'Comment',
        }] 
    },
    {
        timestamps: true
    }
)

const RunningRoute = model("RunningRoute", runningRouteSchema)


module.exports = RunningRoute

