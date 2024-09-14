import User from "@/lib/models/user-model";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

type ApiHandler = {
  GET?: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  POST?: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  // Definisikan metode lain jika diperlukan
};

const handler: ApiHandler["POST"] = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { username, email, password } = req.body;

      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      res
        .status(201)
        .json({ success: true, message: "Berhasil membuat akun." });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
