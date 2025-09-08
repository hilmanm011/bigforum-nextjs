import ProtectedLayout from "@/components/common/protected-layout";
import Home from "./_components/home";

export default function HomePage() {
  return (
    <ProtectedLayout>
      <Home />
    </ProtectedLayout>
  );
}
