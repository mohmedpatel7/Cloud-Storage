import SignInPage from "@/components/Users/Signin";

export default function page() {
  return (
    <>
      <SignInPage />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "Sign in",
    description: "Sing in to Cloud Storage.",
  };
}
