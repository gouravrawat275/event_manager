import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import Spinner from "../../components/common/Spinner";
import { authApi } from "../../api/authApi";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    authApi.verifyEmail(token).then(() => setStatus("success")).catch(() => setStatus("error"));
  }, [token]);

  if (status === "loading") return <Spinner full />;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      {status === "success" ? (
        <>
          <CheckCircle2 className="mb-4 h-16 w-16 text-emerald-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Verified!</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Your email has been successfully verified.</p>
        </>
      ) : (
        <>
          <XCircle className="mb-4 h-16 w-16 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Failed</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">This link is invalid or has expired.</p>
        </>
      )}
      <Link to="/" className="btn-primary mt-8 inline-flex">Back to Home</Link>
    </div>
  );
};

export default VerifyEmail;
