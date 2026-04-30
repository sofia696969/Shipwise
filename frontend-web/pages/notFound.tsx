import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", router.asPath);
  }, [router.asPath]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200/70">ShipWise</p>
        <h1 className="mt-4 text-5xl font-black">404</h1>
        <p className="mt-4 text-base text-slate-300">
          The page you tried to open does not exist in the staff web portal.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
