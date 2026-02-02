import Navbar from "../../components/navbar";
import Statsgrid from "../../components/Statsgrid";
import { getDashboardStats } from "../../utils/getDashboardStats";
const EditorDashboard = () => {
  const statsData = {
    PendingReview: 3,
    Published: 4,
    TotalPosts: 1,
  };
  const stats = getDashboardStats({ role: "editor", data: statsData });

  return (
    <div className="">
      <Navbar />
      <div className="flex justify-center items-center ">
        <div className="w-full max-w-6xl p-10">
          <h1 className="font-bold text-black">Editor Dashboard</h1>
          <p className="text-gray-500">Review and manage all blog posts</p>
          <Statsgrid stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default EditorDashboard;
