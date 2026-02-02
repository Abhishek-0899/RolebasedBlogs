import Statsgrid from "../../components/Statsgrid";
import Navbar from "../../components/navbar";
import { getDashboardStats } from "../../utils/getDashboardStats";
const AuthorDashboard = () => {
  const statsData = {
    drafts: 0,
    review: 0,
    published: 0,
  };
  const stats = getDashboardStats({ role: "author", data: statsData });
  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center ">
        <div className="w-full max-w-6xl p-10">
          <h1 className="text-2xl font-semibold">Author DashBoard</h1>
          <p className="text-gray-500">
            Manage your blog posts and track performance
          </p>
          <Statsgrid stats={stats} />
        </div>
      </div>
    </>
  );
};

export default AuthorDashboard;
