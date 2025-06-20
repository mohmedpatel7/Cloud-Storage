import MyFiles from "@/components/Users/Myfiles";

export default function page() {
  return (
    <>
      <MyFiles />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "MyFiles",
    description: "View and Manage all Files.",
  };
}
