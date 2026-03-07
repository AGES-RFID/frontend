import { useNavigate } from "react-router";

export function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="mx-auto w-fit space-y-6 py-12">
      <h1 className="text-xl">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Usuário
          <input
            className="block rounded border border-gray-400"
            type="text"
            name="username"
          />
        </label>
        <label className="block">
          Senha
          <input
            className="block rounded border border-gray-400"
            type="password"
            name="password"
          />
        </label>

        <button
          className="w-full rounded border border-red-700 bg-red-600 py-1 font-semibold text-white hover:bg-red-800"
          type="submit"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
