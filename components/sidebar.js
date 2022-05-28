import Link from "next/link";
import styles from "./sidebar.module.css";

export default function Sidebar() {
  return (
    <nav className={styles.nav}>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/vote">
        <a>Vote</a>
      </Link>
      <Link href="/admin">
        <a>Admin</a>
      </Link>
      <Link href="/token">
        <a>Token</a>
      </Link>
    </nav>
  );
}
