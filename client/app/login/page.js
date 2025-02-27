import LoginForm from "../_components/LoginForm";

function LoginPage() {
  return (
    <div className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
