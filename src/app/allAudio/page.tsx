import AllAud from "@/components/Users/AllAudio";

export default function page() {
  return (
    <>
      <AllAud />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "Audio",
    description: "View and Manage all Audio Files.",
  };
}
