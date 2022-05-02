const {Schema, model} = require("mongoose")

const runningRouteSchema = new Schema(
    {
        name: String,
        startPoint: Number,
        endPoint: Number,
        distance: String,
        time: String,
        private: Boolean,
        creator: {
            type: Schema.Types.ObjectId, 
            ref: 'User',
            unique: true
        },
        followers: [{
            type: Schema.Types.ObjectId, 
            ref: 'User'
        }]
    },
    {
        timestamps: true
    }
)

const runningRoute = model("runningRoute", runningRouteSchema)

module.exports = runningRoute