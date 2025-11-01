import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FaUserAlt, FaUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Logout from "./Logout";
import UpdateProfile from "./UpdateProfile";

const Profile = () => {
  const getProfile = async () => {
    const res = await axios.get("http://localhost:5000/api/v1/user/getUser", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return res.data;
  };

  const { data } = useQuery({
    queryKey: ["getProfile"],
    queryFn: getProfile,
  });

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <div className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-zinc-800/50 transition-all">
          <h1 className="text-lg font-semibold text-white truncate max-w-[140px]">
  {data?.user?.fullName || "User"}
</h1>

          {data?.user?.profilPhoto ? (
            <img
              src={data.user.profilPhoto}
              className="h-10 w-10 rounded-full object-cover border border-cyan-400/50 shadow-md"
              alt="profile"
            />
          ) : (
            <FaUserAlt className="text-2xl text-zinc-300" />
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-56 mt-2 border border-cyan-400/30 rounded-xl shadow-xl bg-[#101a2c]/95 backdrop-blur-xl text-zinc-200"
        align="end"
      >
        <div className="flex flex-col gap-3 p-2">
          <div className="flex items-center justify-between px-3 py-2 hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-all">
            <UpdateProfile />
            <FaUser className="text-zinc-400 text-lg" />
          </div>
          <div className="flex items-center justify-between px-3 py-2 hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-all">
            <Logout />
            <IoLogOutOutline className="text-zinc-400 text-lg" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Profile;
