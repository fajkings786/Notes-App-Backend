import ImageKit from "@imagekit/nodejs";
import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
});

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

const upload = async (buffer) => {
    
  const response = await client.files.upload({
    file: buffer.toString("base64"),
    fileName: `${Date.now()}.jpg`,
  });

  return response;
};
export default upload