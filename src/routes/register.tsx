import { useNavigate } from "react-router";

export function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // For now, just navigate to login after registration
    navigate("/login");
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-dark-gray mb-2">Cadastro</h1>
            <p className="text-gray text-sm">Crie sua conta para acessar o sistema</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-gray mb-2">
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Seu nome completo"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-gray mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-gray mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Crie uma senha forte"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-gray mb-2">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Confirme sua senha"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue text-white py-3 px-4 rounded-lg hover:bg-light-blue transition-colors font-medium"
            >
              Cadastrar
            </button>
          </form>

          {/* Back to Login Section */}
          <div className="mt-6 text-center">
            <p className="text-gray text-sm">
              Já tem uma conta?{" "}
              <button
                onClick={handleBackToLogin}
                className="text-blue hover:text-blue-700 font-medium transition-colors"
              >
                Voltar para o login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
