import { redirect } from "next/navigation";

const page = () => {
  redirect("/error");
};

export default page;
