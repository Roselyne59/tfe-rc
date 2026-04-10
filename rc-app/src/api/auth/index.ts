import { AuthService } from "@/src/services/auth.service";
import { LoginDto, LoginResponse, RegisterDto, RegisterResponse } from "@/src/types/api/Auth";

// Wrapper pour l'authentification
export const AuthAPI = {
    login: async (credentials: LoginDto): Promise<LoginResponse> => {
        return await AuthService.login(credentials);
    },

    register: async (data: RegisterDto): Promise<RegisterResponse> => {
        return await AuthService.register(data);
    },
};

export default AuthAPI;