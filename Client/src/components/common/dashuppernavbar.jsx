import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function Upperdashnavbar() {
  const { user } = useAuth();

  return (
    <header className="w-full h-16 bg-white/9 backdrop-blur-md border-b border-white/10  px-6">
      <nav className="h-full flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center">
            <img
                src="https://res.cloudinary.com/dznwqaqjw/image/upload/v1783667400/ChatGPT_Image_May_1__2026__02_43_32_PM-removebg-preview_qnxdul.png"
                alt="LeetCore Logo"
                className="h-14 object-contain"
                onError={(e) => { e.target.style.display = "none"; }}
            />
            <h1 className="text-xl galindo tracking-tight text-white ml-2">Leetcore</h1>
          </Link>
        </div>

        {/* User Profile */}
        <div className="flex items-center mr-4 gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-white text-sm font-medium">
              {user?.name || "Guest"}
            </span>
            <span className="text-gray-400 text-xs">
              {user?.email}
            </span>
          </div>

          <img
            src={
              user?.avatar ||
              "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
            }
            alt="User Avatar"
            className="w-11 h-11 rounded-full  object-cover border border-white/10 shadow-md"
            onError={(e) => {
              e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";
            }}
          />
        </div>

      </nav>
    </header>
  );
}

export default Upperdashnavbar;