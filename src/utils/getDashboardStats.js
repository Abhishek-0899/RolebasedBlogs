import {
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineDocumentDuplicate,
  HiOutlineBookOpen,
} from "react-icons/hi";
export const getDashboardStats = ({ role, data }) => {
  // switch (role) {
  if (role === "author") // case "author":
  {
    return [
      {
        title: "Draft",
        count: data.drafts,
        icon: HiOutlineDocumentDuplicate,
      },
      { title: "Pending Review", count: data.review, icon: HiOutlineClock },
      { title: "Published", count: data.published, icon: HiOutlineEye },
    ];
  }
  if (role === "editor") // case "editor":
  {
    return [
      {
        title: "Pending Review",
        count: data.review,
        icon: HiOutlineClock,
      },
      { title: "Published", count: data.published, icon: HiOutlineClock },
      { title: "Total Posts", count: data.totalPosts, icon: HiOutlineBookOpen },
    ];
  }
  // default:
  return [];
  // }
};
