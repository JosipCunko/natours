"use client";
import { Briefcase, Map, Star, Users } from "lucide-react";
import { useCurrentUser } from "./UserContext";

function AdminNav() {
  const { currentUser } = useCurrentUser();
  if (!currentUser?.role === "admin") return null;

  return (
    <div className="admin-nav">
      <h5 className="admin-nav__heading">Admin</h5>
      <ul className="side-nav">
        <li>
          <a href="#">
            <Map />
            Manage tours
          </a>
        </li>
        <li>
          <a href="#">
            <Users />
            Manage users
          </a>
        </li>
        <li>
          <a href="#">
            <Star />
            Manage reviews
          </a>
        </li>
        <li>
          <a href="#">
            <Briefcase />
            Manage bookings
          </a>
        </li>
      </ul>
    </div>
  );
}

export default AdminNav;
