import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}
      >
        <Link to="/home">Home</Link> |{" "}
        <Link to="/auth">Auth</Link>
      </nav>
      <Outlet />
    </div>
  );
}