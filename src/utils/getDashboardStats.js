import {
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineDocumentDuplicate,
  HiOutlineBookOpen,
} from "react-icons/hi";
export const getDashboardStats = ({ role, data }) => {
  switch (role) {
    case "author":
      return [
        {
          title: "Draft",
          count: data.drafts,
          icon: HiOutlineDocumentDuplicate,
        },
        { title: "Pending Review", count: data.review, icon: HiOutlineClock },
        { title: "Published", count: data.published, icon: HiOutlineEye },
      ];

    case "editor":
      return [
        { title: "Pending Review", count: data.PendingReview, icon: HiOutlineClock },
        { title: "Published", count: data.Published, icon: HiOutlineClock },
        { title: "Total Posts", count: data.TotalPosts, icon: HiOutlineBookOpen },
      ];
    default:
      return [];
  }
};
