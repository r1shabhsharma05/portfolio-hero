import { useState } from "react";
import ChatModal from "./components/ChatModal";
import Home from "./pages/Home";

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <>
      <Home onOpenChat={() => setChatOpen(true)} />
      {chatOpen && <ChatModal onClose={() => setChatOpen(false)} />}
    </>
  );
}
