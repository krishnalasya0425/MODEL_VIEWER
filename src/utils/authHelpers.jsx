import API from "../utils/api";

/**
 * Logs in the user and returns role + email.
 * Also stores token, role, email, and adminEmail if available.
 */
export async function loginAndGetRole(email, password) {
  try {
    const res = await API.post("/auth/login", { email, password });

    const { token, user } = res.data;
    const { role, email: userEmail, _id } = user;

    // Save core login details
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("userId", _id);

    // ✅ Always fetch admin email after login
   // ✅ Fetch admin email directly
const { data: admin } = await API.get("/auth/admin");
if (admin?.email) {
  localStorage.setItem("adminEmail", admin.email);
}

    // Return role + email
    return { role, email: userEmail };
  } catch (err) {
    console.error("Login failed:", err.response?.data?.error || err.message);
    throw err;
  }
}
