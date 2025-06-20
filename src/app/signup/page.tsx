import SignUpPage from "@/components/Users/Signup";

export default function page() {
  return (
    <>
      <SignUpPage />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "Sign up",
    description: "Sign up to Cloud Storage.",
  };
}
