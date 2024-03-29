import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { registerUserValidation } from "../validation/user-validation";
import { validate } from "../validation/validation";
import bcrypt from "bcrypt";

interface RegisterRequest {
    // add other properties from the request object
    username: string;
    name: string;
}

const register = async (request: RegisterRequest) => {
    const user = validate(registerUserValidation, request);
    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, 'Username already exists');
    }

    user.password = await bcrypt.hash(user.password, 10);
    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true,
        }
    });
}