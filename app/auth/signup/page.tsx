import { signup } from "../../actions";
import { AuthForm } from "../../components/auth-form";

export default function DaftarPage() {
  return <AuthForm mode="signup" action={signup} />;
}
