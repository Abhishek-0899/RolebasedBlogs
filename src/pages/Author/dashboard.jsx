import Statsgrid from "../../components/Statsgrid";
import { getDashboardStats } from "../../utils/getDashboardStats";
import editImage from "../../assets/edit.png";
import deleteImage from "../../assets/delete.png";
import { useNavigate } from "react-router-dom";
const AuthorDashboard = () => {
  const navigate = useNavigate();
  const dateTime = new Date().toLocaleDateString("en-US");
  const statsData = {
    drafts: 0,
    review: 0,
    published: 0,
  };
  const stats = getDashboardStats({ role: "author", data: statsData });
  return (
    <>
      {/* <Navbar /> */}

      <div className="flex justify-center items-center ">
        <div className="w-full max-w-6xl p-10 mt-10">
          <h1 className="text-4xl font-extrabold">Author DashBoard</h1>
          <p className="text-gray-500 mt-2">
            Manage your blog posts and track performance
          </p>
          <Statsgrid stats={stats} />

          {/* displayed data */}
          <div className=" mt-3 ">
            <h2>Your Posts</h2>
            <div className="bg-gray-200 w-full flex flex-col p-5">
              <hr className="bg-white" />
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center ">
                  <h1 className="text-xl">ddf</h1>
                  <p className="rounded-lg bg-gray-300 p-1">draft</p>
                </div>
                <div className="flex gap-3 ">
                  <button
                    className="hover:bg-gray-300 p-1 rounded-lg "
                    onClick={() => navigate("/author/new-posts")}
                  >
                    <img className="w-6 h-6" src={editImage} alt="Logo" />
                  </button>
                  <button className="hover:bg-gray-300 p-1 rounded-lg">
                    <img className="w-6 h-6" src={deleteImage} alt="Logo" />
                  </button>
                </div>
              </div>
              <p className="mt-1">Excpert</p>
              <p className="mt-3">{dateTime}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthorDashboard;
