import {
  Settings,
  Briefcase,
  Star,
  CreditCard,
  Map,
  Users,
} from "lucide-react";
import Account from "../_components/Account";
import AdminNav from "../_components/AdminNav";

function AccountPage() {
  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <li className="side-nav--active">
              <a href="#">
                <Settings />
                Settings
              </a>
            </li>
            <li>
              <a href="#">
                <Briefcase />
                My bookings
              </a>
            </li>
            <li>
              <a href="#">
                <Star />
                My reviews
              </a>
            </li>
            <li>
              <a href="#">
                <CreditCard />
                Billing
              </a>
            </li>
          </ul>
          <AdminNav />
        </nav>
        <Account />
      </div>
    </main>
  );
}

export default AccountPage;
