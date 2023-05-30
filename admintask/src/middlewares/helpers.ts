import bcyrpt from "bcrypt";
import random_string from "randomstring"
import { saltRounds } from "../config/app_constant";
import moment from "moment";

const bcryptPassword = async (password: string) => {
  try {
    const hash = await bcyrpt.hashSync(password, saltRounds);
    return hash;
  } catch (error) {
    throw error;
  }
};

const decryptPassword = async (password: string, hash: string) => {
  try {
    const decryt = await bcyrpt.compareSync(password, hash);
    return decryt;
  } catch (error) {
    throw error;
  }
};

const GenerateOtp = async ()=> {
try {
 
    let options = {
        length : 4,
        charset: '123456789'
    }
    let code = random_string.generate(options)
    let otp =`${code}`
    return otp

} catch (error) {
    throw error
}

}
  const get_diff = async (otp_expire_in: any) => {
    try {
      let expire_time = moment(otp_expire_in);
      let currentTime = moment();
      let diff = expire_time.diff(currentTime, "second");
      console.log(diff);
      console.log("time to expire in min", diff / 60);
      return diff
    } catch (error) {
      throw error
    }
  };

export { bcryptPassword, decryptPassword, GenerateOtp, get_diff };
