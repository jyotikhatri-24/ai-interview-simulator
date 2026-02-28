export default function Register() {
  return (
    <div className="page-container">
      <div className="card">
        <h2>Create Account</h2>

        <label>Name</label>
        <input type="text" placeholder="Enter your name" />

        <label>Email</label>
        <input type="email" placeholder="Enter your email" />

        <label>Password</label>
        <input type="password" placeholder="Create password" />

       <label>Confirm Password</label>
        <input type="password" placeholder="Confirm password" />


        <button style={{ width: "100%" }}>Register</button>
      </div>
    </div>
  );
}