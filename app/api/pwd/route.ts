import { hash, genSalt } from "bcrypt";

export async function POST(req: Request) {
  const { pwd: plainTextPassword } = await req.json();
  const saltRounds = 10; // or any number you prefer
  const salt = await genSalt(saltRounds);
  const hashedPassword = await hash(plainTextPassword, salt);

  return new Response(hashedPassword);
}
