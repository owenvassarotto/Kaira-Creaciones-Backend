import jwt from "jsonwebtoken"

export const generateJWT = (id, name, email, is_admin, phone_number) => {
    return jwt.sign({ id, name, email, is_admin, phone_number }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    })
}