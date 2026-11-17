import { login } from "../actions";
import { AuthForm } from "../components/auth-form";

export default function MasukPage() {
  return <AuthForm mode="login" action={login} />;
}
