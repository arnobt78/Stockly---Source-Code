import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { comparePassword, generateToken } from "../../../utils/auth";

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Request method:", req.method);
  if (req.method !== "POST") {
    console.error("Method Not Allowed");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { email, password } = loginSchema.parse(req.body);
    console.log("Parsed request body:", { email, password });

    console.log("Starting database query...");
    const start = Date.now();
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    });
    const end = Date.now();
    console.log(`Database query completed in ${end - start}ms`);

    if (!user) {
      console.error("Invalid email or password");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.error("Invalid email or password");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user.id);
    console.log("Generated token:", token);

    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
