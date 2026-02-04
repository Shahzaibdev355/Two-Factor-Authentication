
import bcrypt from "bcryptjs";

export const hashValue = async (value: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value, salt);
    return hashedPassword;
};


export const compareValues = async (enteredValue: string, HashValue: string) => bcrypt.compare(enteredValue, HashValue);
