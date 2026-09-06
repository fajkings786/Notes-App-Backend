import mongoose from "mongoose"

const ConnectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connected successfully now you can move.")
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

export default ConnectDB