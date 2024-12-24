import bcrypt from 'bcrypt';

class passwordUtils {
    static async gen_password(password) {
        // save hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        return hashedpassword;
    }

    static async compare_password(password, hashed_password) {
        // compare passwords
        const result = await bcrypt.compare(password, hashed_password);
        return result;
    }
}
export default passwordUtils;