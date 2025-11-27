import API from "../utils/api";


export async function loginAndGetRole(email, password) {
  try {
    const res = await API.post("/auth/login", { email, password });

    const { token, user } = res.data;
    const { role, email: userEmail, _id } = user;


    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("userId", _id);


const { data: admin } = await API.get("/auth/admin");
if (admin?.email) {
  localStorage.setItem("adminEmail", admin.email);
}


    return { role, email: userEmail };
  } catch (err) {
    console.error("Login failed:", err.response?.data?.error || err.message);
    throw err;
  }
}
