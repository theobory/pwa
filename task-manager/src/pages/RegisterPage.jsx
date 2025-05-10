import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [errorField, setErrorField] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setErrorField(null);
        if (!name || !email || !password) {
            setError("Tous les champs sont requis.");
            return;
        }
        setLoading(true);
        try {
            await register(name, email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
            setErrorField(err.field);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded shadow">
                <img src={logo} alt="Logo" className="h-20 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-center mb-4">Inscription</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Nom</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full border px-4 py-2 rounded ${errorField === "name" ? "border-red-500" : "border-gray-300"}`}
                            placeholder="Votre nom"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full border px-4 py-2 rounded ${errorField === "email" ? "border-red-500" : "border-gray-300"}`}
                            placeholder="Votre email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full border px-4 py-2 rounded ${errorField === "password" ? "border-red-500" : "border-gray-300"}`}
                            placeholder="Votre mot de passe"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? "Inscription en cours..." : "S'inscrire"}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm">
                    Déjà inscrit ?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Connectez-vous
                    </Link>
                </p>
            </div>
        </div>
    );
}
