//working moderls in vr
// import { useState } from "react";
// import API from "../utils/api";
// import { useNavigate, Link } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await API.post("/auth/login", { email, password });
    
//     localStorage.setItem("token", res.data.token);
//     localStorage.setItem("role", res.data.user.role);

//     // <-- Add this line
//     localStorage.setItem("userId", res.data.user._id);

//     navigate(res.data.user.role === "admin" ? "/admin" : "/user");
//   } catch (err) {
//     alert(err.response?.data?.error || "Login failed");
//   }
// };


//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-4 p-8 border rounded shadow bg-white w-80"
//       >
//         <h2 className="text-2xl font-bold text-center">Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="p-2 border rounded"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="p-2 border rounded"
//           required
//         />
//         <button type="submit" className="bg-green-500 text-white p-2 rounded">
//           Login
//         </button>
//         <p className="text-center text-sm">
//           Don’t have an account?{" "}
//           <Link to="/register" className="text-blue-500 underline">
//             Register
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }
import { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userId", res.data.user._id);
      navigate(res.data.user.role === "admin" ? "/admin" : "/user");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0B1120]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-8 rounded-2xl shadow-lg bg-[#111827] w-80 border border-gray-700"
      >
        <h2 className="text-3xl font-semibold text-center text-white">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded font-medium transition-all duration-200"
        >
          Login
        </button>
        <p className="text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
