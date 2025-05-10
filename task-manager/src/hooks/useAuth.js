import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import api from "../services/apiService";

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        localStorage.setItem('token', token);

        let profile = null;
        try {
            const profileRes = await api.get(`/users/${user.uid}`);
            profile = profileRes.data;
        } catch (err) {
            console.warn("Profil non trouvé en base, utilisateur partiel.");
        }

        context.login({ user, profile, token });
    };

    const register = async (name, email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        const token = await user.getIdToken();
        localStorage.setItem('token', token);
        await api.post("/auth/register", { email, name, uid: user.uid });

        let profile = null;
        try {
            const profileRes = await api.get(`/users/${user.uid}`);
            profile = profileRes.data;
        } catch (err) {
            console.warn("Profil non trouvé en base après inscription.");
        }

        context.login({ user, profile, token });
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('token');
        context.logout();
    };

    return {
        ...context,
        login,
        register,
        logout,
    };
}
