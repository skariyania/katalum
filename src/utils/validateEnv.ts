import { cleanEnv, str } from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        MONGO_PATH: str(),
        PORT: str(),
    });
}
export default validateEnv
