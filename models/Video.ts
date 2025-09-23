import mongoose, { Schema, model, models } from "mongoose";
 

// Video Model dimensions
export const VIDEO_DIMENSIONS = {
    width: 120,   
    height: 180   
} as const;



export interface IVideo {
    _id?: mongoose.Types.ObjectId
    title: string;
    description: string;
    VideoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformion?: {
        height: number;
        width: number;
        quality?: number;
    };
}                                    

const videoSchema = new Schema<IVideo>(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        VideoUrl: {type: String, required: true},
        thumbnailUrl: {type: String, required: true},
        controls: {type: Boolean, default: true},
        transformion: {
            height: {type: Number, default: VIDEO_DIMENSIONS.height},
            width: {type: Number, default: VIDEO_DIMENSIONS.width},
            quality: {type: Number, min:1, max:100 },


        },
    
    },
    {
        timestamps: true
    }
);

const Video = models?.Video || model<IVideo>("Video", videoSchema)

export default Video;