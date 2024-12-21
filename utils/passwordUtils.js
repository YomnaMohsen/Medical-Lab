import bcrypt from 'bcrypt';

class passwordUtils {
    static async gen_password(password) {
        // save hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        return hashedpassword;
    }
}
export default passwordUtils;